# ============================================
# Unified API Platform - Stop All Services
# ============================================
# This script stops all running background services

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Stopping All Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get all running jobs
$jobs = Get-Job

if ($jobs.Count -eq 0) {
    Write-Host "No services are currently running" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($jobs.Count) running service(s):" -ForegroundColor Yellow
$jobs | ForEach-Object {
    Write-Host "   - $($_.Name) (State: $($_.State))" -ForegroundColor White
}

Write-Host ""
Write-Host "Stopping services..." -ForegroundColor Yellow

# Stop all jobs
$jobs | Stop-Job
Write-Host "All services stopped" -ForegroundColor Green

# Remove all jobs
$jobs | Remove-Job
Write-Host "All jobs removed" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "All Services Stopped!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
