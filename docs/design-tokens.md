# Design Tokens

Atlas UI tokens live in `src/styles/tokens.css` and are consumed by `src/styles/index.css`.

The token layer is the visual contract for the component library. Public components should use these variables for shared color, focus, disabled, spacing, radius, and shadow decisions instead of introducing one-off values.

## Core Tokens

| Token area | Purpose |
| --- | --- |
| `--atlas-color-*` | Shared text, surface, border, intent, subtle state, and overlay colors. |
| `--atlas-space-*` | Reusable spacing scale for layout gaps and component padding. |
| `--atlas-radius-*` | Shared corner radius scale. |
| `--atlas-shadow-*` | Reusable elevation and overlay shadows. |
| `--atlas-focus-*` | Keyboard focus outline and ring values. |
| `--atlas-opacity-*` | Disabled and visualization opacity values. |

## RC Consistency Rules

- Use `--atlas-focus-outline`, `--atlas-focus-outline-offset`, and `--atlas-focus-ring-shadow` for interactive focus treatment.
- Use `--atlas-opacity-disabled` for disabled component states.
- Use `--atlas-color-on-solid` for text or icons on solid intent backgrounds.
- Use subtle intent tokens for low-emphasis status surfaces.
- Use shadow tokens for raised, floating, and overlay surfaces.
- Do not add broad visual redesigns during RC hardening; add tokens only when they remove repeated one-off values or protect accessibility consistency.

## Verification

The shared stylesheet contract is covered by `src/styles/index.test.ts`, which checks for tokenized focus, disabled, solid-surface, shadow, and subtle-state usage.
