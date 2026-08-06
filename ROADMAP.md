# Project Lighthouse Roadmap

> **Mission:** Let the light guide you.

Project Lighthouse is a one-stop Hatteras Island dashboard. It should help residents and visitors understand weather, water, roads, ferries, cameras, marine conditions, and urgent alerts without searching across a collection of agency websites designed during unrelated geological eras.

## Product Vision

A Hatteras Island resident should be able to open Lighthouse and understand the island's most important conditions in under 30 seconds.

## Current Status

**Phase:** Core MVP functional; integration and refinement underway.

The project has moved beyond a shell. The dashboard and seven deeper modules now function, with a combination of live authoritative APIs and curated official datasets.

## Phase 0: Foundation ✅ Complete

- [x] Mission and product philosophy established
- [x] Dashboard-first architecture established
- [x] Local development environment working
- [x] Git and GitHub repository configured
- [x] GitHub connected to ChatGPT
- [x] Approved work consolidated on `main`
- [x] Documentation established as project memory

## Phase 1: Core MVP Modules ✅ Substantially Complete

### Dashboard

**Status:** Functional MVP

- [x] Community selector
- [x] Module grid
- [x] Deep navigation to completed modules
- [x] Clickable Alerts status item
- [x] Weather, tides, marine, cameras, roads, ferry, beaches/map placeholders represented
- [ ] Replace prototype summary values with live cross-module summaries
- [ ] Final mobile and accessibility pass

### Weather

**Status:** Live MVP

**Source:** National Weather Service API

- [x] Village-specific forecast selection
- [x] Current and forecast conditions
- [x] Source identification
- [x] Graceful API failure state
- [ ] Improve decision-oriented summary
- [ ] Add water and rip-current context where authoritative data supports it

### Tides

**Status:** Functional MVP

**Source:** NOAA tide predictions

- [x] Tide predictions and graph
- [x] Next tide and countdown
- [x] Current trend
- [x] Extended table
- [x] Sunrise, sunset, and moon context
- [ ] Verify all station and timezone behavior
- [ ] Remove or clearly qualify opinion-based fishing guidance

### Marine Offshore Forecast

**Status:** Live MVP

**Source:** NWS marine zone AMZ154, south of Cape Hatteras to Ocracoke Inlet out 20 NM

- [x] Replaced Fishing module on dashboard
- [x] Fixed Hatteras Inlet offshore forecast regardless of village selection
- [x] Live wind and sea forecast periods
- [x] Official-source link and update time
- [x] Graceful failure state
- [ ] Improve wave-detail parsing
- [ ] Surface active marine advisories prominently
- [ ] Add observed buoy conditions later if a reliable source is integrated

### Cameras

**Status:** Functional MVP directory

- [x] Village view
- [x] Topic view
- [x] Approximate map view
- [x] Search
- [x] Curated official/location-owned camera links
- [x] Hatteras map artwork and clickable pins
- [ ] Verify every camera regularly
- [ ] Replace inaccurate placeholder counts on dashboard
- [ ] Embed only feeds that explicitly allow it
- [ ] Refine visuals later

### Roads

**Status:** Functional MVP directory/status page

**Sources:** DriveNC, NCDOT NC 12, official traffic-camera pages

- [x] Dedicated Roads page
- [x] Official-source links
- [x] Source and limitation disclosure
- [ ] Integrate DriveNC structured data after developer access is configured
- [ ] Connect relevant road incidents to nearby cameras
- [ ] Replace prototype dashboard road status with live data

### Hatteras–Ocracoke Ferry

**Status:** Functional MVP

**Source:** NCDOT Ferry Division schedule, last supplied update June 25, 2026

- [x] Seasonal 2026 schedules
- [x] Automatic current schedule selection
- [x] Next-departure calculation
- [x] Live countdown
- [x] Past and next departure highlighting
- [x] Fare and 70-minute crossing information
- [x] Official ferry and camera links
- [ ] Add service disruptions when a reliable structured feed is available
- [ ] Verify schedule after December 31, 2026 and whenever NCDOT revises it

### Alerts

**Status:** Live weather-alert MVP with official supplemental sources

**Sources:** NWS, DriveNC, NCDOT Ferry Division, Dare County/OBX Alerts, NPS

- [x] Live NWS alerts
- [x] Severity, urgency, effective, and expiration information
- [x] Official-source links
- [x] No-alert and failure states
- [x] Dashboard status-bar navigation
- [ ] Integrate non-weather structured alerts where available
- [ ] Feed active alert count/status back into dashboard
- [ ] Deep-link alerts to affected modules

### Fishing Intelligence

**Status:** Deferred

Fishing recommendations are not part of the current MVP. They are subjective unless supported by historical observations and clearly stated methodology. The feature may return later as a data-backed intelligence project rather than a collection of opinions dressed in confident typography.

### Island Map

**Status:** Post-core MVP

Potential layers:

- Cameras
- Ferry terminals
- Road incidents
- Beach and ORV access
- Emergency resources
- Public parking and facilities

Build only after the underlying datasets are reliable enough to make the map useful.

## Phase 2: Integration and Reliability 🔨 Current

- [ ] Audit every dashboard value and remove prototype claims
- [ ] Make module summaries live or clearly labeled static
- [ ] Connect Roads to Cameras
- [ ] Connect Ferry to terminal cameras and disruptions
- [ ] Connect Alerts to Weather, Marine, Roads, and Ferry
- [ ] Standardize source labels and update timestamps
- [ ] Standardize loading, empty, and failure states
- [ ] Verify timezone handling across all modules
- [ ] Add basic automated or repeatable manual testing checklist
- [ ] Complete responsive and accessibility review

## Phase 3: Public MVP Deployment

- [ ] Select hosting provider
- [ ] Select and purchase domain
- [ ] Serve the site over HTTPS
- [ ] Confirm API behavior from hosted origin
- [ ] Add lightweight analytics and error monitoring
- [ ] Test on iPhone, Android, Windows, and major browsers
- [ ] Conduct quiet private use before public promotion
- [ ] Add basic privacy, terms, source, and emergency-disclaimer pages

## Phase 4: Product Polish

Only after reliability and deployment are stable:

- [ ] Shared design system
- [ ] Typography and spacing refinement
- [ ] Consistent icons
- [ ] Improved charts
- [ ] Animations and transitions
- [ ] Performance optimization
- [ ] PWA installation and offline shell
- [ ] Dark mode if it materially improves usability

## Phase 5: Intelligence

Lighthouse may eventually convert trusted data into clearly explained guidance, such as:

- Road travel risk based on official closures and flooding reports
- Offshore caution summaries based on NWS advisories and forecast thresholds
- Beach-condition summaries using official hazards and weather
- Data-backed fishing intelligence after sufficient historical evidence exists

Every recommendation must show its source or methodology. Lighthouse should never conceal opinion behind a green dot.

## Core Principles

1. Guide decisions, not merely display data.
2. One glance should answer the user's immediate question.
3. Every page should have one primary purpose.
4. Functionality and reliability come before polish.
5. Use live authoritative data whenever practical.
6. Clearly identify every source.
7. Never invent safety-critical status information.
8. Build for residents first; visitors benefit naturally.
9. Static datasets are acceptable when authoritative and maintained.
10. Graceful failure is part of the product, not an afterthought.

## Immediate Next Priorities

1. Audit dashboard prototype values.
2. Verify each existing module and fix broken links or stale labels.
3. Improve cross-module navigation and shared status summaries.
4. Complete mobile/accessibility cleanup.
5. Prepare the application for public hosting.

## Motto

> **Let the light guide you.**
