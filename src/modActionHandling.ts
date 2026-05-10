import { TriggerContext } from '@devvit/public-api';
import { TRACKED_ACTIONS } from './constants.js';
import {
  keyLeaderboard,
  keyActionCounts,
  keyDailyCounts,
  keyTargetCounts,
  keyDedup,
  incrementMember,
} from './redisHelper.js';

export async function handleModAction(
  event: any,
  context: TriggerContext
): Promise<void> {
  const action = event.action ?? event;
  const actionType: string = (action.actionType ?? action.action ?? action.type ?? '').toLowerCase();
  if (!actionType) return;
  if (!TRACKED_ACTIONS.includes(actionType as any)) return;

  const actionId: string = action.id ?? action.actionId ?? '';
  if (!actionId) return;

  const { redis } = context;

  // Deduplication
  const dedupKey = keyDedup(actionId);
  const seen = await redis.get(dedupKey);
  if (seen) return;
  await redis.set(dedupKey, '1', { expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

  const now = action.createdAt ? new Date(action.createdAt) : new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = String(now.getUTCDate()).padStart(2, '0');

  const moderator: string = action.moderatorName ?? action.moderator?.name ?? 'unknown';
  const target: string = action.targetUserName ?? action.targetUser?.name ?? '';

  await Promise.all([
    incrementMember(redis, keyLeaderboard(year, month), moderator),
    incrementMember(redis, keyActionCounts(year, month), actionType),
    incrementMember(redis, keyDailyCounts(year, month), day),
    target ? incrementMember(redis, keyTargetCounts(year, month), target) : Promise.resolve(),
  ]);
}
