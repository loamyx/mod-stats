import { SettingsFormField } from "@devvit/public-api";

export const appSettings: SettingsFormField[] = [
  {
    type: "number",
    name: "wikiTopN",
    label: "Top N moderators to show in wiki",
    defaultValue: 10,
  },
  {
    type: "number",
    name: "recentActionsCount",
    label: "Number of recent actions to display",
    defaultValue: 25,
  },
  {
    type: "string",
    name: "wikiPageName",
    label: "Wiki page name for stats",
    defaultValue: "mod-stats",
  },
];
