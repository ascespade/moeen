# Restart Cursor to Apply Settings

Write-Host "Restarting Cursor..." -ForegroundColor Cyan
Write-Host ""

# Close all Cursor processes
$processes = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "Closing Cursor processes..." -ForegroundColor Yellow
    $processes | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "Closed." -ForegroundColor Green
} else {
    Write-Host "Cursor is not running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Opening Cursor..." -ForegroundColor Cyan

# Start Cursor
Start-Process "Cursor"

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "  Cursor Restarted!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now open a new terminal in Cursor." -ForegroundColor Yellow
Write-Host "It should use Git Bash by default." -ForegroundColor Yellow
Write-Host ""

