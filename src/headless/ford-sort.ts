export type FordWeights = {
  frequency?: number;
  occurrence?: number;
  recency?: number;
  depth?: number;
};

export type FordScoredItem<T> = {
  item: T;
  frequency?: number;
  occurrence?: number;
  recency?: number;
  depth?: number;
};

const defaultWeights: Required<FordWeights> = {
  frequency: 1,
  occurrence: 1,
  recency: 1,
  depth: 1,
};

export function fordScore<T>(
  item: FordScoredItem<T>,
  weights: FordWeights = {},
): number {
  const w = { ...defaultWeights, ...weights };

  return (
    (item.frequency ?? 0) * w.frequency +
    (item.occurrence ?? 0) * w.occurrence +
    (item.recency ?? 0) * w.recency -
    (item.depth ?? 0) * w.depth
  );
}

export function fordSort<T>(
  items: FordScoredItem<T>[],
  weights: FordWeights = {},
): T[] {
  return [...items]
    .sort((a, b) => fordScore(b, weights) - fordScore(a, weights))
    .map((entry) => entry.item);
}
