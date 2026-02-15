# ============================================
# Unified API Platform - Setup Script
# ============================================
# This script automates the setup process for all services

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Unified API Platform - Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if npm is installed
function Test-NpmInstalled {
    try {
        $null = npm --version
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (-not (Test-NpmInstalled)) {
    Write-Host " npm is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host " npm is installed" -ForegroundColor Green

# Define services
$services = @(
    @{Name = "Also Backend"; Path = "Also\backend" },
    @{Name = "TDSynnex Backend"; Path = "TDSynnex\backend" },
    @{Name = "Trend Backend"; Path = "Trend\backend" },
    @{Name = "Proxy Backend"; Path = "Proxy\backend" },
    @{Name = "WebAPP Backend"; Path = "WebAPP\backend" },
    @{Name = "WebAPP Frontend"; Path = "WebAPP\frontend" }
)

# Install dependencies
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Installing dependencies..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

foreach ($service in $services) {
    Write-Host ""
    Write-Host "Installing $($service.Name)..." -ForegroundColor Yellow
    Push-Location $service.Path
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   $($service.Name) dependencies installed" -ForegroundColor Green
    }
    else {
        Write-Host "   Failed to install $($service.Name) dependencies" -ForegroundColor Red
    }
    Pop-Location
}

# Setup environment files
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Setting up environment files..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$envSetup = @(
    @{Source = "Also\backend\.env.example"; Dest = "Also\backend\.env" },
    @{Source = "TDSynnex\backend\.env.example"; Dest = "TDSynnex\backend\.env" },
    @{Source = "Trend\backend\.env.example"; Dest = "Trend\backend\.env" },
    @{Source = "Proxy\backend\.env.example"; Dest = "Proxy\backend\.env" },
    @{Source = "WebAPP\backend\.env.example"; Dest = "WebAPP\backend\.env" },
    @{Source = "WebAPP\frontend\.env.example"; Dest = "WebAPP\frontend\.env.local" }
)

foreach ($env in $envSetup) {
    if (Test-Path $env.Dest) {
        Write-Host "  $($env.Dest) already exists, skipping..." -ForegroundColor Yellow
    }
    else {
        Copy-Item $env.Source $env.Dest
        Write-Host " Created $($env.Dest)" -ForegroundColor Green
    }
}

# Summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review and update .env files with your API credentials (optional for demo)" -ForegroundColor White
Write-Host "2. Run .\start-all.ps1 to start all services" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "4. Login with username: admin, password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see SETUP.md" -ForegroundColor Cyan
