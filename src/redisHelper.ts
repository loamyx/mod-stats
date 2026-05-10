import { RedisClient } from '@devvit/public-api';
import { REDIS_PREFIX } from './constants.js';

// Key builders — all data stored in sorted sets (no string key scanning needed)
export function keyLeaderboard(year: number, month: number): string {
  return `${REDIS_PREFIX}:leaderboard:${year}-${String(month).padStart(2, '0')}`;
}

export function keyActionCounts(year: number, month: number): string {
  return `${REDIS_PREFIX}:actions:${year}-${String(month).padStart(2, '0')}`;
}

export function keyDailyCounts(year: number, month: number): string {
  return `${REDIS_PREFIX}:daily:${year}-${String(month).padStart(2, '0')}`;
}

export function keyTargetCounts(year: number, month: number): string {
  return `${REDIS_PREFIX}:targets:${year}-${String(month).padStart(2, '0')}`;
}

export function keyDedup(actionId: string): string {
  return `${REDIS_PREFIX}:dedup:${actionId}`;
}

// Write: increment a member's score in a sorted set
export async function incrementMember(
  redis: RedisClient,
  key: string,
  member: string,
  amount: number = 1
): Promise<void> {
  await redis.zIncrBy(key, member, amount);
}

// Read: get top N members from a sorted set (descending by score)
export async function getTopMembers(
  redis: RedisClient,
  key: string,
  count: number = 10
): Promise<{ member: string; score: number }[]> {
  return await redis.zRange(key, 0, count - 1, { by: 'rank', reverse: true });
}
