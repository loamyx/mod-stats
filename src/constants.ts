export const REDIS_PREFIX = "modstats";

export const JOBS = {
  WIKI_UPDATE: "modstats-wiki-update",
} as const;

export const CRON = {
  WIKI_UPDATE: "0 */6 * * *",
} as const;

export const TRACKED_ACTIONS = [
  "removelink",
  "removecomment",
  "approvelink",
  "approvecomment",
  "spamlink",
  "spamcomment",
  "banuser",
  "unbanuser",
  "muteuser",
  "unmuteuser",
  "lock",
  "unlock",
  "sticky",
  "unsticky",
  "distinguish",
  "setpermissions",
  "invitemoderator",
  "removemoderator",
  "acceptmoderatorinvite",
  "editflair",
] as const;

export type TrackedAction = (typeof TRACKED_ACTIONS)[number];

export const ACTION_LABELS: Record<string, string> = {
  removelink: "Post Removals",
  removecomment: "Comment Removals",
  approvelink: "Post Approvals",
  approvecomment: "Comment Approvals",
  spamlink: "Post Spam",
  spamcomment: "Comment Spam",
  banuser: "Bans",
  unbanuser: "Unbans",
  muteuser: "Mutes",
  unmuteuser: "Unmutes",
  lock: "Locks",
  unlock: "Unlocks",
  sticky: "Stickied",
  unsticky: "Unstickied",
  distinguish: "Distinguished",
  setpermissions: "Permission Changes",
  invitemoderator: "Mod Invites",
  removemoderator: "Mod Removals",
  acceptmoderatorinvite: "Mod Accepts",
  editflair: "Flair Edits",
};
