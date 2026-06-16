# Paperclip URA Setup

Paperclip is the work board and agent coordination layer for Atlas UI.

Atlas UI remains governed by repo policy:

1. `AGENTS.md`
2. `DESIGN.md`
3. `docs/ura-laws.md`
4. `docs/component-disposition.md`
5. `docs/storybook-policy.md`
6. `scripts/ura-guardrails.mjs`
7. User prompts

If Paperclip work conflicts with these files, refuse the conflicting part and implement the closest compliant alternative.

## Local Instance

The local Paperclip instance was onboarded with:

```bash
npx paperclipai onboard --yes
```

Quickstart mode created a local trusted, private, loopback-only Paperclip server.

| Surface | Value |
|---|---|
| UI | `http://127.0.0.1:3100` |
| API health | `http://127.0.0.1:3100/api/health` |
| Config | `/Users/jackiellc/.paperclip/instances/default/config.json` |
| Data home | `/Users/jackiellc/.paperclip/instances/default` |
| Database | embedded PostgreSQL |
| Storage | local disk |
| Secrets | local encrypted |

Use:

```bash
npm run paperclip:run
npm run paperclip:doctor
npm run paperclip:project
```

## Paperclip Records

Atlas UI is registered under the local `Altas UI` Paperclip organization. The organization name uses the spelling requested during setup; the product and repo remain `Atlas UI`.

| Record | Value |
|---|---|
| Company | `Altas UI` |
| Company ID | `3e75431a-4c18-498b-919c-81d067e4fbb9` |
| Issue prefix | `ALT` |
| Parent goal | `Atlas UI Migration Factory` |
| Parent goal ID | `cbe2be6b-b66d-45b0-9153-a128c5981d53` |
| Project | `Atlas UI Migration Factory` |
| Project ID | `db2898e8-cafb-4b28-87cd-5a58024e5d90` |
| Workspace | `atlas-ui-local` |
| Workspace ID | `8e7fae2a-bbfc-4e86-83ab-00bdba282be4` |
| Local path | `/Users/jackiellc/atlas-ui` |
| Repo URL | `https://github.com/DennisWilmot/atlas-ui` |
| Git push remote | `git@github.com:DennisWilmot/atlas-ui.git` |
| Branch | `main` |

The CLI default context is set to:

```txt
apiBase: http://127.0.0.1:3100
companyId: 3e75431a-4c18-498b-919c-81d067e4fbb9
persona: board
```

The CLI API base intentionally uses the server root. The health endpoint remains available at `/api/health`.

## Migration Factory Board

The Paperclip project is organized as a migration factory:

| Layer | Paperclip goal |
|---|---|
| Repo setup and migration rules | `Phase 0 - Repo setup and migration rules` |
| Foundation and first primitives | `Sprint 1 - Foundation and first primitives` |
| Controls and overlay primitives | `Sprint 2 - Controls and overlay primitives` |
| P0 pattern engine | `Sprint 3 - P0 pattern engine` |
| Legacy application refactors | `Sprint 4 - Legacy application refactors` |
| Intelligence layer | `Sprint 5 - Intelligence layer` |
| Packaging, docs, and quarantine | `Sprint 6 - Packaging docs and quarantine` |
| Hiring and operating model | `CEO staffing and operating model` |

Initial board shape:

| Count | Meaning |
|---|---|
| `66` | Total issues |
| `8` | Parent workstream issues |
| `58` | Child ticket issues |
| `22` | Done |
| `44` | Staged backlog |
| `0` | Blocked |

Important issue anchors:

| Issue | Purpose |
|---|---|
| `ALT-1` | CEO staffing and execution plan |
| `ALT-2` | Phase 0 repo setup and migration rules |
| `ALT-3` | Foundation contracts and headless utilities |
| `ALT-4` | Clean-room primitives |
| `ALT-5` | URA pattern engine |
| `ALT-6` | Legacy application refactors |
| `ALT-7` | URA intelligence layer |
| `ALT-8` | Packaging docs and quarantine |

`ALT-1` includes a `ceo-execution-plan` markdown document with the recommended hiring model and execution sequence.

`ALT-66` was added for `URA-050 - Storybook compliance template` and is owned by the Storybook QA agent.

## Agent Roster

All agents use the `codex_local` adapter, run from `/Users/jackiellc/atlas-ui`, report into the Atlas UI Migration Factory project, and carry a managed instruction bundle.

Every bundle includes `URA_AGENT_CONTRACT.md`, which requires first reading:

