import { TriggerContext } from '@devvit/public-api';

const REDIS_PREFIX = 'modstats:';

export async function handleModAction(event: any, context: TriggerContext): Promise<void> {
  const moderator = event.moderator?.name;
  const action = event.action;

  if (!moderator || !action) {
    return;
  }

  const redis = context.redis;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Increment global leaderboard
  await redis.zIncrBy(`${REDIS_PREFIX}leaderboard`, moderator, 1);

  // Increment daily count for this moderator
  await redis.zIncrBy(`${REDIS_PREFIX}daily:${today}`, moderator, 1);

  // Track action type breakdown
  await redis.zIncrBy(`${REDIS_PREFIX}actions:${moderator}`, action, 1);

  // Increment total action counter
  await redis.incrBy(`${REDIS_PREFIX}total`, 1);

  console.log(`[mod-stats] Recorded: ${moderator} -> ${action}`);
}
