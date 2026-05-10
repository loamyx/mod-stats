import { RedisClient } from '@devvit/public-api';

const PREFIX = 'mod-stats';

export function keyActionCount(year: number, month: number, action: string): string {
  return `${PREFIX}:actions:${year}-${String(month).padStart(2, '0')}:${action}`;
}

export function keyModCount(year: number, month: number, moderator: string): string {
  return `${PREFIX}:mods:${year}-${String(month).padStart(2, '0')}:${moderator}`;
}

export function keyTargetCount(year: number, month: number, target: string): string {
  return `${PREFIX}:targets:${year}-${String(month).padStart(2, '0')}:${target}`;
}

export function keyDailyCount(year: number, month: number, day: number): string {
  return `${PREFIX}:daily:${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function keyRecentActions(year: number, month: number): string {
  return `${PREFIX}:recent:${year}-${String(month).padStart(2, '0')}`;
}

export function keyDedup(actionId: string): string {
  return `${PREFIX}:seen:${actionId}`;
}

export async function incrementKey(redis: RedisClient, key: string, amount = 1): Promise<void> {
  const current = await redis.get(key);
  await redis.set(key, String(Number(current || '0') + amount));
}

export async function getCount(redis: RedisClient, key: string): Promise<number> {
  const val = await redis.get(key);
  return Number(val || '0');
}

export async function getKeysWithPrefix(redis: RedisClient, prefix: string): Promise<string[]> {
  const results: string[] = [];
  let cursor = 0;
  do {
    const scan = await redis.scan(cursor, { match: `${prefix}*`, count: 100 });
    cursor = scan.cursor;
    results.push(...scan.keys);
  } while (cursor !== 0);
  return results;
}
