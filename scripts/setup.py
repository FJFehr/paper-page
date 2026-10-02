#!/usr/bin/env python3
"""
setup.py — paper-page fork setup

Run this script once after using the GitHub template button to replace the
"Penguin Embeddings" demo paper with blank starter files.

Usage:
    python3 scripts/setup.py
"""

import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generate_readme  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = ROOT / "_template"

# Spliced into index.html's <head> between the meta:start/meta:end markers,
# not copied as a file of its own.
HEAD_META = Path("head-meta.html")
META_BLOCK = re.compile(r"(<!-- meta:start[^>]*-->\n).*?(<!-- meta:end -->)", re.S)

# Demo-only assets with no generic placeholder — deleted, not blanked.
DEMO_ONLY_ASSETS = [
    "assets/figures/pipeline.svg",
    "assets/logos/oxu.svg",
    "assets/logos/aqi.svg",
]


def copy_template_files():
    """Copy blank starter files from _template/ into their live locations."""
    copied = []
    for src in TEMPLATE_DIR.rglob("*"):
        if src.is_file():
            rel = src.relative_to(TEMPLATE_DIR)
            if rel == HEAD_META:
                continue
            dst = ROOT / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            copied.append(str(rel))
    return copied


def remove_demo_assets():
    """Remove demo-paper assets that have no generic placeholder to fall back to."""
    removed = []
    for rel in DEMO_ONLY_ASSETS:
        path = ROOT / rel
        if path.exists():
            path.unlink()
            removed.append(rel)
    return removed


def reset_head_meta():
    """Replace the demo paper's <head> metadata with placeholder tags."""
    index = ROOT / "index.html"
    html = index.read_text()
    placeholder = (TEMPLATE_DIR / HEAD_META).read_text()
    new_html, n = META_BLOCK.subn(lambda m: m.group(1) + placeholder + m.group(2), html)
    if n:
        index.write_text(new_html)
    return bool(n)


def main():
    print("Setting up your paper-page...\n")

    copied = copy_template_files()
    removed = remove_demo_assets()
    head_reset = reset_head_meta()
    generate_readme.write_readme(ROOT)

    print("Done!\n")
    print("  Config blanked        ->  edit project.yaml")
    print("  Authors blanked       ->  edit authors.yaml")
    print("  Citation blanked      ->  edit citation.bib")
    print("  Content blanked       ->  edit content/tldr.md, overview.md, method.md,")
    print("                            results.md, takeaways.yaml, taxonomy.md,")
    print("                            results-table.yaml")
    print("  OG image blanked      ->  edit assets/og-image.svg (or replace with a PNG)")
    if head_reset:
        print("  <head> meta blanked   ->  edit index.html's <title>/OG/citation tags")
    else:
        print("  <head> meta NOT reset ->  meta:start/meta:end markers missing from index.html")
    print("  README.md regenerated ->  short paper-page format, from the blanked files above")
    if removed:
        print(f"  Demo assets removed   ->  {len(removed)} file(s) deleted:")
        for f in removed:
            print(f"      {f}")
    print()
    print(f"  {len(copied)} file(s) reset from _template/.")
    print()
    print("Next steps:")
    print("  1. Fill in project.yaml (title, resources, theme palette)")
    print("  2. Fill in authors.yaml (your name, affiliation)")
    print("  3. Write your content in content/*.md and content/*.yaml")
    print("  4. Add your own figures under assets/figures/ and reference them")
    print("     from project.yaml's method section (see the commented example)")
    print("  5. Replace citation.bib with your paper's real citation")
    print("  6. Copy your title/description/authors into index.html's <head> tags")
    print("     (between meta:start and meta:end) until scripts/build.py exists")
    print("  7. Serve locally to check your work: python3 -m http.server")
    print("  8. Re-run `python3 scripts/generate_readme.py` any time you change the")
    print("     files above, to keep README.md in sync")


if __name__ == "__main__":
    if not TEMPLATE_DIR.exists():
        print("Error: _template/ not found — nothing to reset from.", file=sys.stderr)
        sys.exit(1)
    main()
