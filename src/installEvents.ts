import { TriggerContext } from '@devvit/public-api';
import { JOBS, CRON } from './constants.js';

export async function handleInstall(event: unknown, context: TriggerContext): Promise<void> {
  await scheduleJobs(context);
  console.log('[mod-stats] App installed — scheduled daily + year-end jobs.');
}

export async function handleUpgrade(event: unknown, context: TriggerContext): Promise<void> {
  await scheduleJobs(context);
  console.log('[mod-stats] App upgraded — rescheduled jobs.');
}

async function scheduleJobs(context: TriggerContext): Promise<void> {
  const existingJobs = await context.scheduler.listJobs();
  for (const job of existingJobs) {
    if (job.name === JOBS.DAILY_WIKI_UPDATE || job.name === JOBS.YEAR_END_ROLLUP) {
      await context.scheduler.cancelJob(job.id);
    }
  }

  await context.scheduler.runJob({
    name: JOBS.DAILY_WIKI_UPDATE,
    cron: CRON.DAILY,
  });

  await context.scheduler.runJob({
    name: JOBS.YEAR_END_ROLLUP,
    cron: CRON.YEAR_END,
  });
}
