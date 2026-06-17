# Migration Map

| Legacy area | New treatment | Destination | Status | Notes |
|---|---|---|---|---|
| Buttons | REBUILD | `src/primitives/Button` | BUILT | Clean-room primitive. |
| Inputs | REBUILD | `src/primitives/Input` | BUILT | Clean-room primitive. |
| Badges | REBUILD | `src/primitives/Badge` | BUILT | Clean-room primitive. |
| Select | REBUILD + PATTERN | `src/patterns/SelectView` | BUILT | Prop-driven select pattern with overflow search. |
| Tables | REFACTOR | `src/patterns/TableView` | BUILT | Prop-driven table pattern with injected actions. |
| Metrics | REFACTOR | `src/patterns/MetricView` | BUILT | Zero-value hiding remains prop-controlled. |
| Calendars | REFACTOR | `src/patterns/CalendarView` | BUILT | Events supplied by props. |
| Empty States | REFACTOR | `src/patterns/EmptyState` | BUILT | Explicit opt-in only. |
| Slideout Menus | REFACTOR | `src/patterns/SlideoutPanel` | BUILT | Overlay-mode panel with injected actions and sections. |
| Command Menus | REBUILD | `src/patterns/CommandSurface` | BUILT | Generic command discovery pattern. |
| Notifications | REFACTOR | `src/patterns/ToastNotification` | BUILT | App controls message data. |
| Dashboards | EXAMPLE_ONLY | `examples/dashboards/` | EXAMPLE_ONLY_DONE | Example-only dashboard reference. |
| Login Pages | EXAMPLE_ONLY | `examples/auth/login/` | EXAMPLE_ONLY_DONE | Auth example only; no public export. |
| Signup Pages | EXAMPLE_ONLY | `examples/auth/signup/` | EXAMPLE_ONLY_DONE | Auth example only; no public export. |
| Forgot Password Pages | EXAMPLE_ONLY | `examples/auth/forgot-password/` | EXAMPLE_ONLY_DONE | Auth example only; no public export. |
| Settings Pages | EXAMPLE_ONLY | `examples/settings/` | EXAMPLE_ONLY_DONE | Storybook-only settings reference; no public export. |
| Email Templates | EXAMPLE_ONLY | `examples/email/` | EXAMPLE_ONLY_DONE | Neutral Storybook reference only; no public export. |

## Legacy Audit Items

| Legacy item | New treatment | Destination | Status | Notes |
|---|---|---|---|---|
| text-editors | REFACTOR | `src/patterns/TextEditor` | BUILT | Toolbar supplied by props. |
| activity-gauges | REFACTOR | `src/patterns/GaugeView` | BUILT | Metric data supplied by props. |
| activity-feeds | REFACTOR | `src/patterns/ActivityFeed` | BUILT | Prop-driven feed; no hardcoded actors. |
| date-pickers | REFACTOR | `src/patterns/DatePicker` | BUILT | Overlay mode selected by props. |
| file-uploaders | REFACTOR | `src/patterns/FileUploader` | BUILT | Upload execution supplied by app. |
| breadcrumbs | REFACTOR | `src/patterns/Breadcrumbs` | BUILT | App supplies trail labels, links, and navigation handling. |
| carousels | REBUILD | `src/primitives/Carousel` | BUILT | Slides supplied by props. |
| multi-select | REFACTOR | `src/patterns/MultiSelectView` | BUILT | Searchable multiple option pattern using canonical `SelectItem` props. |
| pie-charts | REFACTOR | `src/patterns/PieChartView` | BUILT | Segments supplied by props. |
| line-bar-charts | REFACTOR | `src/patterns/LineBarChartView` | BUILT | Series supplied by props. |
| radar-charts | REFACTOR | `src/patterns/RadarChartView` | BUILT | Axes supplied by props. |
| progress-steps | REFACTOR | `src/patterns/ProgressSteps` | BUILT | Step state supplied by props. |
| forgot-password-pages | EXAMPLE_ONLY | `examples/auth/forgot-password/` | EXAMPLE_ONLY_DONE | Storybook-only auth states; no exports, reset URLs, account data, or auth logic. |
| rating-badge-and-stars | REBUILD | `src/primitives/Rating` | BUILT | Value supplied by props. |
| color-pickers | REBUILD | `src/primitives/ColorPicker` | BUILT | Color value and optional swatches supplied by props. |
| slideout-menus | REFACTOR | `src/patterns/SlideoutPanel` | BUILT | Overlay-mode panel with injected actions and sections. |
| illustrations | EXAMPLE_ONLY | `examples/assets/illustrations/` | EXAMPLE_ONLY_DONE | Clean-room neutral assets only; no public export. |
| informational-pages | EXAMPLE_ONLY | `examples/informational/` | EXAMPLE_ONLY_DONE | Page example only; not exported from public package entries. |
| verification-pages | EXAMPLE_ONLY | `examples/auth/verification/` | EXAMPLE_ONLY_DONE | Page example only; no public export. |
| verification-code-inputs | REBUILD | `src/patterns/VerificationCodeInput` | BUILT | Input pattern supplied by props. |
| messaging | REFACTOR | `src/patterns/MessageListView` | BUILT | No hardcoded users; message data, metadata, and actions supplied by props. |
| login-pages | EXAMPLE_ONLY | `examples/auth/login/` | EXAMPLE_ONLY_DONE | Documentation-only Storybook examples; no public export. |
| signup-pages | EXAMPLE_ONLY | `examples/auth/signup/` | EXAMPLE_ONLY_DONE | Storybook-only neutral reference; not exported. |
| social-buttons | EXAMPLE_ONLY | `examples/auth/social-buttons/` | EXAMPLE_ONLY_DONE | Dedicated neutral provider button reference; apps own provider identity, routing, and analytics. |
| settings-pages | EXAMPLE_ONLY | `examples/settings/` | EXAMPLE_ONLY_DONE | Storybook-only neutral reference; not exported. |
| email-templates | EXAMPLE_ONLY | `examples/email/` | EXAMPLE_ONLY_DONE | Neutral Storybook reference only; no public exports. |
| header-navigations | EXAMPLE_ONLY | `examples/navigation/headers/` | EXAMPLE_ONLY_DONE | App-owned layout reference only; no public export. |
| sidebar-navigations | REFACTOR | `src/patterns/SidebarNavigation` | BUILT | Navigation data supplied by app. |
| mobile-app-store-buttons | EXAMPLE_ONLY | `examples/marketing/app-store-buttons/` | EXAMPLE_ONLY_DONE | Marketing example only; no public export. |
| inline-ctas | EXAMPLE_ONLY | `examples/marketing/inline-ctas/` | EXAMPLE_ONLY_DONE | Marketing example only; no public export. |
| section-headers | EXAMPLE_ONLY | `examples/sections/headers/` | EXAMPLE_ONLY_DONE | Storybook-only neutral reference; no public export. |
| section-footers | EXAMPLE_ONLY | `examples/sections/footers/` | EXAMPLE_ONLY_DONE | Reference/example only; not exported. |
| not-found-sections | EXAMPLE_ONLY | `examples/not-found/` | EXAMPLE_ONLY_DONE | Storybook-only neutral not-found section references; not exported. |
