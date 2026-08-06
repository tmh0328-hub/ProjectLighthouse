# Project Lighthouse

> **Let the light guide you.**

Project Lighthouse is a mobile-friendly Hatteras Island information dashboard designed to answer the questions residents and visitors ask every day without forcing them to hunt through multiple government, weather, ferry, road, and camera websites.

## Product Vision

A Hatteras Island resident should be able to open Lighthouse and understand the island's most important conditions in under 30 seconds.

Project Lighthouse guides decisions rather than merely displaying data.

## Current MVP Modules

| Module | Status | Primary source |
|---|---|---|
| Dashboard | Functional | Internal UI and module links |
| Weather | Live | National Weather Service API |
| Tides | Functional | NOAA tide predictions |
| Marine Offshore Forecast | Live | NWS marine zone AMZ154 |
| Alerts | Live weather alerts; curated official links for other agencies | NWS, DriveNC, NCDOT, Dare County, NPS |
| Roads | MVP directory/status page | DriveNC, NCDOT NC 12 |
| Cameras | MVP curated directory with village, topic, and map views | Official and location-owned camera pages |
| Hatteras–Ocracoke Ferry | Functional schedule and countdown | NCDOT Ferry Division schedule |

The Fishing module is deferred. It was removed from the MVP because reliable fishing recommendations require more evidence and should not be presented as fact when they are largely opinion-based.

## Important Product Decisions

- Functionality first, visual polish later.
- Use authoritative sources whenever practical.
- Identify data sources on screen.
- Never invent environmental, road, ferry, or emergency data.
- Static datasets are acceptable when authoritative and slow-changing.
- Live API failures must degrade gracefully.
- The Marine module uses a fixed Hatteras Inlet offshore forecast, regardless of selected village.
- Residents are the primary audience; visitors benefit from the same clarity.

## Local Development

The site is currently a static HTML, CSS, and JavaScript application in the `website/` directory.

Open:

```text
website/index.html
```

The browser may cache JavaScript. After pulling changes, use a hard refresh when a module still appears outdated.

## Git Workflow

The project currently uses `main` as the working source of truth.

To update the local copy:

```powershell
git checkout main
git pull
```

Before editing locally:

```powershell
git status
```

The desired clean state is:

```text
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

Long-lived feature branches are intentionally avoided for the current two-person workflow unless work is experimental or risky.

## Documentation

Read these files before continuing development:

1. `README.md`
2. `ROADMAP.md`
3. `DEVELOPER_HANDOFF.md`
4. `CHANGELOG.md`

A new development conversation should begin with:

> Continue Project Lighthouse. Read README.md, ROADMAP.md, DEVELOPER_HANDOFF.md, and CHANGELOG.md from the GitHub repository before making recommendations. Use `main` as the source of truth.

## Current Priority

The MVP core exists. The next phase is integration, verification, responsive cleanup, source reliability, and public deployment rather than adding speculative modules.
