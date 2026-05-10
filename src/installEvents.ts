import { TriggerContext } from '@devvit/public-api';
import { JOBS, CRON } from './constants.js';

export async function handleInstall(
  _event: unknown,
  context: TriggerContext
): Promise<void> {
  await scheduleJobs(context);
  console.log('[mod-stats] App installed — scheduled wiki update job (every 6 hours).');
}

export async function handleUpgrade(
  _event: unknown,
  context: TriggerContext
): Promise<void> {
  await scheduleJobs(context);
  console.log('[mod-stats] App upgraded — rescheduled wiki update job.');
}

async function scheduleJobs(context: TriggerContext): Promise<void> {
  // Cancel existing wiki jobs to avoid duplicates
  try {
    const jobs = await context.scheduler.listJobs();
    for (const job of jobs) {
      if (job.name === JOBS.DAILY_WIKI_UPDATE) {
        await context.scheduler.cancelJob(job.id);
      }
    }
  } catch {
    // listJobs may not be available in all versions, continue
  }

  await context.scheduler.runJob({
    name: JOBS.DAILY_WIKI_UPDATE,
    cron: CRON.DAILY,
  });
}
