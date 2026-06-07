export function readGridColumnCount(grid: HTMLElement): number {
  const template = getComputedStyle(grid).gridTemplateColumns;
  const columns = template.split(" ").filter((part) => part.trim().length > 0).length;
  return Math.max(1, columns);
}

export function getRowEndIndex(
  itemIndex: number,
  columns: number,
  totalItems: number,
): number {
  const rowStart = Math.floor(itemIndex / columns) * columns;
  return Math.min(rowStart + columns - 1, totalItems - 1);
}
