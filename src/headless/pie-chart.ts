import type { PieChartSegment } from "../types";

export type PieChartSlice = PieChartSegment & {
  value: number;
  percent: number;
  startAngle: number;
  endAngle: number;
};

function getSegmentValue(value: PieChartSegment["value"]): number | null {
  if (typeof value === "string" && value.trim().length === 0) return null;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

export function getVisiblePieChartSegments(segments: PieChartSegment[] = []): PieChartSegment[] {
  return segments.filter((segment) => {
    if (segment.hidden) return false;
    if (segment.label.trim().length === 0) return false;
    return getSegmentValue(segment.value) !== null;
  });
}

export function getPieChartSlices(segments: PieChartSegment[] = []): PieChartSlice[] {
  const visibleSegments = getVisiblePieChartSegments(segments).map((segment) => ({
    ...segment,
    value: getSegmentValue(segment.value) ?? 0,
  }));
  const total = visibleSegments.reduce((sum, segment) => sum + segment.value, 0);

  if (total <= 0) return [];

  let cursor = 0;

  return visibleSegments.map((segment) => {
    const value = Number(segment.value);
    const percent = value / total;
    const startAngle = cursor;
    const endAngle = cursor + percent * 360;

    cursor = endAngle;

    return {
      ...segment,
      endAngle,
      percent,
      startAngle,
      value,
    };
  });
}
