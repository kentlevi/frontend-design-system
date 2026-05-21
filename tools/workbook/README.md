# Content Workbook Sync

How to take a new revision of the **Musticker Content Workbook** (the team's
shared Google Sheet, exported as `.xlsx`) and apply it to the storefront's
i18n locale files.

## The three-step pipeline

```text
.xlsx workbook         →   extract.py    →   per-sheet JSONs
per-sheet JSONs        →   pipeline.py   →   apply_plan_all.json
apply_plan_all.json    →   apply.py      →   frontend/i18n/locales/{en,kr}/**
```

Each step is idempotent — re-run as needed.

## Setup (once)

```bash
cd frontend-documentation/tools/workbook
python -m venv .venv
.venv\Scripts\activate            # PowerShell:  .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Step 1 — Extract sheets

Export the latest workbook revision from Google Sheets as `.xlsx`, then:

```bash
python extract.py --src "C:\path\to\Musticker - Content (N).xlsx" --out .
```

This produces one `Sheet_Name.json` per content sheet (Homepage, Login,
Checkout_Page, Customer_Orders, all `Product_Page_*`, etc.). Column header
variants — `EN`, `EN (Marketing) - v1`, `EN (Marketing) - Implemented`,
`EN (Marketing) - Latest`, the `Text` column on Pop_Up, the `KR(Translation)`
variants — are normalized to canonical keys (`en_v1`, `en_impl`, `en_latest`,
`kr_v1`, …).

The script skips internal sheets like `List of Products`, `SEO`, `Copy of …`.

## Step 2 — Build the diff plan

```bash
python pipeline.py
```

By default this looks for sheet JSONs in the current directory and the
storefront's locale files at `../../../frontend/i18n/locales`. Override with
flags or environment variables:

```bash
python pipeline.py --workbook . --locales "C:\path\to\frontend\i18n\locales"
# or
$env:MUSTICKER_LOCALES = "C:\path\to\frontend\i18n\locales"; python pipeline.py
```

The pipeline:

1. For each known sheet, scans the matching locale **scopes** (`home`, `auth`,
   `checkout`, `product`, etc.) — the `SHEET_SCOPES` map at the top of
   `pipeline.py` declares which scopes belong to which sheet.
2. Tries to match each workbook row to a real locale key by looking up the
   row's English values (`en_impl`, `en_v1`, `en_v2`, `en_marketing`,
   `en_latest`, `figma`) against the **current** EN locale values.
3. When a match is found and the workbook's preferred value (`en_latest` first,
   falling back through `en_marketing`, `en_impl`, `en_v2`, `en_v1`) differs
   from what's in the locale file, it proposes a change. Same for KR.
4. If two different workbook rows propose **different** values for the same
   locale key, that becomes a **conflict** — recorded but never auto-applied.
5. Whitespace-only diffs and placeholder strings (`FOR REVIEW`, `TBD`, `TODO`,
   `N/A`, etc.) are skipped automatically.
6. A `KNOWN_SKIPS` set in `pipeline.py` blacklists strings we never want to
   apply (e.g. a Korean typo carried over from a past sheet revision).

Output: `apply_plan_all.json` written next to the sheet JSONs. Summary printed
to console:

```
=== CLEAN PLAN ===
en/checkout/guest.json: 12 changes
kr/account/orders.json: 7 changes
...

Total clean: 184
Conflicts (skipped): 6
Other skipped: 0
```

**Always open the plan and skim it before applying** — especially the
`conflicts` array. Conflicts mean the workbook is ambiguous; resolve in the
workbook (or in the locale file by hand) and re-run.

## Step 3 — Apply the plan

```bash
python apply.py
```

Writes the proposed values into the matching locale JSON files, preserving
each file's existing indent style and trailing newline. Conflicts and
`KNOWN_SKIPS` entries are not touched.

Console output lists each modified file plus a per-file count:

```
updated: en/checkout/guest.json
updated: kr/account/orders.json
...
=== TOTAL APPLIED: 184 ===
  en/checkout/guest.json: 12
  kr/account/orders.json: 7
  ...
```

If any keys in the plan don't exist in the current locale file (added by the
workbook but the schema hasn't caught up), they're listed under
`=== MISSING KEYS ===` — these need a manual locale-file edit before re-run.

## Troubleshooting

**"missing sheet json: …"**
A sheet in `SHEET_SCOPES` doesn't have a matching JSON in the workbook dir.
Either the workbook dropped that sheet, or the sheet name in the workbook
changed (and so the JSON filename changed). Re-run `extract.py` and confirm.

**"ERR loading …json: …"**
A locale JSON file has a syntax error. Fix the JSON, then re-run.

**Many conflicts**
The workbook has duplicate rows with the same EN but different proposed
values, OR the same EN appears in multiple locale scopes. Either dedupe in
the workbook or tighten the `SHEET_SCOPES` mapping for that sheet.

**Unicode artifacts in KR strings**
Past Google Sheets exports have inserted U+2028 (line separator) characters.
The pipeline leaves these in place; clean them up separately with a one-shot
script if needed.

## Extending — adding a new sheet

1. Make sure `extract.py` doesn't put the sheet in `SKIP_SHEETS`.
2. Add an entry to `SHEET_SCOPES` in `pipeline.py` listing the locale-scope
   directories the sheet's content lives in.
3. Re-run all three steps.

`Product_Page_*` sheets are picked up automatically and scoped to
`product`.
