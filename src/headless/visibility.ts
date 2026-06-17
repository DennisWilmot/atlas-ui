import type { Action, HealthItem, Metric, ProgressStep, ProgressStepState } from "../types";

const PROGRESS_STEP_STATES: ReadonlySet<ProgressStepState> = new Set([
  "blocked",
  "complete",
  "current",
  "upcoming",
]);

export function isMeaningfulMetric(
  metric: Metric,
  options: { showZero?: boolean } = {},
): boolean {
  if (metric.hidden) return false;
  if (metric.value === null || metric.value === undefined || metric.value === "") return false;
  if (!options.showZero && Number(metric.value) === 0) return false;
  return true;
}

export function getVisibleActions(actions: Action[] = []): Action[] {
  return actions.filter((action) => !action.hidden);
}

export function hasVisibleActions(actions: Action[] = []): boolean {
  return getVisibleActions(actions).length > 0;
}

export function hasRows<T>(rows: T[] | null | undefined): rows is T[] {
  return Array.isArray(rows) && rows.length > 0;
}

export function getVisibleHealthItems(items: HealthItem[] = []): HealthItem[] {
  return items.filter((item) => !item.hidden && item.label.trim().length > 0);
}

export function getAttentionHealthItems(items: HealthItem[] = []): HealthItem[] {
  return getVisibleHealthItems(items).filter((item) => item.status === "degraded" || item.status === "pending");
}

function isProgressStepState(state: string): state is ProgressStepState {
  return PROGRESS_STEP_STATES.has(state as ProgressStepState);
}

export function getVisibleProgressSteps(steps: ProgressStep[] = []): ProgressStep[] {
  return steps.filter((step) => (
    !step.hidden &&
    step.label.trim().length > 0 &&
    typeof step.state === "string" &&
    isProgressStepState(step.state)
  ));
}
