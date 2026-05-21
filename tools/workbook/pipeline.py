"""Diff extracted workbook content against frontend i18n locale files.

For each sheet in `SHEET_SCOPES`, this scans the corresponding locale scope(s),
finds keys whose current English value matches any of the sheet's EN columns
(v1/v2/impl/latest/marketing/figma), and proposes the new EN+KR values from the
sheet's `*_latest` (preferred) or earlier columns.

Multiple proposed values for the same key from different rows produce a
conflict, which is recorded but not applied. Whitespace-only diffs and known
placeholder strings ("FOR REVIEW", "TBD", etc.) are skipped automatically.

Output: an `apply_plan_all.json` next to the workbook JSONs. Hand off to
`apply.py` to actually write the changes.

Usage:
    python pipeline.py --workbook "<dir>" --locales "<frontend/i18n/locales dir>"

If args are omitted:
  --workbook defaults to the script directory
  --locales defaults to <script>/../../../frontend/i18n/locales (when run from
            the docs repo) or MUSTICKER_LOCALES env var.
"""
import argparse, json, os, re, sys, glob
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')


# Sheet name (matches extracted JSON filename without .json) -> locale scope
# directories to scan (relative to the `en/` or `kr/` root).
SHEET_SCOPES = {
    "Homepage": ["home", "layout"],
    "Login": ["auth"],
    "Registration": ["auth"],
    "Guided_Tour": ["home"],
    "Search": ["layout"],
    "Navigation_Stickers": ["layout"],
    "Navigation_Roll_Stickers": ["layout"],
    "Navigation_Sheet_Stickers": ["layout"],
    "Pop_Up": ["home", "auth", "cart", "checkout", "account", "product", "layout", "profile", "legal"],
    "Cart_Preview_Cart_Page": ["cart"],
    "Checkout_Page": ["checkout"],
    "Order_Confirmation_Page": ["checkout"],
    "Customer_Address_Book": ["account"],
    "Customer_Orders": ["account"],
    "Customer_Points_Ranks": ["account"],
    "Customer_Profile": ["account", "profile"],
    # Email_Template is backend; skipped intentionally.
}

PLACEHOLDER_RE = re.compile(r"^(FOR\s+(REVIEW|TRANSLATION)|TBD|TODO|N/?A|\?+)$", re.IGNORECASE)

# Known bad KR strings we never want to apply, regardless of what the workbook
# says. Carry-over from past sheet typos.
KNOWN_SKIPS: set[str] = {
    "상품이 성공적으로 업데이트돠었습니다.",
}


def flatten(prefix: str, obj, out: dict) -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            flatten(f"{prefix}.{k}" if prefix else k, v, out)
    elif isinstance(obj, str):
        out[prefix] = obj


def load_locale_index(root: Path, lang: str, scope: str) -> dict:
    base = root / lang / scope
    idx = {}
    if not base.is_dir():
        return idx
    for p in base.rglob("*.json"):
        rel = p.relative_to(root / lang).as_posix()
        try:
            data = json.load(open(p, encoding="utf-8-sig"))
        except Exception as e:
            print(f"  ERR loading {p}: {e}")
            continue
        flat = {}
        flatten("", data, flat)
        idx[rel] = flat
    return idx


def build_index(root: Path, lang: str, scopes: list[str]) -> dict:
    idx = {}
    for s in scopes:
        idx.update(load_locale_index(root, lang, s))
    return idx


def find_en_matches(en_idx: dict, value: str):
    matches = []
    for f, flat in en_idx.items():
        for k, v in flat.items():
            if v == value:
                matches.append((f, k))
    return matches


def is_placeholder(v: str) -> bool:
    return bool(v) and bool(PLACEHOLDER_RE.match(v.strip()))


def whitespace_only_diff(a, b) -> bool:
    if a is None or b is None:
        return False
    return re.sub(r"\s+", " ", a).strip() == re.sub(r"\s+", " ", b).strip()


