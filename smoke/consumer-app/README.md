# Atlas UI Consumer Smoke App

This app verifies that a clean Vite consumer can build against the Atlas UI package output.

Run from the repo root:

```bash
npm run smoke:consumer
```

The smoke app imports components and types only from public Atlas UI package entry points. It imports the repo stylesheet directly because the RC export freeze does not include a CSS package subpath.
