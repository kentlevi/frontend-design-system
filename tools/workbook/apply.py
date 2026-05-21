"""Apply the workbook->locale change plan produced by `pipeline.py`.

Reads `apply_plan_all.json` (next to the plan-producing script) and writes the
proposed values into the corresponding locale JSON files, preserving the file's
existing indent style and trailing newline.

Conflicts (multiple proposed values for one key) and KNOWN_SKIPS recorded in
the plan are left alone — they require manual review.

Usage:
    python apply.py --plan "<path/to/apply_plan_all.json>" --locales "<frontend/i18n/locales>"

If args are omitted, defaults match `pipeline.py`'s defaults (plan in script
dir, locales auto-discovered relative to a sibling `frontend/` repo).
"""
import argparse, json, os, re, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')


def get_by_path(obj, path: str):
    cur = obj
    for p in path.split("."):
        cur = cur[p]
    return cur


def set_by_path(obj, path: str, value) -> None:
    cur = obj
    parts = path.split(".")
    for p in parts[:-1]:
        cur = cur[p]
    cur[parts[-1]] = value


def apply(plan_path: Path, locales_dir: Path) -> None:
    plan = json.load(open(plan_path, encoding="utf-8"))

    applied: list = []
    missing: list = []

    for ck, changes in plan["changes"].items():
        lang, relpath = ck.split("|", 1)
        file_path = locales_dir / lang / relpath.replace("/", os.sep)
        if not file_path.exists():
            for keypath in changes:
                missing.append((lang, relpath, keypath))
            continue
        raw = open(file_path, encoding="utf-8-sig").read()
        # Detect indent (matches whatever the file currently uses).
        m = re.match(r"^[^\n]*\n( +)", raw)
        indent = len(m.group(1)) if m else 2
        data = json.loads(raw)
        file_modified = False
        for keypath, info in changes.items():
            new_val = info[0]
            try:
                cur = get_by_path(data, keypath)
            except (KeyError, TypeError):
                missing.append((lang, relpath, keypath))
                continue
            if cur == new_val:
                continue
            set_by_path(data, keypath, new_val)
            applied.append((lang, relpath, keypath, cur, new_val))
            file_modified = True
        if file_modified:
            with open(file_path, "w", encoding="utf-8", newline="\n") as f:
                json.dump(data, f, ensure_ascii=False, indent=indent)
                f.write("\n")
            print(f"updated: {lang}/{relpath}")

    print(f"\n=== TOTAL APPLIED: {len(applied)} ===")
    by_file: dict = {}
    for a in applied:
        key = f"{a[0]}/{a[1]}"
        by_file[key] = by_file.get(key, 0) + 1
    for k, n in sorted(by_file.items()):
        print(f"  {k}: {n}")

    if missing:
        print(f"\n=== MISSING KEYS (not in current locale file): {len(missing)} ===")
        for m in missing[:20]:
            print(f"  {m[0]}/{m[1]}::{m[2]}")
        if len(missing) > 20:
            print(f"  ... and {len(missing) - 20} more")


def default_locales_dir() -> Path:
    here = Path(__file__).resolve().parent
    return here.parents[2] / "frontend" / "i18n" / "locales"


def main():
    p = argparse.ArgumentParser(description="Apply a workbook->locale change plan.")
    p.add_argument("--plan", help="Path to apply_plan_all.json (default: script dir).")
    p.add_argument("--locales", help="Path to frontend/i18n/locales (default: sibling repo / env MUSTICKER_LOCALES).")
    args = p.parse_args()

    plan_path = Path(args.plan) if args.plan else Path(__file__).parent / "apply_plan_all.json"
    locales_dir = (
        Path(args.locales) if args.locales
        else Path(os.environ.get("MUSTICKER_LOCALES", default_locales_dir()))
    )

    if not plan_path.exists():
        print(f"Plan not found: {plan_path}", file=sys.stderr)
        print("Run pipeline.py first to generate the plan.", file=sys.stderr)
        sys.exit(1)
    if not locales_dir.is_dir():
        print(f"Locales dir not found: {locales_dir}", file=sys.stderr)
        sys.exit(1)

    apply(plan_path, locales_dir)


if __name__ == "__main__":
    main()
