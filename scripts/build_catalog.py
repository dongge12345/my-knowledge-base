from __future__ import annotations

import os
import re
import shutil
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Iterable
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "docs"
GENERATED_DIR = DOCS_DIR / "_generated"

CONTENT_ROOT_NAMES = [
    "00_Inbox",
    "01_Projects",
    "02_Skills",
    "03_Career",
    "04_Logs",
    "90_Archive",
]

EXCLUDED_DIR_NAMES = {
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

REPO_SLUG = os.environ.get("GITHUB_REPOSITORY", "").strip()
GITHUB_SERVER = os.environ.get("GITHUB_SERVER_URL", "https://github.com").rstrip("/")


def main() -> None:
    files = discover_markdown_files()
    directories = collect_directory_nodes(files)

    if GENERATED_DIR.exists():
        shutil.rmtree(GENERATED_DIR)
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)

    write_root_index(files, directories)

    for rel_dir in sorted(d for d in directories if d != Path(".")):
        write_directory_page(rel_dir, files, directories)

    for rel_file in sorted(files):
        write_file_page(rel_file)


def discover_markdown_files() -> list[Path]:
    files: list[Path] = []

    for root_name in CONTENT_ROOT_NAMES:
        root_dir = ROOT / root_name
        if not root_dir.exists():
            continue

        for path in root_dir.rglob("*.md"):
            if is_excluded_path(path):
                continue
            files.append(path.relative_to(ROOT))

    for path in ROOT.glob("*.md"):
        if path.name.startswith("."):
            continue
        files.append(path.relative_to(ROOT))

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


def is_excluded_path(path: Path) -> bool:
    return any(part in EXCLUDED_DIR_NAMES for part in path.parts)


def generated_dir_doc(rel_dir: Path) -> Path:
    if rel_dir == Path("."):
        return GENERATED_DIR / "index.md"
    return GENERATED_DIR / rel_dir / "index.md"


def generated_file_doc(rel_file: Path) -> Path:
    return GENERATED_DIR / "_files" / rel_file


def github_blob_url(rel_path: Path) -> str:
    if not REPO_SLUG:
        return ""
    quoted_path = quote(rel_path.as_posix(), safe="/")
    return f"{GITHUB_SERVER}/{REPO_SLUG}/blob/main/{quoted_path}"


def github_tree_url(rel_path: Path) -> str:
    if not REPO_SLUG:
        return ""
    quoted_path = quote(rel_path.as_posix(), safe="/")
    return f"{GITHUB_SERVER}/{REPO_SLUG}/tree/main/{quoted_path}"


def markdown_title(rel_file: Path) -> str:
    path = ROOT / rel_file
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="utf-8", errors="ignore")

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            return stripped.lstrip("#").strip() or rel_file.stem

    return rel_file.stem


def markdown_summary(rel_file: Path) -> str:
    path = ROOT / rel_file
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="utf-8", errors="ignore")

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

    summary = " ".join(paragraph).strip()
    summary = re.sub(r"\s+", " ", summary)

    if not summary:
        return "暂无摘要，可通过 GitHub 原文链接查看完整内容。"

    if len(summary) > 180:
        return f"{summary[:177]}..."

    return summary


def markdown_preview(rel_file: Path, limit: int = 8) -> list[str]:
    path = ROOT / rel_file
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="utf-8", errors="ignore")

    lines: list[str] = []
    in_code_block = False

    for raw_line in text.splitlines():
        stripped = raw_line.strip()

        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue

        if in_code_block or not stripped or stripped.startswith("#"):
            continue

        lines.append(stripped)
        if len(lines) >= limit:
            break

    return lines


def last_updated(rel_path: Path) -> str:
    command = ["git", "log", "-1", "--format=%cI", "--", rel_path.as_posix()]
    result = subprocess.run(
        command,
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )

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


def write_root_index(files: list[Path], directories: set[Path]) -> None:
    target = generated_dir_doc(Path("."))
    child_dirs = immediate_child_dirs(Path("."), directories)
    child_files = immediate_child_files(Path("."), files)
    recent_files = sorted(files, key=last_updated, reverse=True)[:15]

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
        dir_doc = generated_dir_doc(child_dir)
        internal_link = relative_link(target, dir_doc)
        lines.append(
            f"| [{child_dir.name}]({internal_link}) | {count_files_in_dir(child_dir, files)} | {github_text(github_tree_url(child_dir), '打开目录')} |"
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
            file_doc = generated_file_doc(rel_file)
            internal_link = relative_link(target, file_doc)
            lines.append(
                f"| [{markdown_title(rel_file)}]({internal_link}) | {last_updated(rel_file)} | {github_text(github_blob_url(rel_file), '原文')} |"
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
        file_doc = generated_file_doc(rel_file)
        internal_link = relative_link(target, file_doc)
        lines.append(
            f"| [{markdown_title(rel_file)}]({internal_link}) | `{rel_file.as_posix()}` | {last_updated(rel_file)} |"
        )

    write_markdown(target, lines)


def write_directory_page(rel_dir: Path, files: list[Path], directories: set[Path]) -> None:
    target = generated_dir_doc(rel_dir)
    child_dirs = immediate_child_dirs(rel_dir, directories)
    child_files = immediate_child_files(rel_dir, files)

    lines = [
        f"# {rel_dir.name}",
        "",
        f"- 原始路径：`{rel_dir.as_posix()}`",
        f"- Markdown 文档数：{count_files_in_dir(rel_dir, files)}",
        f"- GitHub 目录：{github_text(github_tree_url(rel_dir), '打开目录')}",
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
            child_doc = generated_dir_doc(child_dir)
            internal_link = relative_link(target, child_doc)
            lines.append(
                f"| [{child_dir.name}]({internal_link}) | {count_files_in_dir(child_dir, files)} | {github_text(github_tree_url(child_dir), '打开目录')} |"
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
            file_doc = generated_file_doc(rel_file)
            internal_link = relative_link(target, file_doc)
            lines.append(
                f"| [{markdown_title(rel_file)}]({internal_link}) | {markdown_summary(rel_file)} | {last_updated(rel_file)} | {github_text(github_blob_url(rel_file), '原文')} |"
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


def write_file_page(rel_file: Path) -> None:
    target = generated_file_doc(rel_file)
    parent_doc = generated_dir_doc(rel_file.parent)
    parent_link = relative_link(target, parent_doc)
    preview_lines = markdown_preview(rel_file)

    lines = [
        f"# {markdown_title(rel_file)}",
        "",
        f"- 原始路径：`{rel_file.as_posix()}`",
        f"- 所属目录：[查看目录]({parent_link})",
        f"- 最近更新时间：{last_updated(rel_file)}",
        f"- GitHub 原文：{github_text(github_blob_url(rel_file), '打开文件')}",
        "",
        "## 内容概要",
        "",
        markdown_summary(rel_file),
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
            "如果你需要查看完整正文、附件、图片或同目录下的非 Markdown 资源，请直接打开 GitHub 原文链接。",
        ]
    )

    write_markdown(target, lines)


if __name__ == "__main__":
    main()
