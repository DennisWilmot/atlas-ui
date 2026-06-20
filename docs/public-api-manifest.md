# Public API Manifest

This manifest enumerates the shipped Atlas UI component surface exported from `atlas-ui/primitives` and `atlas-ui/patterns`. It excludes `atlas-ui/types`, `atlas-ui/headless`, `examples/`, and all `MERGED`, `REFERENCE_ONLY`, and `EXAMPLE_ONLY` migration rows.

- Source of truth: `package.json`, `src/index.ts`, `src/primitives/index.ts`, `src/patterns/index.ts`, and `docs/migration-map.md`
- Public component count: 59
- Tier breakdown: 29 primitives, 30 patterns
- `Select` is a live public primitive with Storybook/test coverage, but it does not currently have its own row in `docs/migration-map.md`; its manifest metadata is derived from the `Select shell` baseline in `docs/component-disposition.md` and the shipped implementation.

| Component | Tier | Export path | Props type | Storybook path | Test file | Migration source | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | primitive | `atlas-ui/primitives` | `ButtonProps` | `Primitives/Button` | `src/primitives/Button/Button.test.tsx` | `buttons (REBUILD)` | `BUILT` |
| ButtonGroup | primitive | `atlas-ui/primitives` | `ButtonGroupProps` | `Primitives/ButtonGroup` | `src/primitives/ButtonGroup/ButtonGroup.test.tsx` | `button-groups (REBUILD)` | `BUILT` |
| Input | primitive | `atlas-ui/primitives` | `InputProps` | `Primitives/Input` | `src/primitives/Input/Input.test.tsx` | `inputs (REBUILD)` | `BUILT` |
| Textarea | primitive | `atlas-ui/primitives` | `TextareaProps` | `Primitives/Textarea` | `src/primitives/Textarea/Textarea.test.tsx` | `textareas (REBUILD)` | `BUILT` |
| Select | primitive | `atlas-ui/primitives` | `SelectProps` | `Primitives/Select` | `src/primitives/Select/Select.test.tsx` | `select-shell baseline (REBUILD)` | `BUILT` |
| Badge | primitive | `atlas-ui/primitives` | `BadgeProps` | `Primitives/Badge` | `src/primitives/Badge/Badge.test.tsx` | `badges (REBUILD)` | `BUILT` |
| BadgeGroup | primitive | `atlas-ui/primitives` | `BadgeGroupProps` | `Primitives/BadgeGroup` | `src/primitives/BadgeGroup/BadgeGroup.test.tsx` | `badge-groups (REBUILD)` | `BUILT` |
| Checkbox | primitive | `atlas-ui/primitives` | `CheckboxProps` | `Primitives/Checkbox` | `src/primitives/Checkbox/Checkbox.test.tsx` | `checkboxes (REBUILD)` | `BUILT` |
| Radio | primitive | `atlas-ui/primitives` | `RadioProps` | `Primitives/Radio` | `src/primitives/Radio/Radio.test.tsx` | `radios (REBUILD)` | `BUILT` |
| RadioGroup | primitive | `atlas-ui/primitives` | `RadioGroupProps` | `Primitives/RadioGroup` | `src/primitives/RadioGroup/RadioGroup.test.tsx` | `radio-groups (REBUILD)` | `BUILT` |
| Divider | primitive | `atlas-ui/primitives` | `DividerProps` | `Primitives/Divider` | `src/primitives/Divider/Divider.test.tsx` | `dividers (REBUILD)` | `BUILT` |
| Tag | primitive | `atlas-ui/primitives` | `TagProps` | `Primitives/Tag` | `src/primitives/Tag/Tag.test.tsx` | `tags (REBUILD)` | `BUILT` |
| Toggle | primitive | `atlas-ui/primitives` | `ToggleProps` | `Primitives/Toggle` | `src/primitives/Toggle/Toggle.test.tsx` | `toggles (REBUILD)` | `BUILT` |
| DropdownMenu | primitive | `atlas-ui/primitives` | `DropdownMenuProps` | `Primitives/DropdownMenu` | `src/primitives/DropdownMenu/DropdownMenu.test.tsx` | `dropdown-menus (REBUILD)` | `BUILT` |
| FeaturedIcon | primitive | `atlas-ui/primitives` | `FeaturedIconProps` | `Primitives/FeaturedIcon` | `src/primitives/FeaturedIcon/FeaturedIcon.test.tsx` | `featured-icons (REBUILD)` | `BUILT` |
| Overlay | primitive | `atlas-ui/primitives` | `OverlayProps` | `Primitives/Overlay` | `src/primitives/Overlay/Overlay.test.tsx` | `overlays (REBUILD)` | `BUILT` |
| Modal | primitive | `atlas-ui/primitives` | `ModalProps` | `Primitives/Modal` | `src/primitives/Modal/Modal.test.tsx` | `modals (REBUILD)` | `BUILT` |
| Tabs | primitive | `atlas-ui/primitives` | `TabsProps` | `Primitives/Tabs` | `src/primitives/Tabs/Tabs.test.tsx` | `tabs (REBUILD)` | `BUILT` |
| Tooltip | primitive | `atlas-ui/primitives` | `TooltipProps` | `Primitives/Tooltip` | `src/primitives/Tooltip/Tooltip.test.tsx` | `tooltips (REBUILD)` | `BUILT` |
| Pagination | primitive | `atlas-ui/primitives` | `PaginationProps` | `Primitives/Pagination` | `src/primitives/Pagination/Pagination.test.tsx` | `pagination (REBUILD)` | `BUILT` |
| Slider | primitive | `atlas-ui/primitives` | `SliderProps` | `Primitives/Slider` | `src/primitives/Slider/Slider.test.tsx` | `sliders (REBUILD)` | `BUILT` |
| ProgressIndicator | primitive | `atlas-ui/primitives` | `ProgressIndicatorProps` | `Primitives/ProgressIndicator` | `src/primitives/ProgressIndicator/ProgressIndicator.test.tsx` | `progress-indicators (REBUILD)` | `BUILT` |
| LoadingIndicator | primitive | `atlas-ui/primitives` | `LoadingIndicatorProps` | `Primitives/LoadingIndicator` | `src/primitives/LoadingIndicator/LoadingIndicator.test.tsx` | `loading-indicators (REBUILD)` | `BUILT` |
| Alert | primitive | `atlas-ui/primitives` | `AlertProps` | `Primitives/Alert` | `src/primitives/Alert/Alert.test.tsx` | `alerts (REBUILD)` | `BUILT` |
| Avatar | primitive | `atlas-ui/primitives` | `AvatarProps` | `Primitives/Avatar` | `src/primitives/Avatar/Avatar.test.tsx` | `avatars (REBUILD)` | `BUILT` |
| AvatarGroup | primitive | `atlas-ui/primitives` | `AvatarGroupProps` | `Primitives/AvatarGroup` | `src/primitives/AvatarGroup/AvatarGroup.test.tsx` | `avatar-groups (REBUILD)` | `BUILT` |
| Carousel | primitive | `atlas-ui/primitives` | `CarouselProps` | `Primitives/Carousel` | `src/primitives/Carousel/Component.test.tsx` | `carousels (REBUILD)` | `BUILT` |
| ColorPicker | primitive | `atlas-ui/primitives` | `ColorPickerProps` | `Primitives/ColorPicker` | `src/primitives/ColorPicker/Component.test.tsx` | `color-pickers (REBUILD)` | `BUILT` |
| Rating | primitive | `atlas-ui/primitives` | `RatingProps` | `Primitives/Rating` | `src/primitives/Rating/Component.test.tsx` | `rating-badge-and-stars (REBUILD)` | `BUILT` |
| ActionMenu | pattern | `atlas-ui/patterns` | `ActionMenuProps` | `Patterns/ActionMenu` | `src/patterns/ActionMenu/ActionMenu.test.tsx` | `action-menus (REFACTOR)` | `BUILT` |
| ActivityFeed | pattern | `atlas-ui/patterns` | `ActivityFeedProps` | `Patterns/ActivityFeed` | `src/patterns/ActivityFeed/Component.test.tsx` | `activity-feeds (REFACTOR)` | `BUILT` |
| Breadcrumbs | pattern | `atlas-ui/patterns` | `BreadcrumbsProps` | `Patterns/Breadcrumbs` | `src/patterns/Breadcrumbs/Component.test.tsx` | `breadcrumbs (REFACTOR)` | `BUILT` |
| CalendarView | pattern | `atlas-ui/patterns` | `CalendarViewProps` | `Patterns/CalendarView` | `src/patterns/CalendarView/Component.test.tsx` | `calendars (REFACTOR)` | `BUILT` |
| CommandSurface | pattern | `atlas-ui/patterns` | `CommandSurfaceProps` | `Patterns/CommandSurface` | `src/patterns/CommandSurface/CommandSurface.test.tsx` | `command-menus (REFACTOR)` | `BUILT` |
| CollapsibleHealth | pattern | `atlas-ui/patterns` | `CollapsibleHealthProps` | `Patterns/CollapsibleHealth` | `src/patterns/CollapsibleHealth/CollapsibleHealth.test.tsx` | `collapsible-health (REFACTOR)` | `BUILT` |
| DatePicker | pattern | `atlas-ui/patterns` | `DatePickerProps` | `Patterns/DatePicker` | `src/patterns/DatePicker/Component.test.tsx` | `date-pickers (REFACTOR)` | `BUILT` |
| EmptyState | pattern | `atlas-ui/patterns` | `EmptyStateProps` | `Patterns/EmptyState` | `src/patterns/EmptyState/EmptyState.test.tsx` | `empty-states (REFACTOR)` | `BUILT` |
| FieldView | pattern | `atlas-ui/patterns` | `FieldViewProps` | `Patterns/FieldView` | `src/patterns/FieldView/FieldView.test.tsx` | `field-views (REFACTOR)` | `BUILT` |
| FileUploader | pattern | `atlas-ui/patterns` | `FileUploaderProps` | `Patterns/FileUploader` | `src/patterns/FileUploader/Component.test.tsx` | `file-uploaders (REFACTOR)` | `BUILT` |
| FilterBar | pattern | `atlas-ui/patterns` | `FilterBarProps` | `Patterns/FilterBar` | `src/patterns/FilterBar/FilterBar.test.tsx` | `filter-bars (REFACTOR)` | `BUILT` |
| GaugeView | pattern | `atlas-ui/patterns` | `GaugeViewProps` | `Patterns/GaugeView` | `src/patterns/GaugeView/Component.test.tsx` | `activity-gauges (REFACTOR)` | `BUILT` |
| LineBarChartView | pattern | `atlas-ui/patterns` | `LineBarChartViewProps` | `Patterns/LineBarChartView` | `src/patterns/LineBarChartView/Component.test.tsx` | `line-bar-charts (REFACTOR)` | `BUILT` |
| MessageListView | pattern | `atlas-ui/patterns` | `MessageListViewProps` | `Patterns/MessageListView` | `src/patterns/MessageListView/Component.test.tsx` | `messaging (REFACTOR)` | `BUILT` |
| MetricView | pattern | `atlas-ui/patterns` | `MetricViewProps` | `Patterns/MetricView` | `src/patterns/MetricView/MetricView.test.tsx` | `metrics (REFACTOR)` | `BUILT` |
| MultiSelectView | pattern | `atlas-ui/patterns` | `MultiSelectViewProps` | `Patterns/MultiSelectView` | `src/patterns/MultiSelectView/Component.test.tsx` | `multi-select (REFACTOR)` | `BUILT` |
| PieChartView | pattern | `atlas-ui/patterns` | `PieChartViewProps` | `Patterns/PieChartView` | `src/patterns/PieChartView/Component.test.tsx` | `pie-charts (REFACTOR)` | `BUILT` |
| PredictedActionBanner | pattern | `atlas-ui/patterns` | `PredictedActionBannerProps` | `Patterns/PredictedActionBanner` | `src/patterns/PredictedActionBanner/PredictedActionBanner.test.tsx` | `predicted-actions (REFACTOR)` | `BUILT` |
| ProgressSteps | pattern | `atlas-ui/patterns` | `ProgressStepsProps` | `Patterns/ProgressSteps` | `src/patterns/ProgressSteps/Component.test.tsx` | `progress-steps (REFACTOR)` | `BUILT` |
| RadarChartView | pattern | `atlas-ui/patterns` | `RadarChartViewProps<T extends Row = Row>` | `Patterns/RadarChartView` | `src/patterns/RadarChartView/Component.test.tsx` | `radar-charts (REFACTOR)` | `BUILT` |
| SelectView | pattern | `atlas-ui/patterns` | `SelectViewProps` | `Patterns/SelectView` | `src/patterns/SelectView/SelectView.test.tsx` | `selects (REFACTOR)` | `BUILT` |
| ListView | pattern | `atlas-ui/patterns` | `ListViewProps<T>` | `Patterns/ListView` | `src/patterns/ListView/ListView.test.tsx` | `lists (REFACTOR)` | `BUILT` |
| SidebarNavigation | pattern | `atlas-ui/patterns` | `SidebarNavigationProps` | `Patterns/SidebarNavigation` | `src/patterns/SidebarNavigation/Component.test.tsx` | `sidebar-navigations (REFACTOR)` | `BUILT` |
| SlideoutPanel | pattern | `atlas-ui/patterns` | `SlideoutPanelProps` | `Patterns/SlideoutPanel` | `src/patterns/SlideoutPanel/Component.test.tsx` | `slideout-menus (REFACTOR)` | `BUILT` |
| SplitViewport | pattern | `atlas-ui/patterns` | `SplitViewportProps` | `Patterns/SplitViewport` | `src/patterns/SplitViewport/SplitViewport.test.tsx` | `split-viewports (REFACTOR)` | `BUILT` |
| TableView | pattern | `atlas-ui/patterns` | `TableViewProps<T extends Row = Row>` | `Patterns/TableView` | `src/patterns/TableView/TableView.test.tsx` | `tables (REFACTOR)` | `BUILT` |
| TreeView | pattern | `atlas-ui/patterns` | `TreeViewProps` | `Patterns/TreeView` | `src/patterns/TreeView/TreeView.test.tsx` | `tree-views (REFACTOR)` | `BUILT` |
| TextEditor | pattern | `atlas-ui/patterns` | `TextEditorProps` | `Patterns/TextEditor` | `src/patterns/TextEditor/Component.test.tsx` | `text-editors (REFACTOR)` | `BUILT` |
| ToastNotification | pattern | `atlas-ui/patterns` | `ToastNotificationProps` | `Patterns/ToastNotification` | `src/patterns/ToastNotification/Component.test.tsx` | `notifications (REFACTOR)` | `BUILT` |
| VerificationCodeInput | pattern | `atlas-ui/patterns` | `VerificationCodeInputProps` | `Patterns/VerificationCodeInput` | `src/patterns/VerificationCodeInput/Component.test.tsx` | `verification-code-inputs (REBUILD)` | `BUILT` |
