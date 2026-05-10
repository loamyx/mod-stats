import { Devvit } from "@devvit/public-api";
import { JOBS } from "./constants.js";
import { appSettings } from "./settings.js";
import { handleModAction } from "./modActionHandling.js";
import { generateModStatsWiki } from "./modStatsWiki.js";
import { handleInstall, handleUpgrade } from "./installEvents.js";

Devvit.configure({ redditAPI: true, redis: true });

Devvit.addSettings(appSettings);

Devvit.addTrigger({
  event: "ModAction",
  onEvent: handleModAction,
});

Devvit.addTrigger({
  event: "AppInstall",
  onEvent: handleInstall,
});

Devvit.addTrigger({
  event: "AppUpgrade",
  onEvent: handleUpgrade,
});

Devvit.addSchedulerJob({
  name: JOBS.WIKI_UPDATE,
  onRun: async (_event, context) => {
    await generateModStatsWiki(context);
  },
});

export default Devvit;
