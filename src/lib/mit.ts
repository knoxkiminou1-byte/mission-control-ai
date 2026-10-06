export function searchRecords<T>(rows: T[], query: string, text: (row: T) => string) {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => text(row).toLowerCase().includes(q));
}