def run(workbook_dir: Path, locales_dir: Path) -> int:
    # Auto-include any Product_Page_*.json sheets that exist.
    sheet_scopes = dict(SHEET_SCOPES)
    for f in glob.glob(str(workbook_dir / "Product_Page_*.json")):
        safe = Path(f).stem
        sheet_scopes[safe] = ["product"]

    proposals: dict = {}   # (lang, relpath, keypath) -> set of proposed new values
    sources: dict = {}     # (lang, relpath, keypath) -> list of (sheet, scope, current value)

    for sheet, scopes in sheet_scopes.items():
        sheet_path = workbook_dir / f"{sheet}.json"
        if not sheet_path.exists():
            print(f"missing sheet json: {sheet_path}")
            continue
        rows = json.load(open(sheet_path, encoding="utf-8"))
        en_idx = build_index(locales_dir, "en", scopes)
        kr_idx = build_index(locales_dir, "kr", scopes)
        for r in rows:
            en_target = (r.get("en_latest") or r.get("en_marketing") or r.get("en_impl")
                         or r.get("en_v2") or r.get("en_v1"))
            if not en_target:
                continue
            kr_target = (r.get("kr_latest") or r.get("kr_marketing") or r.get("kr_impl")
                         or r.get("kr_v2") or r.get("kr_v1"))
            seen = set()
            for v in (r.get("en_impl"), r.get("en_v1"), r.get("en_v2"),
                      r.get("en_marketing"), r.get("en_latest"), r.get("figma")):
                if not v:
                    continue
                for (fname, kpath) in find_en_matches(en_idx, v):
                    if (fname, kpath) in seen:
                        continue
                    seen.add((fname, kpath))
                    cur_en = en_idx[fname][kpath]
                    cur_kr = kr_idx.get(fname, {}).get(kpath)
                    if (en_target and cur_en != en_target
                            and not is_placeholder(en_target)
                            and not whitespace_only_diff(cur_en, en_target)):
                        key = ("en", fname, kpath)
                        proposals.setdefault(key, set()).add(en_target)
                        sources.setdefault(key, []).append((sheet, r.get("_scope"), cur_en))
                    if (kr_target and cur_kr is not None and cur_kr != kr_target
                            and not is_placeholder(kr_target)
                            and not whitespace_only_diff(cur_kr, kr_target)):
                        key = ("kr", fname, kpath)
                        proposals.setdefault(key, set()).add(kr_target)
                        sources.setdefault(key, []).append((sheet, r.get("_scope"), cur_kr))

    clean: dict = {}
    conflicts: list = []
    for key, vals in proposals.items():
        src = sources[key]
        if len(vals) == 1:
            clean[key] = (next(iter(vals)), src[0][2], src)
        else:
            conflicts.append((key, list(vals), src))

    changes_by_file: dict = {}
    skipped: list = []
    for (lang, rp, key), (new, old, src) in clean.items():
        if new in KNOWN_SKIPS:
            skipped.append((lang, rp, key, old, new, "known_typo"))
            continue
        changes_by_file.setdefault((lang, rp), {})[key] = (new, old, src)

    plan = {
        "changes": {
            f"{l}|{rp}": {k: [n, o] for k, (n, o, s) in km.items()}
            for (l, rp), km in changes_by_file.items()
        },
        "conflicts": [
            {"lang": k[0], "file": k[1], "key": k[2], "values": v, "sources": s}
            for (k, v, s) in conflicts
        ],
        "skipped": skipped,
    }
    plan_path = workbook_dir / "apply_plan_all.json"
    with open(plan_path, "w", encoding="utf-8") as f:
        json.dump(plan, f, ensure_ascii=False, indent=2, default=str)

    total = 0
    print("\n=== CLEAN PLAN ===")
    for (lang, rp), km in sorted(changes_by_file.items()):
        print(f"{lang}/{rp}: {len(km)} changes")
        total += len(km)
    print(f"\nTotal clean: {total}")
    print(f"Conflicts (skipped): {len(conflicts)}")
    print(f"Other skipped: {len(skipped)}")
    print(f"\nPlan written to: {plan_path}")
    return total


def default_locales_dir() -> Path:
    """If running from frontend-documentation/tools/workbook, default to ../../../frontend/i18n/locales."""
    here = Path(__file__).resolve().parent
    candidate = here.parents[2] / "frontend" / "i18n" / "locales"
    return candidate


def main():
    p = argparse.ArgumentParser(description="Build a content-workbook -> locale apply plan.")
    p.add_argument("--workbook", help="Directory containing extracted sheet JSONs (default: script dir).")
    p.add_argument("--locales", help="Path to frontend/i18n/locales (default: sibling repo / env MUSTICKER_LOCALES).")
    args = p.parse_args()

    workbook_dir = Path(args.workbook) if args.workbook else Path(__file__).parent
    locales_dir = (
        Path(args.locales) if args.locales
        else Path(os.environ.get("MUSTICKER_LOCALES", default_locales_dir()))
    )

    if not locales_dir.is_dir():
        print(f"Locales dir not found: {locales_dir}", file=sys.stderr)
        print("Pass --locales <path> or set MUSTICKER_LOCALES.", file=sys.stderr)
        sys.exit(1)

    run(workbook_dir, locales_dir)


if __name__ == "__main__":
    main()
