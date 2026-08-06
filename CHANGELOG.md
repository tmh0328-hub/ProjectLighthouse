# Changelog

All notable Project Lighthouse development changes should be recorded here.

## 2026-08-06

### Documentation

- Rebuilt `README.md` as the project entry point.
- Updated `ROADMAP.md` to reflect the actual MVP state.
- Added `DEVELOPER_HANDOFF.md` for new developers and new ChatGPT conversations.
- Added `CHANGELOG.md` as the permanent session history.
- Established `main` and the repository documentation as the source of truth.

### Product Direction

- Confirmed functionality and factual sourcing before visual polish.
- Confirmed residents-first product focus.
- Confirmed Fishing Intelligence remains deferred.
- Confirmed Marine Offshore Forecast is fixed to the Hatteras Inlet offshore context rather than changing by village.

## 2026-08-05

### Added

- Dashboard architecture and community selector.
- Live village-specific Weather module using National Weather Service data.
- Tides module using NOAA prediction data.
- Cameras module with village, topic, search, and approximate map views.
- Roads module with DriveNC and NCDOT official-source navigation.
- Hatteras–Ocracoke Ferry module with seasonal 2026 schedules, next-departure calculation, and countdown.
- Alerts module with live NWS alerts and official supplemental agency links.
- Marine Offshore Forecast module using NWS marine zone AMZ154.
- Clickable Alerts item in the dashboard status bar.
- Source and limitation disclosures across newer modules.

### Changed

- Replaced the dashboard Fishing module with Marine Offshore Forecast.
- Consolidated approved module work onto `main`.
- Simplified the small-team Git workflow to use `main` directly for approved work.
- Shifted Cameras from an embed-first concept to a curated directory that links to official sources when embedding is unavailable or inappropriate.

### Fixed

- Restored Weather and Tides alongside Cameras after feature-branch confusion.
- Corrected dashboard navigation so Weather, Tides, Cameras, Roads, Ferry, Alerts, and Marine open their deeper pages.
- Corrected the Ferry schedule typo from `3::00 p.m.` to `3:00 p.m.`.
- Reworked the Marine integration from an unsuitable marine point-forecast attempt to the working AMZ154 zone forecast.
- Identified browser JavaScript caching as the cause of one apparently unsuccessful Marine fix.

### Known Limitations

- Dashboard summary values still include prototype text and are not all live.
- Roads does not yet automatically ingest DriveNC events.
- Alerts only automatically ingest NWS weather alerts.
- Ferry timetable calculations do not represent live service disruptions.
- Camera feeds mostly link to original providers rather than embedding.
- Visual styling and shared navigation are not yet standardized.
- No production hosting, automated tests, monitoring, or deployment pipeline exists yet.
