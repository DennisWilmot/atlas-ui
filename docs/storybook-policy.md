# Storybook Policy

Storybook is the public development surface for Atlas UI.

Every public component must have stories.

## Story hierarchy

Use these titles:

```txt
Primitives/Button
Primitives/Input
Primitives/Badge
Patterns/ActionMenu
Patterns/Breadcrumbs
Patterns/MetricView
Patterns/SelectView
Patterns/ListView
Patterns/SidebarNavigation
Patterns/TableView
Examples/Dashboards
```

## Required stories per primitive

* Default
* Variants
* Sizes if applicable
* Disabled
* With icon/slot if applicable
* Error state if applicable

## Required stories per pattern

* Default
* Empty data behavior
* Hidden/null behavior
* Overflow threshold behavior
* Disabled/read-only behavior if applicable
* With actions if applicable
* No actions if applicable

## Story data policy

Stories may use mock data, but it must be neutral and generic.

Allowed:

* Item A
* Item B
* Alpha
* Beta
* Record 1
* Metric A

Forbidden:

* fake emails
* fake names
* fake URLs
* fake companies
* Untitled UI asset URLs
* dealer/customer/invoice-specific examples in public component stories

Domain-specific examples belong in `examples/`.
