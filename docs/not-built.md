# Not-Built Decisions

Atlas UI treats the legacy migration audit as an accounting list, not as a promise that every row becomes a standalone package export.

This document records the audit rows that were intentionally kept out of the public `atlas-ui` package surface during the `v0.1.0-rc.1` release-candidate hardening pass.

## Audit Summary

| Metric | Count | Source |
| --- | ---: | --- |
| Legacy audit rows | 78 | `docs/migration-map.md` |
| Audit rows marked `Public export = yes` | 58 | `docs/migration-map.md` |
| Shipped public components | 59 | `docs/public-api-manifest.md` |
| Non-export audit rows | 20 | `docs/migration-map.md` |
| `REFERENCE_ONLY` rows | 2 | `docs/migration-map.md` |
| `MERGED` rows | 2 | `docs/migration-map.md` |
| `EXAMPLE_ONLY` rows | 16 | `docs/migration-map.md` |

`docs/public-api-manifest.md` reports one additional shipped public component, `Select`, because it was built from the `Select shell` baseline in `docs/component-disposition.md` and is not represented by its own dedicated migration-map row.

## Decision Rules

- `REFERENCE_ONLY` means the legacy source stays as inspiration or documentation until Atlas UI has a stable generic contract worth shipping.
- `MERGED` means the legacy item is covered by an existing generic pattern and should not reopen as a duplicate public export.
- `EXAMPLE_ONLY` means the legacy item is a full-screen, app-owned, marketing, or documentation composition that belongs in `examples/` only.
- Public exports remain limited to `src/primitives`, `src/patterns`, `src/types`, and `src/headless`.

## Reference-Only Rows

| Legacy slug | Label | Destination | Why it is not a public export |
| --- | --- | --- | --- |
| `qr-codes` | `QRCodeReference` | `docs/component-disposition.md` | Held as reference until Atlas UI has a real generic utility contract. |
| `code-snippets` | `CodeSnippetReference` | `docs/component-disposition.md` | Kept on the docs/example surface unless a reusable package contract is promoted later. |

## Merged Rows

| Legacy slug | Label | Destination | Why it is not a standalone public export |
| --- | --- | --- | --- |
| `file-lists` | `FileListView` | `src/patterns/ListView` | Covered by generic `ListView` item rendering. |
| `data-grids` | `DataGrid` | `src/patterns/TableView` | Covered by generic `TableView` columns and rows. |

## Example-Only Quarantine

| Legacy slug | Label | Destination | Why it is quarantined |
| --- | --- | --- | --- |
| `dashboards` | `Dashboards` | `examples/dashboards/` | Full-screen example material only. |
| `settings-pages` | `Settings pages` | `examples/settings/` | Settings layouts are app-owned and Storybook-only. |
| `login-pages` | `Login pages` | `examples/auth/login/` | Auth pages are documentation-only reference material. |
| `signup-pages` | `Signup pages` | `examples/auth/signup/` | Signup flows are page examples, not reusable package exports. |
| `verification-pages` | `Verification pages` | `examples/auth/verification/` | Verification flows stay as page-level examples only. |
| `forgot-password-pages` | `Forgot password pages` | `examples/auth/forgot-password/` | Auth state examples only; no reset routes or account logic ship publicly. |
| `informational-pages` | `Informational pages` | `examples/informational/` | Informational screens remain example compositions, not library components. |
| `not-found-sections` | `Not found sections` | `examples/not-found/` | Neutral not-found treatments stay in Storybook/examples only. |
| `email-templates` | `Email templates` | `examples/email/` | Email layouts are documentation assets, not package exports. |
| `header-navigations` | `Header navigations` | `examples/navigation/headers/` | Header layouts are app-owned structure, not reusable public primitives/patterns. |
| `inline-ctas` | `Inline CTAs` | `examples/marketing/inline-ctas/` | Marketing calls to action remain example-only. |
| `section-headers` | `Section headers` | `examples/sections/headers/` | Section compositions stay quarantined as examples. |
| `section-footers` | `Section footers` | `examples/sections/footers/` | Footer compositions remain reference/example material only. |
| `mobile-app-store-buttons` | `Mobile app store buttons` | `examples/marketing/app-store-buttons/` | Marketing-specific app-store treatments do not belong in the public package. |
| `social-buttons` | `Social buttons` | `examples/auth/social-buttons/` | Provider identity, routing, and analytics are app-owned concerns. |
| `illustrations` | `Illustrations` | `examples/assets/illustrations/` | Clean-room illustration assets stay in examples and never ship as API surface. |

## Release Candidate Effect

These decisions keep the original 78-row audit from being reopened as 78 package exports. For `v0.1.0-rc.1`, the public `atlas-ui` surface stays aligned to the shipped primitives and patterns manifest, while app-owned layouts and legacy references remain quarantined in docs or `examples/`.
