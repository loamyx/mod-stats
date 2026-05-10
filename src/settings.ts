import { SettingsFormField } from '@devvit/public-api';

export const appSettings: SettingsFormField[] = [
  {
    type: 'boolean',
    name: 'modOnly',
    label: 'Restrict wiki page to moderators only',
    defaultValue: true,
  },
  {
    type: 'number',
    name: 'topNTargets',
    label: 'Number of top targeted users to show',
    defaultValue: 5,
    onValidate: (event) => {
      const val = event.value as number;
      if (val < 1 || val > 25) return 'Must be between 1 and 25';
    },
  },
  {
    type: 'number',
    name: 'recentActionsCount',
    label: 'Number of recent actions to display',
    defaultValue: 20,
    onValidate: (event) => {
      const val = event.value as number;
      if (val < 5 || val > 100) return 'Must be between 5 and 100';
    },
  },
];
