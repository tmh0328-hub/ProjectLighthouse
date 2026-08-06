# Project Lighthouse Developer Handoff

## Start Here

Before changing code, read:

1. `README.md`
2. `ROADMAP.md`
3. `DEVELOPER_HANDOFF.md`
4. `CHANGELOG.md`

Treat the `main` branch as the current source of truth.

## Project Summary

Project Lighthouse is a static HTML, CSS, and JavaScript dashboard for Hatteras Island. Its purpose is to aggregate trusted island information into one fast, readable application.

The MVP is functional. Current work should emphasize verification, integration, reliability, mobile behavior, and deployment rather than uncontrolled feature expansion.

## Repository

```text
tmh0328-hub/ProjectLighthouse
```

Primary application directory:

```text
website/
```

Important entry point:

```text
website/index.html
```

## Current Architecture

The application is client-side and currently requires no application server.

```text
Dashboard
├── Weather
│   └── National Weather Service API
├── Tides
│   └── NOAA predictions
├── Marine
│   └── NWS marine zone AMZ154
├── Alerts
│   ├── Live NWS alerts
│   └── Curated official agency links
├── Roads
│   └── DriveNC and NCDOT links; structured integration pending
├── Cameras
│   └── Curated source directory and approximate map
└── Ferry
    └── Static authoritative 2026 schedule with browser-side countdown
```

## Module Status

### Dashboard

Files:

```text
website/index.html
website/styles.css
website/app.js
```

The dashboard routes to completed module pages. Some summary values remain prototype text and must not be mistaken for live status.

### Weather

Files:

```text
website/weather.html
website/weather.css
website/weather.js
```

Uses NWS data and changes by selected village. Verify API behavior after public hosting because browser origin and caching behavior can differ from local `file://` use.

### Tides

Files:

```text
website/tides.html
website/tides.css
website/tides.js
```

Uses NOAA prediction data and includes graph/countdown presentation. Confirm station, timezone, and any fishing-language claims before public release.

### Marine

Files:

```text
website/marine.html
website/marine.css
website/marine.js
```

Uses fixed NWS marine zone `AMZ154` for waters south of Cape Hatteras to Ocracoke Inlet out 20 NM. This module intentionally does not change with dashboard village selection because Hatteras Island boaters use the same inlet context.

A prior point-forecast approach failed for this marine location. The working implementation uses the marine-zone endpoint. Browser caching caused one apparent failed fix; hard refresh after JavaScript changes.

### Alerts

Files:

```text
website/alerts.html
website/alerts.css
website/alerts.js
```

Live automation currently covers NWS alerts. Other sources are official links and must be described honestly as such. Do not imply DriveNC, ferry, Dare County, or NPS alerts are automatically aggregated until they actually are.

### Roads

Files:

```text
website/roads.html
website/roads.css
website/roads.js
```

MVP links users to DriveNC, NCDOT NC 12 updates, cameras, and official road resources. DriveNC structured API integration is pending developer access/configuration.

### Cameras

Files:

```text
website/cameras.html
website/cameras.css
website/cameras.js
```

Current curated sources include official or location-owned camera pages such as Oregon Inlet, NPS, Rodanthe Pier, NCDOT ferry cameras, and DriveNC traffic cameras.

The map is an approximate visual overlay, not GIS navigation. Do not scrape, bypass subscriptions, or circumvent embed restrictions from Surfline, SurfChex, or other providers.

### Ferry

Files:

```text
website/ferry.html
website/ferry.css
website/ferry.js
```

The Hatteras–Ocracoke vehicle ferry schedule is static authoritative 2026 data supplied from NCDOT. JavaScript calculates the next departure and countdown locally.

The schedule must be reviewed after December 31, 2026 or whenever NCDOT announces changes. Do not label the ferry “on schedule” based only on the timetable; live service status requires a separate official feed.

## Data and Source Rules

- Use primary government/operating-agency sources whenever practical.
- Display source names and update times.
- Do not convert missing data into reassuring status text.
- “No data received” is not the same as “no problem exists.”
- Static data must include an effective period or last-updated date.
- API failure states should preserve a direct official-source link.
- Never scrape around authentication, paywalls, or explicit embed restrictions.

## Product Decisions That Should Be Preserved

- Functionality before aesthetics.
- Fishing Intelligence is deferred.
- Marine replaces Fishing in the MVP dashboard.
- Marine uses one fixed Hatteras Inlet offshore context.
- Cameras may link out rather than embed.
- `main` is the working source of truth for the current small-team workflow.
- No long-lived feature branches unless work is experimental or risky.
- Build for residents first.

## Known Issues and Technical Debt

- Dashboard includes prototype values that are not yet fed by modules.
- Camera count/status labels may not match the actual curated dataset.
- Roads is not yet automatically consuming DriveNC structured events.
- Alerts only automatically consume NWS weather alerts.
- Ferry timetable does not prove current operating status.
- Visual design varies between modules.
- Shared navigation and shared components are duplicated across static pages.
- Browser caching can make updated JavaScript appear unchanged.
- Local `file://` behavior may differ from hosted HTTPS behavior.
- There is no automated test suite, error monitoring, or deployment pipeline yet.

## Recommended Next Work

1. Audit every dashboard claim and remove or connect prototype values.
2. Test every page and external link from `main`.
3. Standardize loading, empty, error, source, and timestamp presentation.
4. Improve cross-module navigation.
5. Test mobile widths and keyboard accessibility.
6. Deploy a private HTTPS test build.
7. Validate all live APIs from the hosted origin.
8. Add monitoring and lightweight analytics before public launch.

## Git Workflow

Update local code:

```powershell
git checkout main
git pull
git status
```

When local editing is requested:

```powershell
git add .
git commit -m "Describe the change"
git push
```

Do not claim a GitHub write succeeded without an actual connector/tool result or visible commit.

## New Conversation Handoff Prompt

Use this in a fresh ChatGPT conversation:

> Continue Project Lighthouse. Read README.md, ROADMAP.md, DEVELOPER_HANDOFF.md, and CHANGELOG.md from `tmh0328-hub/ProjectLighthouse` on `main` before making recommendations or edits. Treat those files and the repository as the source of truth. Functionality and factual sourcing come before visual polish.
