import type { Action, Metric } from "../types";

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
