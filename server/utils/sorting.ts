// ─── Sort helpers ───────────────────────────────────────────────────────────────

export interface SortField {
  field: string;
  direction: "asc" | "desc";
}

/** Parses "salary:desc,department:asc" or "-salary,department" */
export function parseSortParam(sortParam: string): SortField[] {
  return sortParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s.startsWith("-")) {
        return { field: s.slice(1), direction: "desc" as const };
      }
      const [field, dir] = s.split(":");
      return { field, direction: dir === "desc" ? ("desc" as const) : ("asc" as const) };
    });
}

export function applySort<T extends Record<string, unknown>>(
  data: T[],
  sortFields: SortField[]
): T[] {
  return [...data].sort((a, b) => {
    for (const { field, direction } of sortFields) {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === bVal) continue;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp: number;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }

      return direction === "asc" ? cmp : -cmp;
    }
    return 0;
  });
}
