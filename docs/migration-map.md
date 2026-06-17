# Migration Map

Every legacy audit item must be accounted for before it can be rebuilt, refactored, merged, or parked as reference/example material. Public exports remain limited to `src/primitives`, `src/patterns`, `src/types`, and `src/headless`.

Allowed dispositions: `REBUILD`, `REFACTOR`, `REFERENCE_ONLY`, `EXAMPLE_ONLY`, `MERGED`.

Allowed statuses: `NOT_STARTED`, `IN_PROGRESS`, `BUILT`, `EXAMPLE_ONLY_DONE`, `REFERENCE_ONLY_DONE`, `MERGED`, `BLOCKED`.

| Legacy slug | Label | Disposition | Destination | Public export | Current status | Owner | PR | Notes |
|---|---|---|---|---|---|---|---|---|
| buttons | Buttons | REBUILD | `src/primitives/Button` | yes | BUILT | Squad A | main | Canonical button primitive. |
| inputs | Inputs | REBUILD | `src/primitives/Input` | yes | BUILT | Squad A | main | Canonical text input primitive. |
| badges | Badges | REBUILD | `src/primitives/Badge` | yes | BUILT | Squad A | main | Canonical badge primitive. |
| checkboxes | Checkbox | REBUILD | `src/primitives/Checkbox` | yes | BUILT | Squad A | pending | Batch 1 primitive. |
| toggles | Toggle | REBUILD | `src/primitives/Toggle` | yes | BUILT | Squad A | pending | Batch 1 primitive. |
| dropdown-menus | DropdownMenu | REBUILD | `src/primitives/DropdownMenu` | yes | BUILT | Squad A | pending | Primitive shell, not ActionMenu. |
| overlays | Overlay | REBUILD | `src/primitives/Overlay` | yes | BUILT | Squad A | pending | Modal, sheet, and drawer by props. |
| modals | Modal | REBUILD | `src/primitives/Modal` | yes | BUILT | Squad A | pending | Thin modal preset over Overlay. |
| tabs | Tabs | REBUILD | `src/primitives/Tabs` | yes | BUILT | Squad A | pending | Keyboard-capable tab primitive. |
| tooltips | Tooltip | REBUILD | `src/primitives/Tooltip` | yes | BUILT | Squad A | pending | Low-level disclosure primitive. |
| pagination | Pagination | REBUILD | `src/primitives/Pagination` | yes | BUILT | Squad A | pending | Hides single-page state by default. |
| alerts | Alert | REBUILD | `src/primitives/Alert` | yes | BUILT | Squad C | pending | Injected actions only. |
| avatars | Avatar | REBUILD | `src/primitives/Avatar` | yes | NOT_STARTED | Squad B | pending | No legacy asset URLs. |
| avatar-groups | AvatarGroup | REBUILD | `src/primitives/AvatarGroup` | yes | NOT_STARTED | Squad B | pending | Needs overflow behavior. |
| badge-groups | BadgeGroup | REBUILD | `src/primitives/BadgeGroup` | yes | NOT_STARTED | Squad B | pending | Needs collapse behavior. |
| button-groups | ButtonGroup | REBUILD | `src/primitives/ButtonGroup` | yes | NOT_STARTED | Squad B | pending | Segmented or attached buttons. |
| radios | Radio | REBUILD | `src/primitives/Radio` | yes | NOT_STARTED | Squad B | pending | Base radio primitive. |
| radio-groups | RadioGroup | REBUILD | `src/primitives/RadioGroup` | yes | NOT_STARTED | Squad B | pending | Option collection primitive. |
| textareas | Textarea | REBUILD | `src/primitives/Textarea` | yes | NOT_STARTED | Squad B | pending | Hint, error, and character count. |
| progress-indicators | ProgressIndicator | REBUILD | `src/primitives/ProgressIndicator` | yes | NOT_STARTED | Squad B | pending | Determinate and indeterminate. |
| loading-indicators | LoadingIndicator | REBUILD | `src/primitives/LoadingIndicator` | yes | NOT_STARTED | Squad B | pending | Spinner and skeleton variants. |
| tags | Tag | REBUILD | `src/primitives/Tag` | yes | NOT_STARTED | Squad B | pending | Removable and disabled variants. |
| sliders | Slider | REBUILD | `src/primitives/Slider` | yes | NOT_STARTED | Squad B | pending | Range with min, max, and step. |
| featured-icons | FeaturedIcon | REBUILD | `src/primitives/FeaturedIcon` | yes | NOT_STARTED | Squad B | pending | Decorative only. |
| dividers | Divider | REBUILD | `src/primitives/Divider` | yes | NOT_STARTED | Squad B | pending | Low-risk separator primitive. |
| carousels | Carousel | REBUILD | `src/primitives/Carousel` | yes | NOT_STARTED | Squad B | pending | Defer until primitive rules settle. |
| color-pickers | ColorPicker | REBUILD | `src/primitives/ColorPicker` | yes | NOT_STARTED | Squad B | pending | Defer pending accessibility contract. |
| rating-badge-and-stars | Rating | REBUILD | `src/primitives/Rating` | yes | NOT_STARTED | Squad B | pending | Value supplied by props. |
| action-menus | ActionMenu | REFACTOR | `src/patterns/ActionMenu` | yes | BUILT | Squad C | main | Injected actions only. |
| metrics | MetricView | REFACTOR | `src/patterns/MetricView` | yes | BUILT | Squad C | main | Zero hidden unless opted in. |
| selects | SelectView | REFACTOR | `src/patterns/SelectView` | yes | BUILT | Squad C | main | Search above 10 items. |
| lists | ListView | REFACTOR | `src/patterns/ListView` | yes | BUILT | Squad C | main | Search above 20 items. |
| tables | TableView | REFACTOR | `src/patterns/TableView` | yes | BUILT | Squad C | main | Controls above 50 rows. |
| field-views | FieldView | REFACTOR | `src/patterns/FieldView` | yes | BUILT | Squad C | main | Shape-driven field rendering. |
| filter-bars | FilterBar | REFACTOR | `src/patterns/FilterBar` | yes | BUILT | Squad C | main | Filter metadata via props. |
| command-menus | CommandSurface | REFACTOR | `src/patterns/CommandSurface` | yes | BUILT | Squad C | main | Command actions injected. |
| collapsible-health | CollapsibleHealth | REFACTOR | `src/patterns/CollapsibleHealth` | yes | BUILT | Squad C | main | Health items supplied by props. |
| predicted-actions | PredictedActionBanner | REFACTOR | `src/patterns/PredictedActionBanner` | yes | BUILT | Squad C | main | Prediction display only. |
| split-viewports | SplitViewport | REFACTOR | `src/patterns/SplitViewport` | yes | BUILT | Squad C | main | High-probability content first. |
| tree-views | TreeView | REFACTOR | `src/patterns/TreeView` | yes | BUILT | Squad C | pending | Batch 1 nested data view. |
| empty-states | EmptyState | REFACTOR | `src/patterns/EmptyState` | yes | NOT_STARTED | Squad C | pending | Explicit opt-in only. |
| notifications | ToastNotification | REFACTOR | `src/patterns/ToastNotification` | yes | NOT_STARTED | Squad C | pending | App controls message data. |
| breadcrumbs | Breadcrumbs | REFACTOR | `src/patterns/Breadcrumbs` | yes | NOT_STARTED | Squad C | pending | Routes supplied by app. |
| file-uploaders | FileUploader | REFACTOR | `src/patterns/FileUploader` | yes | NOT_STARTED | Squad C | pending | Upload execution supplied by app. |
| progress-steps | ProgressSteps | REFACTOR | `src/patterns/ProgressSteps` | yes | NOT_STARTED | Squad C | pending | Step state supplied by props. |
| sidebar-navigations | SidebarNavigation | REFACTOR | `src/patterns/SidebarNavigation` | yes | NOT_STARTED | Squad C | pending | Navigation data supplied by app. |
| slideout-menus | SlideoutPanel | REFACTOR | `src/patterns/SlideoutPanel` | yes | NOT_STARTED | Squad C | pending | Build on Overlay. |
| activity-feeds | ActivityFeed | REFACTOR | `src/patterns/ActivityFeed` | yes | NOT_STARTED | Squad C | pending | No hardcoded actors. |
| multi-select | MultiSelectView | REFACTOR | `src/patterns/MultiSelectView` | yes | NOT_STARTED | Squad C | pending | Searchable option pattern. |
| date-pickers | DatePicker | REFACTOR | `src/patterns/DatePicker` | yes | NOT_STARTED | Squad C | pending | Overlay mode selected by props. |
| calendars | CalendarView | REFACTOR | `src/patterns/CalendarView` | yes | NOT_STARTED | Squad C | pending | Events supplied by props. |
| line-bar-charts | LineBarChartView | REFACTOR | `src/patterns/LineBarChartView` | yes | NOT_STARTED | Squad C | pending | Series supplied by props. |
| pie-charts | PieChartView | REFACTOR | `src/patterns/PieChartView` | yes | NOT_STARTED | Squad C | pending | Segments supplied by props. |
| radar-charts | RadarChartView | REFACTOR | `src/patterns/RadarChartView` | yes | NOT_STARTED | Squad C | pending | Axes supplied by props. |
| activity-gauges | GaugeView | REFACTOR | `src/patterns/GaugeView` | yes | NOT_STARTED | Squad C | pending | Metric data supplied by props. |
| messaging | MessageListView | REFACTOR | `src/patterns/MessageListView` | yes | NOT_STARTED | Squad C | pending | No hardcoded users. |
| verification-code-inputs | VerificationCodeInput | REBUILD | `src/patterns/VerificationCodeInput` | yes | NOT_STARTED | Squad C | pending | Input pattern supplied by props. |
| text-editors | TextEditor | REFACTOR | `src/patterns/TextEditor` | yes | NOT_STARTED | Squad C | pending | Toolbar supplied by props. |
| qr-codes | QRCodeReference | REFERENCE_ONLY | `docs/component-disposition.md` | no | REFERENCE_ONLY_DONE | Squad D | main | Reference until a real utility contract exists. |
| code-snippets | CodeSnippetReference | REFERENCE_ONLY | `docs/component-disposition.md` | no | REFERENCE_ONLY_DONE | Squad D | main | Docs/example surface unless promoted later. |
| file-lists | FileListView | MERGED | `src/patterns/ListView` | no | MERGED | Squad D | main | Covered by ListView item rendering. |
| data-grids | DataGrid | MERGED | `src/patterns/TableView` | no | MERGED | Squad D | main | Covered by TableView columns and rows. |
| dashboards | Dashboards | EXAMPLE_ONLY | `examples/dashboards/` | no | EXAMPLE_ONLY_DONE | Squad D | main | Full-screen examples only. |
| settings-pages | Settings pages | EXAMPLE_ONLY | `examples/settings/` | no | NOT_STARTED | Squad D | pending | Do not export page templates. |
| login-pages | Login pages | EXAMPLE_ONLY | `examples/auth/login/` | no | NOT_STARTED | Squad D | pending | Auth example only. |
| signup-pages | Signup pages | EXAMPLE_ONLY | `examples/auth/signup/` | no | NOT_STARTED | Squad D | pending | Auth example only. |
| verification-pages | Verification pages | EXAMPLE_ONLY | `examples/auth/verification/` | no | NOT_STARTED | Squad D | pending | Page example only. |
| forgot-password-pages | Forgot password pages | EXAMPLE_ONLY | `examples/auth/forgot-password/` | no | NOT_STARTED | Squad D | pending | Page example only. |
| informational-pages | Informational pages | EXAMPLE_ONLY | `examples/informational/` | no | NOT_STARTED | Squad D | pending | Page example only. |
| not-found-sections | Not found sections | EXAMPLE_ONLY | `examples/not-found/` | no | NOT_STARTED | Squad D | pending | Page section example only. |
| email-templates | Email templates | EXAMPLE_ONLY | `examples/email/` | no | NOT_STARTED | Squad D | pending | Docs/example surface only. |
| header-navigations | Header navigations | EXAMPLE_ONLY | `examples/navigation/headers/` | no | NOT_STARTED | Squad D | pending | App-owned layout example. |
| inline-ctas | Inline CTAs | EXAMPLE_ONLY | `examples/marketing/inline-ctas/` | no | NOT_STARTED | Squad D | pending | Marketing example only. |
| section-headers | Section headers | EXAMPLE_ONLY | `examples/sections/headers/` | no | NOT_STARTED | Squad D | pending | Reference/example only. |
| section-footers | Section footers | EXAMPLE_ONLY | `examples/sections/footers/` | no | NOT_STARTED | Squad D | pending | Reference/example only. |
| mobile-app-store-buttons | Mobile app store buttons | EXAMPLE_ONLY | `examples/marketing/app-store-buttons/` | no | NOT_STARTED | Squad D | pending | Marketing example only. |
| social-buttons | Social buttons | EXAMPLE_ONLY | `examples/auth/social-buttons/` | no | NOT_STARTED | Squad D | pending | Auth example only. |
| illustrations | Illustrations | EXAMPLE_ONLY | `examples/assets/illustrations/` | no | NOT_STARTED | Squad D | pending | Assets only, no package export. |
