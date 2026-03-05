// ─── Filter helpers ─────────────────────────────────────────────────────────────

export interface FilterCondition {
  field: string;
  value: string;
}

/** Parses filter[status]=active from query object */
export function parseFilterParams(
  query: Record<string, unknown>
): FilterCondition[] {
  const filters: FilterCondition[] = [];
  for (const [key, value] of Object.entries(query)) {
    const match = key.match(/^filter\[(\w+)\]$/);
    if (match && typeof value === "string") {
      filters.push({ field: match[1], value });
    }
  }
  return filters;
}

export function applyFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: FilterCondition[]
): T[] {
  return data.filter((row) =>
    filters.every(({ field, value }) => {
      const rowVal = row[field];
      if (rowVal == null) return false;
      return String(rowVal).toLowerCase() === value.toLowerCase();
    })
  );
}