1. `/Users/jackiellc/atlas-ui/AGENTS.md`
2. `/Users/jackiellc/atlas-ui/DESIGN.md`
3. `/Users/jackiellc/atlas-ui/docs/ura-laws.md`
4. `/Users/jackiellc/atlas-ui/docs/component-disposition.md`
5. `/Users/jackiellc/atlas-ui/docs/storybook-policy.md`
6. `/Users/jackiellc/atlas-ui/docs/migration-map.md`
7. `/Users/jackiellc/atlas-ui/docs/paperclip-ura-setup.md`
8. `/Users/jackiellc/atlas-ui/scripts/ura-guardrails.mjs`
9. `/Users/jackiellc/atlas-ui/.github/pull_request_template.md`

| Agent | ID | Owns |
|---|---|---|
| Atlas UI URA Program Director | `cfd2364a-16af-4281-b443-eb6d8300d554` | `ALT-1`, `ALT-9` through `ALT-13`, cross-agent governance |
| Atlas UI Foundation Architect | `2de6f2a5-b676-452a-a339-e246731c184f` | `ALT-3`, `ALT-19` through `ALT-24` |
| Atlas UI Primitives Engineer | `9d984a37-e302-4f3b-93d0-cb4b77e62d67` | `ALT-4`, `ALT-25` through `ALT-35` |
| Atlas UI Pattern Engineer | `a9b0dc2a-ce40-4a95-afc4-202aa3c34372` | `ALT-5`, `ALT-36` through `ALT-46` |
| Atlas UI Legacy Migration Specialist | `236e0c6a-a00f-4cba-9fc9-d62176396c51` | `ALT-6`, `ALT-47` through `ALT-53` |
| Atlas UI Intelligence Architect | `6690467e-78cf-42c1-9b25-54e2718d8c33` | `ALT-7`, `ALT-54` through `ALT-59` |
| Atlas UI Storybook QA Engineer | `225dac9f-c21d-477a-b02c-3aa1c48f9888` | `ALT-62`, `ALT-66`, story and test acceptance |
| Atlas UI Packaging CI Engineer | `92cb2c37-309d-43e5-81b9-f32d67710851` | `ALT-8`, `ALT-60` through `ALT-65` |

## Execution Policy

The local Paperclip instance has:

| Setting | Value |
|---|---|
| Agent trust preset | `standard` |
| Isolated workspaces | enabled |
| Project default execution mode | `isolated_workspace` |
| Workspace strategy | `git_worktree` |
| Branch template | `paperclip/{{issue.identifier}}-{{slug}}` |
| Worktree parent | `/Users/jackiellc/.paperclip/instances/default/projects/3e75431a-4c18-498b-919c-81d067e4fbb9/db2898e8-cafb-4b28-87cd-5a58024e5d90/worktrees` |
| Provision command | `npm install` |

The local install does not currently have a real sandbox provider. Paperclip's `low_trust_review` runtime requires both isolated workspaces and a sandbox environment driver, so these agents are configured for runnable local `standard` execution with isolated git worktrees instead of non-runnable low-trust sandbox execution.

Do not treat this as permission to weaken Atlas UI policy. Repo law and `npm run check` remain the release gate.

## How Paperclip Fits Atlas UI

Paperclip owns:

- task intake
- issue grouping
- agent assignment
- project and goal tracking
- workspace metadata
- board-level execution visibility

Atlas UI owns:

- component contracts
- public exports
- URA render behavior
- Storybook coverage
- tests
- guardrail enforcement
- release readiness

Paperclip should never be used to bypass `npm run check`, public export policy, Storybook requirements, or the zero-interface render rules.

## CEO Task Intake

When CEO tasks arrive:

1. Convert requests into Paperclip issues grouped by component, policy, or workflow.
2. Reject non-compliant requirements using the required refusal text in `AGENTS.md`.
3. For each component request, classify the work as `REBUILD`, `REFACTOR`, `REFERENCE_ONLY`, or `EXAMPLE_ONLY`.
4. Keep public implementation in `src/primitives/`, `src/patterns/`, `src/types/`, or `src/headless/`.
5. Keep dashboards, auth pages, marketing layouts, and full screens in `examples/` only.
6. Require stories and tests before marking work done.
7. Run `npm run check` before delivery.

## Execution Team Shape

For a sustained Atlas UI buildout, the lean team should be:

| Role | Responsibility |
|---|---|
| Design systems lead | Owns URA contracts, public APIs, component disposition, and acceptance criteria |
| React component engineer | Builds primitives and patterns with TypeScript, tests, and package exports |
| Storybook and QA engineer | Maintains stories, edge cases, accessibility checks, and guardrail coverage |
| Product operations lead | Converts CEO needs into Paperclip issues, priorities, owners, and delivery checkpoints |
| AI agent operator | Manages Paperclip agents, reviews generated work, and enforces repo policy before merge |

Start lean with one senior frontend/design-systems engineer and one product operations lead. Add QA and AI operations as the component surface grows.

## Done Definition

Paperclip work is not done until the repo is done.

```bash
npm run check
```

Passing Paperclip status alone is not release readiness.
