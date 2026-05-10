export const JOBS = {
  DAILY_WIKI_UPDATE: 'daily-mod-stats-wiki',
  YEAR_END_ROLLUP: 'year-end-mod-stats-rollup',
} as const;

export const CRON = {
  DAILY: '0 1 * * *',
  YEAR_END: '55 23 31 12 *',
} as const;

export const TRACKED_ACTIONS = [
  'removelink',
  'removecomment',
  'approvelink',
  'approvecomment',
  'spamlink',
  'spamcomment',
  'banuser',
  'unbanuser',
  'muteuser',
  'unmuteuser',
  'lock',
  'unlock',
  'sticky',
  'unsticky',
  'distinguish',
  'setpermissions',
  'invitemoderator',
  'removemoderator',
  'acceptmoderatorinvite',
  'editflair',
  'wikibanned',
  'wikicontributor',
] as const;

export type TrackedAction = (typeof TRACKED_ACTIONS)[number];

export const ACTION_LABELS: Record<string, string> = {
  removelink: 'Post Removals',
  removecomment: 'Comment Removals',
  approvelink: 'Post Approvals',
  approvecomment: 'Comment Approvals',
  spamlink: 'Post Spam',
  spamcomment: 'Comment Spam',
  banuser: 'Bans',
  unbanuser: 'Unbans',
  muteuser: 'Mutes',
  unmuteuser: 'Unmutes',
  lock: 'Locks',
  unlock: 'Unlocks',
  sticky: 'Stickied',
  unsticky: 'Unstickied',
  distinguish: 'Distinguished',
  setpermissions: 'Permission Changes',
  invitemoderator: 'Mod Invites',
  removemoderator: 'Mod Removals',
  acceptmoderatorinvite: 'Mod Accepts',
  editflair: 'Flair Edits',
  wikibanned: 'Wiki Bans',
  wikicontributor: 'Wiki Contributor Adds',
};
