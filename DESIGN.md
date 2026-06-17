# DESIGN.md — Atlas UI URA Design Contract

Atlas UI is a URA-compliant component library.

URA optimizes for time saved, not engagement.

Interfaces are:
- context-first
- data-driven
- prop-driven
- quiet by default
- hidden when meaningless
- reusable across products

## First principles

### 1. Everything is a canvas

Every component starts as a blank canvas.

Meaning appears only after data and context are supplied.

Components must accept props.
Components must not fetch data internally.
Components must not assume a fixed screen.

### 2. Context is app-owned

The app owns:
- role
- permissions
- scope
- task
- data freshness
- device context

The library owns:
- component contracts
- visual structure
- interaction surfaces
- canonical types
- overflow behavior
- hide behavior

### 3. Time is the core metric

Prefer:
- fewer clicks
- inline actions
- good defaults
- hidden noise
- cached data supplied by the app

Reject:
- engagement-first UI
- unnecessary confirmations
- decorative empty states
- forced configuration

### 4. Zero interface is a render rule

If nothing meaningful exists, render nothing.

Bad:

```tsx
return <EmptyState title="No data" />;
```

Good:

```tsx
if (!items.length) return null;
```

`EmptyState` is allowed only by explicit app opt-in.

### 5. One input should support many outcomes

The library may provide:

* SearchField
* CommandSurface
* SelectView
* FilterBar

The app wires:

* filtering
* sorting
* highlighting
* navigation
* mutations
* notifications

## Canonical data shapes

```ts
export type Action = {
  id: string;
  label: string;
  intent?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  hidden?: boolean;
  icon?: React.ReactNode;
};

export type Metric = {
  id?: string;
  label: string;
  value: number | string | null | undefined;
  trend?: number;
  unit?: string;
  hidden?: boolean;
};

export type Field = {
  key: string;
  label: string;
  value: unknown;
  shape?: "text" | "number" | "date" | "badge" | "status" | "avatar" | "currency";
};

export type Row = Record<string, unknown>;

export type BreadcrumbItem = {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  icon?: React.ReactNode;
};
```

## Shape to view mapping

| Shape          | Component                 |
| -------------- | ------------------------- |
| key-value      | FieldView                 |
| list           | ListView                  |
| table          | TableView                 |
| count          | MetricView                |
| status         | Badge / CollapsibleHealth |
| action list    | ActionMenu                |
| select options | SelectView                |
| breadcrumb     | Breadcrumbs               |

## Overflow thresholds

| Data           | Threshold | Required behavior                     |
| -------------- | --------: | ------------------------------------- |
| Select options |      > 10 | Searchable combobox                   |
| List items     |      > 20 | Search + virtual scroll or pagination |
| Table rows     |      > 50 | Search + filters + pagination         |

## Package boundaries

Public exports:

* `src/primitives/`
* `src/patterns/`
* `src/types/`
* `src/headless/`

Never public:

* `examples/`
* page templates
* dashboards
* auth pages
* marketing layouts
* hardcoded demos

## Component naming

Use generic names:

Good:

* `MetricView`
* `TableView`
* `ActionMenu`
* `SelectView`
* `ListView`
* `FieldView`

Bad:

* `DashboardMetrics`
* `DealerTable`
* `UserActionsMenu`
* `InvoiceEmptyState`

## Design review checklist

Before implementing:

* What data shape drives this?
* Is this a primitive, pattern, or example?
* Can it hide when empty?
* Does it need actions?
* Are actions injected?
* Does it need overflow behavior?
* What should happen at 0 items?
* What should happen at 11 select options?
* What should happen at 21 list items?
* What should happen at 51 table rows?

During review:

* Does this reduce time-to-task?
* Does it avoid empty chrome?
* Does it avoid fake business data?
* Is it reusable across products?
* Is it documented in Storybook?
