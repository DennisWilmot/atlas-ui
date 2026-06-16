# Atlas UI PR Checklist

## Tier

- [ ] Component is correctly placed in `primitives/`, `patterns/`, or `examples/`.
- [ ] No page template is exported from npm.
- [ ] No `examples/` import exists inside `src/primitives/` or `src/patterns/`.

## Data

- [ ] No hardcoded names, emails, URLs, users, roles, metrics, or demo business content.
- [ ] No `fetch()` inside presentational exports.
- [ ] Data is accepted through props.
- [ ] Canonical types are used where applicable.

## Rendering

- [ ] Empty or meaningless data returns `null` by default.
- [ ] `EmptyState` appears only by explicit opt-in.
- [ ] Zero-value metrics are hidden unless explicitly allowed.

## Overflow

- [ ] Select options over 10 upgrade to searchable combobox.
- [ ] Lists over 20 get search plus virtual scroll or pagination.
- [ ] Tables over 50 get search plus filters plus pagination.

## Actions

- [ ] Actions are passed in through props.
- [ ] No fixed Edit / Copy / Delete action menu.
- [ ] Hidden and disabled actions are respected.
- [ ] Empty action surfaces render nothing.

## Storybook

- [ ] Story exists.
- [ ] Empty/hidden behavior story exists where applicable.
- [ ] Overflow story exists where applicable.
- [ ] Disabled/read-only story exists where applicable.

## Tests

- [ ] Component test exists.
- [ ] URA behavior is tested.
- [ ] `npm run check` passes.
