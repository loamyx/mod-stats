import { Devvit } from '@devvit/public-api';
import { JOBS } from './constants.js';
import { handleModAction } from './modActionHandling.js';
import { generateModStatsWiki } from './modStatsWiki.js';
import { appSettings } from './settings.js';
import { handleInstall, handleUpgrade } from './installEvents.js';

Devvit.configure({ redditAPI: true, redis: true });

Devvit.addSettings(appSettings);

Devvit.addTrigger({
  event: 'ModAction',
  onEvent: handleModAction,
});

Devvit.addTrigger({
  event: 'AppInstall',
  onEvent: handleInstall,
});

Devvit.addTrigger({
  event: 'AppUpgrade',
  onEvent: handleUpgrade,
});

Devvit.addSchedulerJob({
  name: JOBS.DAILY_WIKI_UPDATE,
  onRun: async (event, context) => {
    await generateModStatsWiki(context);
  },
});

Devvit.addSchedulerJob({
  name: JOBS.YEAR_END_ROLLUP,
  onRun: async (event, context) => {
    await generateModStatsWiki(context, { yearEnd: true });
  },
});

export default Devvit;
