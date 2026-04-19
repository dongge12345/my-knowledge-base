from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import os
from pathlib import Path
import re
import shutil
import subprocess
from typing import Iterable
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "docs"
GENERATED_DIR = DOCS_DIR / "_generated"

MARKDOWN_INLINE_LINK_RE = re.compile(r"!\[([^\]]*)\]\([^)]+\)|\[([^\]]+)\]\([^)]+\)")
MARKDOWN_REFERENCE_LINK_RE = re.compile(r"!\[([^\]]*)\]\[[^\]]*\]|\[([^\]]+)\]\[[^\]]*\]")
MARKDOWN_INLINE_CODE_RE = re.compile(r"`([^`]*)`")
HTML_TAG_RE = re.compile(r"<[^>]+>")

DEFAULT_CONTENT_ROOT_NAMES = (
    "00_Inbox",
    "01_Projects",
    "02_Skills",
    "03_Career",
    "04_Logs",
    "90_Archive",
)

DEFAULT_EXCLUDED_DIR_NAMES = frozenset(
    {
        ".git",
        ".github",
        ".venv",
        "__pycache__",
        "docs",
        "dist",
        "node_modules",
        "site",
        "venv",
    }
)


@dataclass(frozen=True)
class BuildContext:
    root: Path
    docs_dir: Path
    generated_dir: Path
    repo_slug: str = ""
    github_server: str = "https://github.com"
    content_root_names: tuple[str, ...] = DEFAULT_CONTENT_ROOT_NAMES
    excluded_dir_names: frozenset[str] = DEFAULT_EXCLUDED_DIR_NAMES


def default_context() -> BuildContext:
    return BuildContext(
        root=ROOT,
        docs_dir=DOCS_DIR,
        generated_dir=GENERATED_DIR,
        repo_slug=os.environ.get("GITHUB_REPOSITORY", "").strip(),
        github_server=os.environ.get("GITHUB_SERVER_URL", "https://github.com").rstrip("/"),
    )


def main() -> None:
    build_catalog(default_context())


def build_catalog(context: BuildContext) -> None:
    files = discover_markdown_files(context)
    directories = collect_directory_nodes(files)

    if context.generated_dir.exists():
        shutil.rmtree(context.generated_dir)
    context.generated_dir.mkdir(parents=True, exist_ok=True)

    write_root_index(context, files, directories)

    for rel_dir in sorted(path for path in directories if path != Path(".")):
        write_directory_page(context, rel_dir, files, directories)

    for rel_file in sorted(files):
        write_file_page(context, rel_file)


def discover_markdown_files(context: BuildContext) -> list[Path]:
    files: list[Path] = []

    for root_name in context.content_root_names:
        root_dir = context.root / root_name
        if not root_dir.exists():
            continue

        for path in root_dir.rglob("*.md"):
            if is_excluded_path(context, path):
                continue
            files.append(path.relative_to(context.root))

    for path in context.root.glob("*.md"):
        if path.name.startswith("."):
            continue
        files.append(path.relative_to(context.root))

    return sorted(set(files))


def collect_directory_nodes(files: Iterable[Path]) -> set[Path]:
    directories: set[Path] = {Path(".")}

    for rel_file in files:
        current = rel_file.parent
        while True:
            directories.add(current)
            if current == Path("."):
                break
            current = current.parent

    return directories


def is_excluded_path(context: BuildContext, path: Path) -> bool:
    return any(part in context.excluded_dir_names for part in path.parts)


def generated_dir_doc(context: BuildContext, rel_dir: Path) -> Path:
    if rel_dir == Path("."):
        return context.generated_dir / "index.md"
    return context.generated_dir / rel_dir / "index.md"


def generated_file_doc(context: BuildContext, rel_file: Path) -> Path:
    return context.generated_dir / "_files" / rel_file


def github_blob_url(context: BuildContext, rel_path: Path) -> str:
    if not context.repo_slug:
        return ""
    quoted_path = quote(rel_path.as_posix(), safe="/")
    return f"{context.github_server}/{context.repo_slug}/blob/main/{quoted_path}"


def github_tree_url(context: BuildContext, rel_path: Path) -> str:
    if not context.repo_slug:
        return ""
    quoted_path = quote(rel_path.as_posix(), safe="/")
    return f"{context.github_server}/{context.repo_slug}/tree/main/{quoted_path}"


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="ignore")


