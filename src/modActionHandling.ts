import { ModAction, TriggerContext } from "@devvit/public-api";
import { TRACKED_ACTIONS } from "./constants.js";
import {
  keyLeaderboard,
  keyActionCounts,
  keyDailyCounts,
  keyTargetCounts,
  keyRecentActions,
  keyDedup,
  incrementMember,
} from "./redisHelper.js";
import { addMinutes } from "date-fns";

export async function handleModAction(
  event: ModAction,
  context: TriggerContext
): Promise<void> {
  if (!event.action) return;

  const actionType = event.action.toLowerCase();
  if (!TRACKED_ACTIONS.includes(actionType as any)) return;

  const actionId = event.actionId;
  if (!actionId) return;

  const { redis } = context;

  const dedupKey = keyDedup(actionId);
  const seen = await redis.get(dedupKey);
  if (seen) return;
  await redis.set(dedupKey, "1", { expiration: addMinutes(new Date(), 10080) });

  const now = event.actionedAt ? new Date(event.actionedAt) : new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = String(now.getUTCDate()).padStart(2, "0");

  const moderator = event.moderator?.name ?? "unknown";
  const target = event.targetUser?.name ?? "";

  await Promise.all([
    incrementMember(redis, keyLeaderboard(year, month), moderator),
    incrementMember(redis, keyActionCounts(year, month), actionType),
    incrementMember(redis, keyDailyCounts(year, month), day),
    target
      ? incrementMember(redis, keyTargetCounts(year, month), target)
      : Promise.resolve(),
    pushRecentAction(redis, keyRecentActions(year, month), {
      action: actionType,
      moderator,
      target,
      timestamp: now.toISOString(),
      contentId: event.targetPost?.id ?? event.targetComment?.id ?? "",
    }),
  ]);
}

interface RecentEntry {
  action: string;
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
