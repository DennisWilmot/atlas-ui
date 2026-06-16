# Atlas UI

URA-compliant React component library.

## Scripts

```bash
npm run dev
npm run storybook
npm run test
npm run guardrails
npm run paperclip:run
npm run paperclip:doctor
npm run check
```

## Public exports

```ts
import { Button } from "atlas-ui/primitives";
import { MetricView } from "atlas-ui/patterns";
import type { Action, Metric, Row } from "atlas-ui/types";
```

## Development rule

Run before opening a PR:

```bash
npm run check
```

## Architecture

* primitives are dumb UI
* patterns enforce URA behavior
* examples are docs only
* app owns context and data
* library owns contracts and rendering behavior

## Paperclip

Paperclip is configured as the local task and agent board for Atlas UI. See `docs/paperclip-ura-setup.md`.
