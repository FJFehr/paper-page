"""
yaml_lite.py — Python port of template/js/yaml-lite.js's parser.

Parses exactly the YAML subset project.yaml / authors.yaml use — see the
docstring in template/js/yaml-lite.js for the full rule set (2-space
indent, `key: value` with colon-then-space/EOL as separator, block-style
lists only, no flow style, no multiline scalars). Kept in lockstep with
that file: a parsing-rule change there needs the same change here.
"""

from __future__ import annotations


def parse_yaml_lite(text: str):
    lines = _tokenize(text)
    pos = [0]

    def peek():
        return lines[pos[0]] if pos[0] < len(lines) else None

    def parse_mapping(indent):
        obj = {}
        while peek() and peek()["indent"] == indent and not peek()["is_item"]:
            content = lines[pos[0]]["content"]
            pos[0] += 1
            assign_key_value(obj, content, indent + 2)
        return obj

    def parse_list(indent):
        arr = []
        while peek() and peek()["indent"] == indent and peek()["is_item"]:
            rest = lines[pos[0]]["content"]
            pos[0] += 1

            if rest == "":
                if peek() and peek()["indent"] == indent + 2:
                    arr.append(parse_list(indent + 2) if peek()["is_item"] else parse_mapping(indent + 2))
                else:
                    arr.append(None)
                continue

            sep = _find_separator(rest)
            if sep == -1:
                arr.append(_parse_scalar(rest.strip()))
                continue

            item = {}
            assign_key_value(item, rest, indent + 2)
            item.update(parse_mapping(indent + 2))
            arr.append(item)
        return arr

    def assign_key_value(obj, content, child_indent):
        sep = _find_separator(content)
        key = (content if sep == -1 else content[:sep]).strip()
        raw_val = "" if sep == -1 else content[sep + 1:].strip()

        if raw_val != "":
            obj[key] = _parse_scalar(raw_val)
            return
        if peek() and peek()["indent"] == child_indent:
            obj[key] = parse_list(child_indent) if peek()["is_item"] else parse_mapping(child_indent)
        else:
            obj[key] = None

    if lines and lines[0]["indent"] == 0 and lines[0]["is_item"]:
        return parse_list(0)
    return parse_mapping(0)


def _tokenize(text: str):
    lines = []
    for raw_line in text.splitlines():
        stripped = _strip_comment(raw_line).rstrip()
        if stripped.strip() == "":
            continue
        indent = len(stripped) - len(stripped.lstrip(" "))
        content = stripped[indent:]
        is_item = False
        if content == "-":
            is_item = True
            content = ""
        elif content[:2] == "- ":
            is_item = True
            content = content[2:]
        lines.append({"indent": indent, "is_item": is_item, "content": content})
    return lines


def _strip_comment(raw_line: str) -> str:
    in_single = in_double = False
    for i, ch in enumerate(raw_line):
        if ch == "'" and not in_double:
            in_single = not in_single
        elif ch == '"' and not in_single:
            in_double = not in_double
        elif ch == "#" and not in_single and not in_double:
            return raw_line[:i]
    return raw_line


def _find_separator(content: str) -> int:
    in_single = in_double = False
    for i, ch in enumerate(content):
        if ch == "'" and not in_double:
            in_single = not in_single
        elif ch == '"' and not in_single:
            in_double = not in_double
        elif ch == ":" and not in_single and not in_double:
            if i + 1 == len(content) or content[i + 1] == " ":
                return i
    return -1


def _parse_scalar(raw: str):
    if raw in ("", "null", "~"):
        return None
    if raw == "true":
        return True
    if raw == "false":
        return False
    if len(raw) >= 2 and raw[0] == raw[-1] == '"':
        return raw[1:-1]
    if len(raw) >= 2 and raw[0] == raw[-1] == "'":
        return raw[1:-1]
    return raw