def sanitize_markdown_excerpt(text: str) -> str:
    text = MARKDOWN_INLINE_LINK_RE.sub(lambda match: (match.group(1) or match.group(2) or "").strip(), text)
    text = MARKDOWN_REFERENCE_LINK_RE.sub(
        lambda match: (match.group(1) or match.group(2) or "").strip(),
        text,
    )
    text = MARKDOWN_INLINE_CODE_RE.sub(r"\1", text)
    text = HTML_TAG_RE.sub("", text)
    return re.sub(r"\s+", " ", text).strip()


def markdown_title(context: BuildContext, rel_file: Path) -> str:
    text = read_text(context.root / rel_file)

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            return stripped.lstrip("#").strip() or rel_file.stem

    return rel_file.stem


def markdown_summary(context: BuildContext, rel_file: Path) -> str:
    text = read_text(context.root / rel_file)

    in_code_block = False
    paragraph: list[str] = []

    for line in text.splitlines():
        stripped = line.strip()

        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue

        if in_code_block:
            continue

        if not stripped:
            if paragraph:
                break
            continue

        if stripped.startswith("#"):
            continue

        paragraph.append(stripped)

    summary = sanitize_markdown_excerpt(" ".join(paragraph).strip())

    if not summary:
        return "暂无摘要，可通过 GitHub 原文链接查看完整内容。"

    if len(summary) > 180:
        return f"{summary[:177]}..."

    return summary


def markdown_preview(context: BuildContext, rel_file: Path, limit: int = 8) -> list[str]:
    text = read_text(context.root / rel_file)

    lines: list[str] = []
    in_code_block = False

    for raw_line in text.splitlines():
        stripped = raw_line.strip()

        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue

        if in_code_block or not stripped or stripped.startswith("#"):
            continue

        cleaned = sanitize_markdown_excerpt(stripped)
        if not cleaned:
            continue

        lines.append(cleaned)
        if len(lines) >= limit:
            break

    return lines


def last_updated(context: BuildContext, rel_path: Path) -> str:
    command = ["git", "log", "-1", "--format=%cI", "--", rel_path.as_posix()]

    try:
        result = subprocess.run(
            command,
            cwd=context.root,
            capture_output=True,
            text=True,
            check=False,
        )
    except OSError:
        return "未知"

    value = result.stdout.strip()
    if not value:
        return "未知"

    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d %H:%M")
    except ValueError:
        return value


def count_files_in_dir(rel_dir: Path, files: Iterable[Path]) -> int:
    total = 0
    for rel_file in files:
        if rel_dir == Path("."):
            if rel_file.parent == Path("."):
                total += 1
            continue

        if rel_dir in rel_file.parents:
            total += 1

    return total


def immediate_child_dirs(rel_dir: Path, directories: Iterable[Path]) -> list[Path]:
    children: list[Path] = []

    for candidate in directories:
        if candidate == Path(".") or candidate == rel_dir:
            continue
        if candidate.parent == rel_dir:
            children.append(candidate)

    return sorted(children)


def immediate_child_files(rel_dir: Path, files: Iterable[Path]) -> list[Path]:
    return sorted(rel_file for rel_file in files if rel_file.parent == rel_dir)


def relative_link(from_doc: Path, to_doc: Path) -> str:
    return os.path.relpath(to_doc, from_doc.parent).replace("\\", "/")


def write_markdown(target: Path, lines: Iterable[str]) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def github_text(url: str, label: str) -> str:
    return f"[{label}]({url})" if url else "仅在 GitHub Actions 构建时生成"


