# Migration Map

Every audited legacy item must be represented before it can be rebuilt, refactored, merged, or parked as reference/example material. Public exports remain limited to `src/primitives`, `src/patterns`, `src/types`, and `src/headless`.

Audit category counts:

- Base primitives: 28
- Application components: 34
- Page templates: 16

Allowed dispositions: `REBUILD`, `REFACTOR`, `REFERENCE_ONLY`, `EXAMPLE_ONLY`, `MERGED`.

Allowed statuses: `NOT_STARTED`, `IN_PROGRESS`, `BUILT`, `HARDENING_REQUIRED`, `EXAMPLE_ONLY_DONE`, `REFERENCE_ONLY_DONE`, `MERGED`, `BLOCKED`.

| legacy slug | legacy label | audit category | disposition | destination | public export | current implementation | status | owner | PR link | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| buttons | Buttons | base primitive | REBUILD | `src/primitives/Button` | yes | `Button` primitive | BUILT | Squad A | main | Canonical button primitive. |
| inputs | Inputs | base primitive | REBUILD | `src/primitives/Input` | yes | `Input` primitive | BUILT | Squad A | main | Canonical text input primitive. |
| badges | Badges | base primitive | REBUILD | `src/primitives/Badge` | yes | `Badge` primitive | BUILT | Squad A | main | Canonical badge primitive. |
| checkboxes | Checkbox | base primitive | REBUILD | `src/primitives/Checkbox` | yes | `Checkbox` primitive | BUILT | Squad A | main | Batch 1 primitive. |
| toggles | Toggle | base primitive | REBUILD | `src/primitives/Toggle` | yes | `Toggle` primitive | BUILT | Squad A | main | Batch 1 primitive. |
| dropdown-menus | DropdownMenu | base primitive | REBUILD | `src/primitives/DropdownMenu` | yes | `DropdownMenu` primitive | BUILT | Squad A | main | Primitive shell, not ActionMenu. |
| overlays | Overlay | base primitive | REBUILD | `src/primitives/Overlay` | yes | `Overlay` primitive | BUILT | Squad A | main | Modal, sheet, and drawer by props. |
| modals | Modal | base primitive | REBUILD | `src/primitives/Modal` | yes | `Modal` preset | BUILT | Squad A | main | Thin modal preset over Overlay. |
| tabs | Tabs | base primitive | REBUILD | `src/primitives/Tabs` | yes | `Tabs` primitive | BUILT | Squad A | main | Keyboard-capable tab primitive. |
| tooltips | Tooltip | base primitive | REBUILD | `src/primitives/Tooltip` | yes | `Tooltip` primitive | BUILT | Squad A | main | Low-level disclosure primitive. |
| pagination | Pagination | base primitive | REBUILD | `src/primitives/Pagination` | yes | `Pagination` primitive | BUILT | Squad A | main | Hides single-page state by default. |
| alerts | Alert | base primitive | REBUILD | `src/primitives/Alert` | yes | `Alert` primitive | BUILT | Squad C | main | Injected actions only. |
| avatars | Avatar | base primitive | REBUILD | `src/primitives/Avatar` | yes | not implemented | NOT_STARTED | Squad B | pending | No legacy asset URLs. |
| avatar-groups | AvatarGroup | base primitive | REBUILD | `src/primitives/AvatarGroup` | yes | not implemented | NOT_STARTED | Squad B | pending | Needs overflow behavior. |
| badge-groups | BadgeGroup | base primitive | REBUILD | `src/primitives/BadgeGroup` | yes | not implemented | NOT_STARTED | Squad B | pending | Needs collapse behavior. |
| button-groups | ButtonGroup | base primitive | REBUILD | `src/primitives/ButtonGroup` | yes | not implemented | NOT_STARTED | Squad B | pending | Segmented or attached buttons. |
| radios | Radio | base primitive | REBUILD | `src/primitives/Radio` | yes | not implemented | NOT_STARTED | Squad B | pending | Base radio primitive. |
| radio-groups | RadioGroup | base primitive | REBUILD | `src/primitives/RadioGroup` | yes | not implemented | NOT_STARTED | Squad B | pending | Option collection primitive. |
| textareas | Textarea | base primitive | REBUILD | `src/primitives/Textarea` | yes | not implemented | NOT_STARTED | Squad B | pending | Hint, error, and character count. |
| progress-indicators | ProgressIndicator | base primitive | REBUILD | `src/primitives/ProgressIndicator` | yes | not implemented | NOT_STARTED | Squad B | pending | Determinate and indeterminate. |
| loading-indicators | LoadingIndicator | base primitive | REBUILD | `src/primitives/LoadingIndicator` | yes | not implemented | NOT_STARTED | Squad B | pending | Spinner and skeleton variants. |
| tags | Tag | base primitive | REBUILD | `src/primitives/Tag` | yes | not implemented | NOT_STARTED | Squad B | pending | Removable and disabled variants. |
| sliders | Slider | base primitive | REBUILD | `src/primitives/Slider` | yes | not implemented | NOT_STARTED | Squad B | pending | Range with min, max, and step. |
| featured-icons | FeaturedIcon | base primitive | REBUILD | `src/primitives/FeaturedIcon` | yes | not implemented | NOT_STARTED | Squad B | pending | Decorative only. |
| dividers | Divider | base primitive | REBUILD | `src/primitives/Divider` | yes | not implemented | NOT_STARTED | Squad B | pending | Low-risk separator primitive. |
| carousels | Carousel | base primitive | REBUILD | `src/primitives/Carousel` | yes | `Carousel` primitive | BUILT | Squad B | main | Slides supplied by props. |
| color-pickers | ColorPicker | base primitive | REBUILD | `src/primitives/ColorPicker` | yes | `ColorPicker` primitive | BUILT | Squad B | main | Color value and optional swatches supplied by props. |
| rating-badge-and-stars | Rating | base primitive | REBUILD | `src/primitives/Rating` | yes | `Rating` primitive | BUILT | Squad B | main | Value supplied by props. |
| action-menus | ActionMenu | application component | REFACTOR | `src/patterns/ActionMenu` | yes | `ActionMenu` pattern | BUILT | Squad C | main | Injected actions only. |
| metrics | MetricView | application component | REFACTOR | `src/patterns/MetricView` | yes | `MetricView` pattern | BUILT | Squad C | main | Zero hidden unless opted in. |
| selects | SelectView | application component | REFACTOR | `src/patterns/SelectView` | yes | `SelectView` pattern | BUILT | Squad C | main | Search above 10 items. |
| lists | ListView | application component | REFACTOR | `src/patterns/ListView` | yes | `ListView` pattern | BUILT | Squad C | main | Search above 20 items. |
| tables | TableView | application component | REFACTOR | `src/patterns/TableView` | yes | `TableView` pattern | BUILT | Squad C | main | Controls above 50 rows. |
| field-views | FieldView | application component | REFACTOR | `src/patterns/FieldView` | yes | `FieldView` pattern | BUILT | Squad C | main | Shape-driven field rendering. |
| filter-bars | FilterBar | application component | REFACTOR | `src/patterns/FilterBar` | yes | `FilterBar` pattern | BUILT | Squad C | main | Filter metadata via props. |
| command-menus | CommandSurface | application component | REFACTOR | `src/patterns/CommandSurface` | yes | `CommandSurface` pattern | BUILT | Squad C | main | Command actions injected. |
| collapsible-health | CollapsibleHealth | application component | REFACTOR | `src/patterns/CollapsibleHealth` | yes | `CollapsibleHealth` pattern | BUILT | Squad C | main | Health items supplied by props. |
| predicted-actions | PredictedActionBanner | application component | REFACTOR | `src/patterns/PredictedActionBanner` | yes | `PredictedActionBanner` pattern | BUILT | Squad C | main | Prediction display only. |
| split-viewports | SplitViewport | application component | REFACTOR | `src/patterns/SplitViewport` | yes | `SplitViewport` pattern | BUILT | Squad C | main | High-probability content first. |
| tree-views | TreeView | application component | REFACTOR | `src/patterns/TreeView` | yes | `TreeView` pattern | BUILT | Squad C | main | Batch 1 nested data view. |
| empty-states | EmptyState | application component | REFACTOR | `src/patterns/EmptyState` | yes | `EmptyState` pattern | BUILT | Squad C | main | Explicit opt-in only. |
| notifications | ToastNotification | application component | REFACTOR | `src/patterns/ToastNotification` | yes | `ToastNotification` pattern | BUILT | Squad C | main | App controls message data. |
| breadcrumbs | Breadcrumbs | application component | REFACTOR | `src/patterns/Breadcrumbs` | yes | `Breadcrumbs` pattern | BUILT | Squad C | main | Routes supplied by app. |
| file-uploaders | FileUploader | application component | REFACTOR | `src/patterns/FileUploader` | yes | `FileUploader` pattern | BUILT | Squad C | main | Upload execution supplied by app. |
| progress-steps | ProgressSteps | application component | REFACTOR | `src/patterns/ProgressSteps` | yes | `ProgressSteps` pattern | BUILT | Squad C | main | Step state supplied by props. |
| sidebar-navigations | SidebarNavigation | application component | REFACTOR | `src/patterns/SidebarNavigation` | yes | `SidebarNavigation` pattern | BUILT | Squad C | main | Navigation data supplied by app. |
| slideout-menus | SlideoutPanel | application component | REFACTOR | `src/patterns/SlideoutPanel` | yes | `SlideoutPanel` pattern | BUILT | Squad C | main | Overlay-mode panel with injected actions and sections. |
| activity-feeds | ActivityFeed | application component | REFACTOR | `src/patterns/ActivityFeed` | yes | `ActivityFeed` pattern | BUILT | Squad C | main | Prop-driven feed; no hardcoded actors. |
| multi-select | MultiSelectView | application component | REFACTOR | `src/patterns/MultiSelectView` | yes | `MultiSelectView` pattern | BUILT | Squad C | main | Searchable option pattern. |
| date-pickers | DatePicker | application component | REFACTOR | `src/patterns/DatePicker` | yes | `DatePicker` pattern | BUILT | Squad C | main | Overlay mode selected by props. |
| calendars | CalendarView | application component | REFACTOR | `src/patterns/CalendarView` | yes | `CalendarView` pattern | BUILT | Squad C | main | Events supplied by props. |
| line-bar-charts | LineBarChartView | application component | REFACTOR | `src/patterns/LineBarChartView` | yes | `LineBarChartView` pattern | BUILT | Squad C | main | Series supplied by props. |
| pie-charts | PieChartView | application component | REFACTOR | `src/patterns/PieChartView` | yes | `PieChartView` pattern | BUILT | Squad C | main | Segments supplied by props. |
| radar-charts | RadarChartView | application component | REFACTOR | `src/patterns/RadarChartView` | yes | `RadarChartView` pattern | BUILT | Squad C | main | Axes supplied by props. |
| activity-gauges | GaugeView | application component | REFACTOR | `src/patterns/GaugeView` | yes | `GaugeView` pattern | BUILT | Squad C | main | Metric data supplied by props. |
| messaging | MessageListView | application component | REFACTOR | `src/patterns/MessageListView` | yes | `MessageListView` pattern | BUILT | Squad C | main | No hardcoded users. |
| verification-code-inputs | VerificationCodeInput | application component | REFACTOR | `src/patterns/VerificationCodeInput` | yes | `VerificationCodeInput` pattern | BUILT | Squad C | main | Input pattern supplied by props. |
| text-editors | TextEditor | application component | REFACTOR | `src/patterns/TextEditor` | yes | `TextEditor` pattern | BUILT | Squad C | main | Toolbar supplied by props. |
| qr-codes | QRCodeReference | application component | REFERENCE_ONLY | `docs/component-disposition.md` | no | reference notes only | REFERENCE_ONLY_DONE | Squad D | main | Reference until a real utility contract exists. |
| code-snippets | CodeSnippetReference | application component | REFERENCE_ONLY | `docs/component-disposition.md` | no | reference notes only | REFERENCE_ONLY_DONE | Squad D | main | Docs/example surface unless promoted later. |
| file-lists | FileListView | application component | MERGED | `src/patterns/ListView` | no | covered by `ListView` | MERGED | Squad D | main | Covered by ListView item rendering. |
| data-grids | DataGrid | application component | MERGED | `src/patterns/TableView` | no | covered by `TableView` | MERGED | Squad D | main | Covered by TableView columns and rows. |
| dashboards | Dashboards | page template | EXAMPLE_ONLY | `examples/dashboards/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Full-screen examples only. |
| settings-pages | Settings pages | page template | EXAMPLE_ONLY | `examples/settings/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Storybook-only settings reference; no public export. |
| login-pages | Login pages | page template | EXAMPLE_ONLY | `examples/auth/login/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Documentation-only Storybook examples; no public export. |
| signup-pages | Signup pages | page template | EXAMPLE_ONLY | `examples/auth/signup/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Storybook-only neutral reference; not exported. |
| verification-pages | Verification pages | page template | EXAMPLE_ONLY | `examples/auth/verification/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Page example only; no public export. |
| forgot-password-pages | Forgot password pages | page template | EXAMPLE_ONLY | `examples/auth/forgot-password/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Storybook-only auth states; no reset URLs, account data, or auth logic. |
| informational-pages | Informational pages | page template | EXAMPLE_ONLY | `examples/informational/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Page example only; not exported from public package entries. |
| not-found-sections | Not found sections | page template | EXAMPLE_ONLY | `examples/not-found/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Storybook-only neutral not-found section references; not exported. |
| email-templates | Email templates | page template | EXAMPLE_ONLY | `examples/email/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Neutral Storybook reference only; no public exports. |
| header-navigations | Header navigations | page template | EXAMPLE_ONLY | `examples/navigation/headers/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | App-owned layout reference only; no public export. |
| inline-ctas | Inline CTAs | page template | EXAMPLE_ONLY | `examples/marketing/inline-ctas/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Marketing example only; no public export. |
| section-headers | Section headers | page template | EXAMPLE_ONLY | `examples/sections/headers/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Storybook-only neutral reference; no public export. |
| section-footers | Section footers | page template | EXAMPLE_ONLY | `examples/sections/footers/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Reference/example only; not exported. |
| mobile-app-store-buttons | Mobile app store buttons | page template | EXAMPLE_ONLY | `examples/marketing/app-store-buttons/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Marketing example only; no public export. |
| social-buttons | Social buttons | page template | EXAMPLE_ONLY | `examples/auth/social-buttons/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Dedicated neutral provider button reference; apps own provider identity, routing, and analytics. |
| illustrations | Illustrations | page template | EXAMPLE_ONLY | `examples/assets/illustrations/` | no | Storybook example | EXAMPLE_ONLY_DONE | Squad D | main | Clean-room neutral assets only; no public export. |
