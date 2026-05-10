import { Devvit, TriggerContext } from '@devvit/public-api';
import { handleModAction } from './modActionHandling.js';
import { updateWikiPage } from './modStatsWiki.js';

Devvit.configure({ redditAPI: true, redis: true });

Devvit.addTrigger({
  event: 'ModAction',
  onEvent: async (event, context: TriggerContext) => {
    try {
      await handleModAction(event, context);
    } catch (err) {
      console.error('[mod-stats] Error handling mod action:', err);
    }
  },
});

Devvit.addSchedulerJob({
  name: 'updateWiki',
  onRun: async (_event, context: TriggerContext) => {
    try {
      await updateWikiPage(context);
    } catch (err) {
      console.error('[mod-stats] Error updating wiki:', err);
    }
  },
});

Devvit.addTrigger({
  event: 'AppInstall',
  onEvent: async (_event, context: TriggerContext) => {
    await context.scheduler.runJob({
      name: 'updateWiki',
      cron: '0 */6 * * *',
    });
    console.log('[mod-stats] Scheduled wiki update every 6 hours.');
  },
});

export default Devvit;
