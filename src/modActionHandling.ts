import { TriggerContext, ModAction } from '@devvit/public-api';
import { TRACKED_ACTIONS } from './constants.js';
import {
  keyActionCount,
  keyModCount,
  keyTargetCount,
  keyDailyCount,
  keyRecentActions,
  keyDedup,
  incrementKey,
} from './redisHelper.js';

export async function handleModAction(
  event: { action: ModAction },
  context: TriggerContext
): Promise<void> {
  const action = event.action;
  if (!action || !action.actionType) return;

  const actionType = action.actionType.toLowerCase();
  if (!TRACKED_ACTIONS.includes(actionType as any)) return;

  const actionId = action.id;
  if (!actionId) return;

  const { redis } = context;

  const seen = await redis.get(keyDedup(actionId));
  if (seen) return;
  await redis.set(keyDedup(actionId), '1', { expiration: new Date(Date.now() + 86400000 * 7) });

  const now = action.createdAt ? new Date(action.createdAt) : new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();

  const moderator = action.moderator?.name || 'unknown';
  const target = action.targetUser?.name || '';

  await Promise.all([
    incrementKey(redis, keyActionCount(year, month, actionType)),
    incrementKey(redis, keyModCount(year, month, moderator)),
    target ? incrementKey(redis, keyTargetCount(year, month, target)) : Promise.resolve(),
    incrementKey(redis, keyDailyCount(year, month, day)),
    pushRecentAction(redis, keyRecentActions(year, month), {
      actionType,
      moderator,
      target,
      timestamp: now.toISOString(),
      contentId: action.targetPost?.id || action.targetComment?.id || '',
    }),
  ]);
}

interface RecentEntry {
  actionType: string;
  moderator: string;
  target: string;
  timestamp: string;
  contentId: string;
}

async function pushRecentAction(
  redis: any,
  key: string,
  entry: RecentEntry
): Promise<void> {
  const raw = await redis.get(key);
  const list: RecentEntry[] = raw ? JSON.parse(raw) : [];
  list.unshift(entry);
  if (list.length > 200) list.length = 200;
  await redis.set(key, JSON.stringify(list));
}
