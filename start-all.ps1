# ============================================
# Unified API Platform - Start All Services
# ============================================
# This script starts all services in background terminals

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Starting All Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get the root directory (where this script is located)
$rootDir = $PSScriptRoot

# Define services with their start commands
$services = @(
    @{Name = "Also"; Path = "$rootDir\Also\backend"; Port = 3001 },
    @{Name = "TDSynnex"; Path = "$rootDir\TDSynnex\backend"; Port = 3002 },
    @{Name = "Trend"; Path = "$rootDir\Trend\backend"; Port = 3003 },
    @{Name = "Proxy"; Path = "$rootDir\Proxy\backend"; Port = 4000 },
    @{Name = "WebApp-Backend"; Path = "$rootDir\WebAPP\backend"; Port = 5000 },
    @{Name = "WebApp-Frontend"; Path = "$rootDir\WebAPP\frontend"; Port = 3000 }
)

# Check if any jobs are already running
$existingJobs = Get-Job | Where-Object { $_.Name -in $services.Name }
if ($existingJobs) {
    Write-Host "WARNING: Some services are already running:" -ForegroundColor Yellow
    $existingJobs | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Yellow }
    Write-Host ""
    $response = Read-Host "Do you want to stop them and restart? (y/n)"
    if ($response -eq 'y') {
        Write-Host "Stopping existing services..." -ForegroundColor Yellow
        $existingJobs | Stop-Job
        $existingJobs | Remove-Job
        Write-Host "Stopped existing services" -ForegroundColor Green
    }
    else {
        Write-Host "Aborted. Stop existing services first with .\stop-all.ps1" -ForegroundColor Red
        exit 1
    }
}

# Start each service as a background job
Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

foreach ($service in $services) {
    Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Cyan
    
    $job = Start-Job -ScriptBlock {
        param($path)
        Set-Location $path
        npm run dev
    } -ArgumentList $service.Path -Name $service.Name
    
    if ($job) {
        Write-Host "   Started $($service.Name)" -ForegroundColor Green
    }
    else {
        Write-Host "   Failed to start $($service.Name)" -ForegroundColor Red
    }
    
    # Small delay between starts
    Start-Sleep -Milliseconds 500
}

# Wait a moment for services to initialize
Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Show status
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Services Status" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Get-Job | Format-Table -Property Id, Name, State, HasMoreData -AutoSize

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "All Services Started!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open your browser: http://localhost:3000" -ForegroundColor Green
Write-Host "Login: admin / admin123" -ForegroundColor Green
Write-Host ""
Write-Host "Available services:" -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "   - $($service.Name): http://localhost:$($service.Port)" -ForegroundColor White
}
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "   Get-Job                    - View all jobs" -ForegroundColor White
Write-Host "   Receive-Job -Name 'Also'   - View logs for a specific service" -ForegroundColor White
Write-Host "   .\stop-all.ps1             - Stop all services" -ForegroundColor White
Write-Host "   .\status.ps1               - Check services status" -ForegroundColor White
Write-Host ""
