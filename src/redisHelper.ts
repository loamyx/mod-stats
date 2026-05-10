import { RedisClient } from "@devvit/public-api";
import { REDIS_PREFIX } from "./constants.js";

export function keyLeaderboard(year: number, month: number): string {
  return `${REDIS_PREFIX}:leaderboard:${year}-${String(month).padStart(2, "0")}`;
}

export function keyActionCounts(year: number, month: number): string {
  return `${REDIS_PREFIX}:actions:${year}-${String(month).padStart(2, "0")}`;
}

export function keyDailyCounts(year: number, month: number): string {
  return `${REDIS_PREFIX}:daily:${year}-${String(month).padStart(2, "0")}`;
}

export function keyTargetCounts(year: number, month: number): string {
  return `${REDIS_PREFIX}:targets:${year}-${String(month).padStart(2, "0")}`;
}

export function keyRecentActions(year: number, month: number): string {
  return `${REDIS_PREFIX}:recent:${year}-${String(month).padStart(2, "0")}`;
}

export function keyDedup(actionId: string): string {
  return `${REDIS_PREFIX}:dedup:${actionId}`;
}

export async function incrementMember(
  redis: RedisClient,
  key: string,
  member: string,
  amount: number = 1
): Promise<void> {
  await redis.zIncrBy(key, member, amount);
}

export async function getTopMembers(
  redis: RedisClient,
  key: string,
  count: number = 10
): Promise<{ member: string; score: number }[]> {
  return await redis.zRange(key, 0, count - 1, { by: "rank", reverse: true });
}

export async function getMemberScore(
  redis: RedisClient,
  key: string,
  member: string
): Promise<number> {
  const score = await redis.zScore(key, member);
  return score ?? 0;
}
