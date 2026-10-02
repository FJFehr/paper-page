#!/usr/bin/env python3
"""
generate_readme.py — regenerate README.md from project.yaml / authors.yaml /
citation.bib.

A forked repo's README.md shouldn't stay this template's own long
explanatory doc (the one with "Why this exists" / "Quick Start" / etc.) --
that documents *paper-page*, not the paper. This produces the short,
paper-specific README format already used by when-rubrics-fail and
legal-reward-bench: title, one-line description of the paper + authors,
live link, resource links, citation, footer credit.

Run any time after editing project.yaml, authors.yaml, or citation.bib to
keep README.md in sync -- there's no watcher, this is a manual re-run step
(same "tiny generation step is fine" spirit as the deferred scripts/build.py,
see tasks/00-overview.md).

Usage:
    python3 scripts/generate_readme.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from yaml_lite import parse_yaml_lite  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_REPO_URL = "https://github.com/FJFehr/paper-page"

# (resources key, emoji, label) -- checked in this order after arXiv/paper.
RESOURCE_ICONS = [
    ("code", "💻", "Code"),
    ("dataset", "🤗", "Dataset"),
    ("demo", "🎥", "Demo"),
    ("slides", "📊", "Slides"),
]
_HANDLED_RESOURCE_KEYS = {"paper", "code", "dataset", "demo", "slides"}


def _surname(full_name: str) -> str:
    return full_name.strip().split()[-1]


def _affiliation_summary(authors_data: dict) -> str:
    aff_by_id = {a["id"]: a["name"] for a in (authors_data.get("affiliations") or []) if a}
    seen = []
    for author in authors_data.get("authors") or []:
        for aid in author.get("affiliations") or []:
            name = aff_by_id.get(aid)
            if name and name not in seen:
                seen.append(name)
    return " / ".join(seen)


def _links_section(project: dict) -> list[str]:
    paper = project.get("paper") or {}
    resources = project.get("resources") or {}
    lines = []

    arxiv = paper.get("arxiv")
    paper_url = resources.get("paper")
    if arxiv:
        lines.append(f"- 📄 [arXiv](https://arxiv.org/abs/{arxiv})")
    elif paper_url:
        lines.append(f"- 📄 [Paper]({paper_url})")

    for key, icon, label in RESOURCE_ICONS:
        url = resources.get(key)
        if url:
            lines.append(f"- {icon} [{label}]({url})")

    # Unknown resource keys still get a link, same "never dropped" rule
    # project.yaml's comments document for the rendered buttons.
    for key, url in resources.items():
        if key not in _HANDLED_RESOURCE_KEYS and url:
            lines.append(f"- 🔗 [{key.replace('_', ' ').title()}]({url})")

    return lines


def build_readme(project: dict, authors_data: dict, citation_text: str) -> str:
    paper = project.get("paper") or {}
    social = project.get("social") or {}

    heading = paper.get("short_title") or paper.get("title") or "Project Page"
    title = paper.get("title") or heading

    authors_list = authors_data.get("authors") or []
    author_str = ", ".join(_surname(a["name"]) for a in authors_list if a and a.get("name"))
    aff_str = _affiliation_summary(authors_data)

    intro = f'This is the academic project page for "{title}"'
    if author_str:
        intro += f" ({author_str})"
    if aff_str:
        intro += f", {aff_str}"
    intro += "."

    parts = [f"# {heading}", "", intro]

    canonical_url = social.get("canonical_url")
    if canonical_url:
        parts += ["", f"Live at **{canonical_url}**."]

    link_lines = _links_section(project)
    if link_lines:
        parts += ["", "## Links", ""] + link_lines

    citation_text = (citation_text or "").strip()
    if citation_text:
        parts += ["", "## Citation", "", "```bibtex", citation_text, "```"]

    parts += ["", f"Built with [Paper Pages]({TEMPLATE_REPO_URL})."]

    return "\n".join(parts) + "\n"


def generate(root: Path = ROOT) -> str:
    project = parse_yaml_lite((root / "project.yaml").read_text())
    authors_data = parse_yaml_lite((root / "authors.yaml").read_text())
    citation_text = (root / "citation.bib").read_text()
    return build_readme(project, authors_data, citation_text)


def write_readme(root: Path = ROOT) -> None:
    (root / "README.md").write_text(generate(root))


def main():
    write_readme()
    print("README.md regenerated from project.yaml, authors.yaml, and citation.bib.")


if __name__ == "__main__":
    main()
