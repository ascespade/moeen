# Open Workflow Monitor Dashboard
$dashboardPath = Join-Path $PSScriptRoot "workflow-monitor-dashboard.html"

if (Test-Path $dashboardPath) {
    Write-Host "🔄 Opening Workflow Monitor Dashboard..." -ForegroundColor Green
    Start-Process $dashboardPath
    Write-Host "✅ Dashboard opened in your browser!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Features:" -ForegroundColor Cyan
    Write-Host "  • Real-time workflow monitoring" -ForegroundColor White
    Write-Host "  • Progress tracking" -ForegroundColor White
    Write-Host "  • Activity logs" -ForegroundColor White
    Write-Host "  • Quick action buttons" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Direct links:" -ForegroundColor Cyan
    Write-Host "  • Trigger Workflow: https://github.com/ascespade/moeen/actions/workflows/cursor-continuous-fix.yml" -ForegroundColor White
    Write-Host "  • View All Runs: https://github.com/ascespade/moeen/actions" -ForegroundColor White
} else {
    Write-Host "❌ Dashboard file not found: $dashboardPath" -ForegroundColor Red
}

