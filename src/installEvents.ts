import { TriggerContext } from "@devvit/public-api";
import { JOBS, CRON } from "./constants.js";

export async function handleInstall(
  _event: any,
  context: TriggerContext
): Promise<void> {
  await scheduleWikiJob(context);
  console.log("[mod-stats] App installed \u2014 wiki update job scheduled.");
}

export async function handleUpgrade(
  _event: any,
  context: TriggerContext
): Promise<void> {
  const jobs = await context.scheduler.listJobs();
  for (const job of jobs) {
    if (job.name === JOBS.WIKI_UPDATE) {
      await context.scheduler.cancelJob(job.id);
    }
  }
  await scheduleWikiJob(context);
  console.log("[mod-stats] App upgraded \u2014 wiki update job rescheduled.");
}

async function scheduleWikiJob(context: TriggerContext): Promise<void> {
  await context.scheduler.runJob({
    name: JOBS.WIKI_UPDATE,
    cron: CRON.WIKI_UPDATE,
  });
}
