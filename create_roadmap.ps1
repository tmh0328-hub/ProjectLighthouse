# Project Lighthouse
# Creates a Roadmap folder and adds the roadmap document.

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RoadmapFolder = Join-Path $ProjectRoot "roadmap"
$RoadmapFile = Join-Path $RoadmapFolder "Project_Lighthouse_Roadmap.md"

$RoadmapContent = @'
# Project Lighthouse Roadmap

## Project
**Public name:** Hatteras Live  
**Internal codename:** Project Lighthouse

## Mission
Build a fast, mobile-friendly website that gives residents and visitors one place to check current conditions and useful information for Hatteras Island.

## Phase 0 — Foundation
- [x] Create the main project folder
- [x] Create the initial folder structure
- [x] Create setup automation
- [ ] Install Git
- [ ] Create a GitHub repository
- [ ] Make the first commit

## Phase 1 — Planning
- [ ] Finalize the mission statement
- [ ] Define the Version 1 feature list
- [ ] Define what is excluded from Version 1
- [ ] Identify trusted data sources
- [ ] Create initial wireframes
- [ ] Choose basic brand colors, fonts, and logo direction

**Deliverable:** A clear plan for exactly what Version 1 will contain.

## Phase 2 — Development Environment
- [ ] Install Visual Studio Code
- [ ] Install Node.js
- [ ] Install Git
- [ ] Create the website project
- [ ] Run the first local webpage
- [ ] Connect the project to GitHub

**Deliverable:** Hatteras Live runs locally on the computer.

## Phase 3 — Core Website
- [ ] Build the homepage
- [ ] Add Hatteras Island community selection
- [ ] Add responsive mobile navigation
- [ ] Create the interactive map
- [ ] Create the camera database
- [ ] Add camera pins and source links
- [ ] Add filters by camera type and community

**Deliverable:** A working camera map for Hatteras Island.

## Phase 4 — Live Information
- [ ] Add current weather
- [ ] Add wind conditions
- [ ] Add radar
- [ ] Add tide information
- [ ] Add ferry information
- [ ] Add NC-12 and road-condition links
- [ ] Add official alerts

**Deliverable:** A useful island conditions dashboard.

## Phase 5 — Testing and Polish
- [ ] Test on iPhone
- [ ] Test on Android
- [ ] Test on desktop
- [ ] Fix broken links and layout problems
- [ ] Improve speed and accessibility
- [ ] Add analytics
- [ ] Add a feedback form

**Deliverable:** A stable public beta.

## Phase 6 — Launch
- [ ] Purchase the domain
- [ ] Deploy the website
- [ ] Connect the domain
- [ ] Verify all data sources
- [ ] Create launch graphics
- [ ] Soft-launch to local testers
- [ ] Public launch

**Deliverable:** Hatteras Live v1.0.

## Future Ideas
These stay out of Version 1 unless promoted intentionally.

- Fishing reports
- ORV ramp status
- Beach access information
- Restaurants and events
- Business sponsorships
- User-submitted local reports
- Saved favorites
- Notifications
- AI camera summaries
- Native iOS and Android apps
'@

if (-not (Test-Path $RoadmapFolder)) {
    New-Item -ItemType Directory -Path $RoadmapFolder | Out-Null
    Write-Host "Created folder: roadmap" -ForegroundColor Cyan
}
else {
    Write-Host "Folder already exists: roadmap" -ForegroundColor Yellow
}

Set-Content -Path $RoadmapFile -Value $RoadmapContent -Encoding UTF8

Write-Host ""
Write-Host "Roadmap created successfully:" -ForegroundColor Green
Write-Host $RoadmapFile