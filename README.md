# mod-stats

A Devvit app that tracks and surfaces **moderation insights** for subreddit moderators — action counts, top moderators, frequently-targeted users, and daily trends — all from the mod log.

Built for hackathons. Extends the proven patterns of [sub-stats-bot](https://github.com/fsvreddit/sub-stats-bot).

## What It Tracks

| Category | Details |
|---|---|
| **Action Types** | Removals (post/comment), approvals, bans, unbans, locks, unlocks, spam removals |
| **Top Moderators** | Ranked by total mod actions in the period |
| **Top-Targeted Users** | Users with the most actions taken against them |
| **Daily Trends** | Actions per day, charted over the month |
| **Recent Actions** | Sample of recent mod actions for quick review |

## Output

A Reddit wiki page at `mod-stats/{year}` with monthly sections:

- **Moderation Insights — May 2026**
  - Actions summary (counts by type)
  - Top moderators (who's doing the most moderation)
  - Top-targeted users
  - Daily action counts
  - Recent notable actions

Stats update daily at 01:00 UTC.

## Quick Start

```bash
npm install
npx devvit upload
npx devvit playtest <subreddit-name>
```

## Configuration

| Setting | Description |
|---|---|
| **Subreddit to monitor** | Which subreddit's modlog to track |
| **Restrict visibility** | Show wiki pages to mods only (default: yes) |
| **Top N users to show** | How many top-targeted users to display (default: 5) |

## Architecture

```
src/
├── main.ts                  # Entry point — registers triggers + jobs
├── constants.ts             # Job names, cron schedules
├── modActionHandling.ts     # Captures all ModAction events → Redis
├── modStatsWiki.ts          # Generates the Moderation Insights wiki page
├── redisHelper.ts           # Redis key helpers
├── utility.ts               # Shared utilities
├── settings.ts              # App settings definitions
├── installEvents.ts         # Install + upgrade handlers
```

## License

BSD-3-Clause