from pathlib import Path

from scripts import build_catalog


def make_context(
    tmp_path: Path,
    repo_slug: str = "demo-user/demo-repo",
) -> build_catalog.BuildContext:
    docs_dir = tmp_path / "docs"
    docs_dir.mkdir(parents=True, exist_ok=True)
    return build_catalog.BuildContext(
        root=tmp_path,
        docs_dir=docs_dir,
        generated_dir=docs_dir / "_generated",
        repo_slug=repo_slug,
        github_server="https://github.com",
    )


def write_markdown(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def test_discover_markdown_files_filters_roots_and_ignored_directories(tmp_path: Path) -> None:
    context = make_context(tmp_path)

    write_markdown(tmp_path / "00_Inbox" / "capture.md", "# 捕获\n\n内容。")
    write_markdown(tmp_path / "04_Logs" / "Diary" / "today.md", "# 今天\n\n记录。")
    write_markdown(tmp_path / "目录结构说明.md", "# 根目录文档\n")
    write_markdown(tmp_path / "docs" / "ignored.md", "# 不应扫描\n")
    write_markdown(tmp_path / "01_Projects" / "node_modules" / "skip.md", "# 忽略\n")
    write_markdown(tmp_path / "01_Projects" / "dist" / "skip.md", "# 忽略\n")

    files = build_catalog.discover_markdown_files(context)

    assert Path("00_Inbox/capture.md") in files
    assert Path("04_Logs/Diary/today.md") in files
    assert Path("目录结构说明.md") in files
    assert Path("docs/ignored.md") not in files
    assert Path("01_Projects/node_modules/skip.md") not in files
    assert Path("01_Projects/dist/skip.md") not in files


def test_markdown_helpers_extract_title_summary_and_preview(tmp_path: Path) -> None:
    context = make_context(tmp_path)
    rel_file = Path("04_Logs/Diary/example.md")
    write_markdown(
        tmp_path / rel_file,
        "# 本周复盘\n\n第一段第一行。\n第一段第二行。\n\n```python\nprint('skip')\n```\n\n第二段内容。\n",
    )

    assert build_catalog.markdown_title(context, rel_file) == "本周复盘"
    assert build_catalog.markdown_summary(context, rel_file) == "第一段第一行。 第一段第二行。"
    assert build_catalog.markdown_preview(context, rel_file) == [
        "第一段第一行。",
        "第一段第二行。",
        "第二段内容。",
    ]


def test_generated_paths_and_github_links_are_stable(tmp_path: Path) -> None:
    context = make_context(tmp_path, repo_slug="paipaiHighLevel/knowledge-base")
    rel_dir = Path("04_Logs/Diary")
    rel_file = rel_dir / "4月.md"

    assert build_catalog.generated_dir_doc(context, rel_dir) == (
        context.generated_dir / "04_Logs" / "Diary" / "index.md"
    )
    assert build_catalog.generated_file_doc(context, rel_file) == (
        context.generated_dir / "_files" / "04_Logs" / "Diary" / "4月.md"
    )
    assert build_catalog.github_tree_url(context, rel_dir) == (
        "https://github.com/paipaiHighLevel/knowledge-base/tree/main/04_Logs/Diary"
    )
    assert build_catalog.github_blob_url(context, rel_file).endswith(
        "/blob/main/04_Logs/Diary/4%E6%9C%88.md"
    )


def test_build_catalog_generates_root_directory_and_file_pages(tmp_path: Path) -> None:
    context = make_context(tmp_path)

    write_markdown(tmp_path / "00_Inbox" / "capture.md", "# 捕获\n\n记录新的灵感。")
    write_markdown(tmp_path / "04_Logs" / "Diary" / "today.md", "# 今天\n\n完成了一次构建。")
    write_markdown(tmp_path / "目录结构说明.md", "# 目录结构说明\n\n说明入口结构。")

    build_catalog.build_catalog(context)

    root_index = context.generated_dir / "index.md"
    inbox_index = context.generated_dir / "00_Inbox" / "index.md"
    inbox_file = context.generated_dir / "_files" / "00_Inbox" / "capture.md"

    assert root_index.exists()
    assert inbox_index.exists()
    assert inbox_file.exists()

    root_text = root_index.read_text(encoding="utf-8")
    file_text = inbox_file.read_text(encoding="utf-8")

    assert "知识库总览" in root_text
    assert "打开目录" in root_text
    assert "https://github.com/demo-user/demo-repo/tree/main/00_Inbox" in root_text
    assert "GitHub 原文" in file_text
    assert "记录新的灵感。" in file_text
