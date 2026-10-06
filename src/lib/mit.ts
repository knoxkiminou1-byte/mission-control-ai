export function searchRecords<T extends { name: string; notes: string }>(rows: T[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => `${row.name} ${row.notes}`.toLowerCase().includes(q));
}
