# ============================================
# Unified API Platform - Services Status
# ============================================
# This script checks the status of all services

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Services Status Check" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check background jobs
Write-Host "Background Jobs:" -ForegroundColor Yellow
$jobs = Get-Job
if ($jobs.Count -eq 0) {
    Write-Host "   No background jobs running" -ForegroundColor Gray
} else {
    $jobs | Format-Table -Property Id, Name, State, HasMoreData -AutoSize
}

Write-Host ""
Write-Host "Listening Ports:" -ForegroundColor Yellow
try {
    $ports = netstat -ano | Select-String "LISTENING" | Select-String ":3000|:3001|:3002|:3003|:4000|:5000"
    if ($ports) {
        $ports | ForEach-Object {
            $line = $_.Line
            if ($line -match ":3000") { Write-Host "   ✅ Port 3000 (Frontend)" -ForegroundColor Green }
            elseif ($line -match ":3001") { Write-Host "   ✅ Port 3001 (Also)" -ForegroundColor Green }
            elseif ($line -match ":3002") { Write-Host "   ✅ Port 3002 (TDSynnex)" -ForegroundColor Green }
            elseif ($line -match ":3003") { Write-Host "   ✅ Port 3003 (Trend)" -ForegroundColor Green }
            elseif ($line -match ":4000") { Write-Host "   ✅ Port 4000 (Proxy)" -ForegroundColor Green }
            elseif ($line -match ":5000") { Write-Host "   ✅ Port 5000 (WebAPP Backend)" -ForegroundColor Green }
        } | Select-Object -Unique
    } else {
        Write-Host "   No services listening on expected ports" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Unable to check ports" -ForegroundColor Red
}

Write-Host ""
Write-Host "Health Checks:" -ForegroundColor Yellow
$healthChecks = @(
    @{Name="Also Backend"; Url="http://localhost:3001/health"},
    @{Name="TDSynnex Backend"; Url="http://localhost:3002/health"},
    @{Name="Trend Backend"; Url="http://localhost:3003/health"},
    @{Name="Proxy Backend"; Url="http://localhost:4000/health"},
    @{Name="WebAPP Backend"; Url="http://localhost:5000/health"},
    @{Name="WebAPP Frontend"; Url="http://localhost:3000"}
)

foreach ($check in $healthChecks) {
    try {
        $response = Invoke-WebRequest -Uri $check.Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ $($check.Name)" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $($check.Name) - Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ $($check.Name) - Not responding" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "   .\start-all.ps1              - Start all services" -ForegroundColor White
Write-Host "   .\stop-all.ps1               - Stop all services" -ForegroundColor White
Write-Host "   Receive-Job -Name 'Also'     - View logs for a service" -ForegroundColor White
Write-Host "   Get-Job                      - List all jobs" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
