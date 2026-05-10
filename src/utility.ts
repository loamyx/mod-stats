import { TriggerContext } from '@devvit/public-api';

export function formatUsername(name: string): string {
  if (!name) return '—';
  return `u/${name}`;
}

export function actionLabel(action: string): string {
  return action.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
}

export async function userIsMod(context: TriggerContext, username: string): Promise<boolean> {
  try {
    const subreddit = await context.reddit.getCurrentSubreddit();
    const mods = await subreddit.getModerators({ limit: 500 });
    return mods.some((m: any) => m.username?.toLowerCase() === username.toLowerCase());
  } catch {
    return false;
  }
}
