export function normalizeName(s: string) {
  return String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");
}
