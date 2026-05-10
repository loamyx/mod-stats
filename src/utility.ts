export function formatUsername(name: string): string {
  if (!name) return '—';
  return name.trim();
}