def write_root_index(
    context: BuildContext,
    files: list[Path],
    directories: set[Path],
) -> None:
    target = generated_dir_doc(context, Path("."))
    child_dirs = immediate_child_dirs(Path("."), directories)
    child_files = immediate_child_files(Path("."), files)
    recent_files = sorted(files, key=lambda path: last_updated(context, path), reverse=True)[:15]

    lines = [
        "# 知识库总览",
        "",
        "这个页面会在每次构建站点时自动生成，方便你快速浏览当前知识库结构和内容概要。",
        "",
        "## 顶层栏目",
        "",
        "| 栏目 | Markdown 文档数 | GitHub |",
        "| --- | ---: | --- |",
    ]

    for child_dir in child_dirs:
        dir_doc = generated_dir_doc(context, child_dir)
        internal_link = relative_link(target, dir_doc)
        lines.append(
            "| "
            f"[{child_dir.name}]({internal_link}) | "
            f"{count_files_in_dir(child_dir, files)} | "
            f"{github_text(github_tree_url(context, child_dir), '打开目录')} |"
        )

    if child_files:
        lines.extend(
            [
                "",
                "## 根目录文档",
                "",
                "| 文档 | 最近更新时间 | GitHub |",
                "| --- | --- | --- |",
            ]
        )

        for rel_file in child_files:
            file_doc = generated_file_doc(context, rel_file)
            internal_link = relative_link(target, file_doc)
            lines.append(
                "| "
                f"[{markdown_title(context, rel_file)}]({internal_link}) | "
                f"{last_updated(context, rel_file)} | "
                f"{github_text(github_blob_url(context, rel_file), '原文')} |"
            )

    lines.extend(
        [
            "",
            "## 最近更新",
            "",
            "| 文档 | 路径 | 最近更新时间 |",
            "| --- | --- | --- |",
        ]
    )

    for rel_file in recent_files:
        file_doc = generated_file_doc(context, rel_file)
        internal_link = relative_link(target, file_doc)
        lines.append(
            "| "
            f"[{markdown_title(context, rel_file)}]({internal_link}) | "
            f"`{rel_file.as_posix()}` | "
            f"{last_updated(context, rel_file)} |"
        )

    write_markdown(target, lines)


def write_directory_page(
    context: BuildContext,
    rel_dir: Path,
    files: list[Path],
    directories: set[Path],
) -> None:
    target = generated_dir_doc(context, rel_dir)
    child_dirs = immediate_child_dirs(rel_dir, directories)
    child_files = immediate_child_files(rel_dir, files)

    lines = [
        f"# {rel_dir.name}",
        "",
        f"- 原始路径：`{rel_dir.as_posix()}`",
        f"- Markdown 文档数：{count_files_in_dir(rel_dir, files)}",
        f"- GitHub 目录：{github_text(github_tree_url(context, rel_dir), '打开目录')}",
        "",
    ]

    if child_dirs:
        lines.extend(
            [
                "## 子目录",
                "",
                "| 目录 | Markdown 文档数 | GitHub |",
                "| --- | ---: | --- |",
            ]
        )

        for child_dir in child_dirs:
            child_doc = generated_dir_doc(context, child_dir)
            internal_link = relative_link(target, child_doc)
            lines.append(
                "| "
                f"[{child_dir.name}]({internal_link}) | "
                f"{count_files_in_dir(child_dir, files)} | "
                f"{github_text(github_tree_url(context, child_dir), '打开目录')} |"
            )

        lines.append("")

    if child_files:
        lines.extend(
            [
                "## 文档列表",
                "",
                "| 标题 | 概要 | 最近更新时间 | GitHub |",
                "| --- | --- | --- | --- |",
            ]
        )

        for rel_file in child_files:
            file_doc = generated_file_doc(context, rel_file)
            internal_link = relative_link(target, file_doc)
            lines.append(
                "| "
                f"[{markdown_title(context, rel_file)}]({internal_link}) | "
                f"{markdown_summary(context, rel_file)} | "
                f"{last_updated(context, rel_file)} | "
                f"{github_text(github_blob_url(context, rel_file), '原文')} |"
            )

        lines.append("")

    if not child_dirs and not child_files:
        lines.extend(
            [
                "当前目录下暂未发现可用于展示的 Markdown 文档。",
                "",
            ]
        )

    write_markdown(target, lines)


def write_file_page(context: BuildContext, rel_file: Path) -> None:
    target = generated_file_doc(context, rel_file)
    parent_doc = generated_dir_doc(context, rel_file.parent)
    parent_link = relative_link(target, parent_doc)
    preview_lines = markdown_preview(context, rel_file)

    lines = [
        f"# {markdown_title(context, rel_file)}",
        "",
        f"- 原始路径：`{rel_file.as_posix()}`",
        f"- 所属目录：[查看目录]({parent_link})",
        f"- 最近更新时间：{last_updated(context, rel_file)}",
        f"- GitHub 原文：{github_text(github_blob_url(context, rel_file), '打开文件')}",
        "",
        "## 内容概要",
        "",
        markdown_summary(context, rel_file),
        "",
    ]

    if preview_lines:
        lines.extend(["## 内容预览", ""])
        for line in preview_lines:
            lines.append(f"> {line}")
        lines.append("")

    lines.extend(
        [
            "## 阅读提示",
            "",
            "如果你需要查看完整正文、附件、图片或同目录下的非 Markdown 资源，"
            "请直接打开 GitHub 原文链接。",
        ]
    )

    write_markdown(target, lines)


if __name__ == "__main__":
    main()
