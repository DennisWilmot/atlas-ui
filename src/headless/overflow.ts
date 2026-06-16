export const SELECT_SEARCH_THRESHOLD = 10;
export const LIST_SEARCH_THRESHOLD = 20;
export const TABLE_SEARCH_THRESHOLD = 50;

export function shouldUseSearchableSelect(count: number): boolean {
  return count > SELECT_SEARCH_THRESHOLD;
}

export function shouldUseSearchableList(count: number): boolean {
  return count > LIST_SEARCH_THRESHOLD;
}

export function shouldUseTableControls(count: number): boolean {
  return count > TABLE_SEARCH_THRESHOLD;
}
