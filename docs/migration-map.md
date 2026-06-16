# Migration Map

| Legacy area | New treatment | Destination |
|---|---|---|
| Buttons | REBUILD | `src/primitives/Button` |
| Inputs | REBUILD | `src/primitives/Input` |
| Badges | REBUILD | `src/primitives/Badge` |
| Select | REBUILD + PATTERN | `src/patterns/SelectView` |
| Tables | REFACTOR | `src/patterns/TableView` |
| Metrics | REFACTOR | `src/patterns/MetricView` |
| Empty States | REFACTOR | explicit opt-in only |
| Slideout Menus | REFACTOR | Overlay + injected actions/members |
| Command Menus | REBUILD | `src/patterns/CommandSurface` later |
| Dashboards | EXAMPLE_ONLY | `examples/dashboards/` |
| Login Pages | EXAMPLE_ONLY | `examples/auth/login/` |
| Signup Pages | EXAMPLE_ONLY | `examples/auth/signup/` |
