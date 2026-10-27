Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting White Mist Local Server" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot
node server.js
