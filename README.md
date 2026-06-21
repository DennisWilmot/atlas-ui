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
import "atlas-ui/styles.css";
import { Button } from "atlas-ui/primitives";
import { MetricView } from "atlas-ui/patterns";
import type { Action, Metric, Row } from "atlas-ui/types";
```

Import the shared stylesheet from `atlas-ui/styles.css`, then import component contracts from the public subpaths.

## Development rule

Run before opening a PR:

```bash
npm run check
```

The consumer-install smoke proof runs as part of `npm run check` and can be invoked directly after a library build with `npm run smoke:consumer`.

## Architecture

* primitives are dumb UI
* patterns enforce URA behavior
* examples are docs only
* app owns context and data
* library owns contracts and rendering behavior

## Paperclip

Paperclip is configured as the local task and agent board for Atlas UI. See `docs/paperclip-ura-setup.md`.
