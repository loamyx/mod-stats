export function formatUsername(name: string): string {
  if (!name) return "\u2014";
  return `u/${name}`;
}

export function actionLabel(action: string): string {
  return action
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}
