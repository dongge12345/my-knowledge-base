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


def test_markdown_excerpt_helpers_strip_relative_links(tmp_path: Path) -> None:
    context = make_context(tmp_path)
    rel_file = Path("00_Inbox/links.md")
    write_markdown(
        tmp_path / rel_file,
        "# Links\n\nSee [Guide](README.md), [Source](./docs/source-reading.md) and `code`.\n",
    )

    assert build_catalog.markdown_summary(context, rel_file) == "See Guide, Source and code."
    assert build_catalog.markdown_preview(context, rel_file) == ["See Guide, Source and code."]
