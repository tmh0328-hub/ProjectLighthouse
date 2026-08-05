# =====================================================
# Project Lighthouse
# Hatteras Live - Initial Project Setup
# Version: 0.1
# =====================================================

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Initializing Project Lighthouse..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Root Folders
$folders = @(
    "docs",
    "docs\Wireframes",
    "docs\Research",
    "docs\Meeting Notes",

    "assets",
    "assets\branding",
    "assets\icons",
    "assets\mockups",
    "assets\screenshots",

    "website",

    "database",
    "database\schema",
    "database\seed",

    "scripts",

    "tools",

    "testing",

    ".github",
    ".github\workflows"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "Created: $folder"
    }
}

# Documentation Files
$files = @(
    "README.md",

    "docs\Mission.md",
    "docs\Roadmap.md",
    "docs\Features.md",
    "docs\Ideas.md",
    "docs\Brand.md",
    "docs\Database.md",
    "docs\API.md",
    "docs\Changelog.md",

    "database\schema\README.md",
    "database\seed\README.md",

    "website\README.md",

    ".gitignore"
)

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "Created: $file"
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host " Project Lighthouse Initialized Successfully!"
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""