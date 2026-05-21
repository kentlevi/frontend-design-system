# app/mappers

**Currently empty.** Scaffolded to mirror the storefront's `app/mappers/`
directory layout, but the documentation site doesn't have shape-conversion
needs — the guide pages render directly from `app/data/` literals.

If a future guide needs to translate raw shapes (e.g. workbook JSON →
display rows for a documentation table), keep the mapper functions here
rather than inline in the page, and name them `<source>To<target>.ts`.
