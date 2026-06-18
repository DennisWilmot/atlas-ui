# Legacy Migration Follow-up Prompt

Use this after the blank repo is scaffolded and the original Intellibus UI source is attached or copied into a read-only reference folder.

```md
You are migrating legacy Intellibus UI components into Atlas UI.

Before coding, read:

- `AGENTS.md`
- `DESIGN.md`
- `docs/ura-laws.md`
- `docs/component-disposition.md`
- `docs/migration-map.md`

The legacy source is reference-only. Do not copy it directly.

## Migration rules

1. Base primitives are rebuilt clean-room.
2. Application components are refactored into URA patterns.
3. Page templates are moved to `examples/` only.
4. Public exports remain limited to `primitives`, `patterns`, `types`, and `headless`.
5. Every migrated component must include Storybook stories and tests.
6. Run `npm run check` before finishing.

## Priority order

1. Tokens + Button + Input + Badge
2. SelectView + Checkbox + Toggle
3. Dropdown + Modal/Overlay + Tabs + Tooltip
4. MetricView + TableView + ActionMenu + ListView
5. CommandSurface + FilterBar + CollapsibleHealth
6. Alerts + Pagination + TreeView
7. Remaining primitives
8. Page examples last

## Per-component process

For each component:

1. Identify disposition:
   - REBUILD
   - REFACTOR
   - REFERENCE_ONLY
   - EXAMPLE_ONLY
   - MERGED

2. Create or update the destination file.

3. Ensure prop-driven API.

4. Remove all:
   - fake names
   - fake emails
   - fake URLs
   - hardcoded app routes
   - hardcoded business metrics
   - `console.log`
   - `fetch()`

5. Add Storybook:
   - default
   - empty/hidden
   - overflow threshold
   - disabled/read-only
   - no actions / with actions where applicable

6. Add tests:
   - render behavior
   - hide behavior
   - overflow behavior
   - action filtering behavior

7. Run:

```bash
npm run check
```

If a user asks for a non-compliant migration, implement the closest compliant alternative and document the reason in the PR notes.
```
