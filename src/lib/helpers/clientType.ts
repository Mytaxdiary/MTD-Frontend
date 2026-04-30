export function matchesTypeFilter(types: string[], filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "both") return types.length >= 2;
  return types.includes(filter);
}
