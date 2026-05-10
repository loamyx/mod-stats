export function formatUsername(name: string): string {
  if (!name) return '\u2014';
  return name.trim();
}

export function actionLabel(action: string): string {
  if (!action) return '';
  return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
}

export async function userIsMod(context: any, username: string): Promise<boolean> {
  try {
    const subreddit = await context.reddit.getCurrentSubreddit();
    const mods = await subreddit.getModerators({ limit: 500 });
    return mods.some((m: any) => m.username?.toLowerCase() === username.toLowerCase());
  } catch {
    return false;
  }
}
