# Component Disposition

Legacy Intellibus UI is reference material only.

Do not copy legacy components directly into public exports.

## Disposition meanings

| Disposition | Meaning |
|---|---|
| REBUILD | New implementation; legacy is visual reference only |
| REFACTOR | Keep interaction/visual intent; replace contract and URA behavior |
| REFERENCE_ONLY | Inspiration only; not exported |
| EXAMPLE_ONLY | Storybook/docs/examples only; never npm export |

## Base primitives

Rebuild clean-room in `src/primitives/`.

P0:
- Button
- Input
- Badge
- Checkbox
- Toggle
- Select shell
- Dropdown shell
- Modal / Overlay shell
- Tabs
- Tooltip
- Pagination

## P0 patterns

Build in `src/patterns/`.

- MetricView
- TableView
- ListView
- FieldView
- SelectView
- ActionMenu

## P1 intelligence patterns

Build after P0 is stable.

- CommandSurface
- FilterBar
- Breadcrumbs
- CollapsibleHealth
- PredictedActionBanner
- SplitViewport
- F.O.R.D. sort utility

## Example-only

Never export:

- Dashboards
- Login pages
- Signup pages
- Social/provider auth buttons
- Verification pages
- Forgot password pages
- Settings pages
- Informational pages
- 404 pages
- Email templates
- Illustration assets
- Marketing sections
- CTAs
- Testimonials
- Pricing pages
