# UniGuide AI - Single Command Application Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "    Starting UniGuide AI Full System Stack" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot

Write-Host "[1/3] Starting Python ML AI Service on Port 8000..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$rootDir\ai-service`" && python server.py" -WindowStyle Normal

Write-Host "[2/3] Starting Java Spring Boot Backend on Port 8080..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$rootDir\backend`" && java -jar target/backend-0.0.1-SNAPSHOT.jar" -WindowStyle Normal

Write-Host "[3/3] Starting Frontend Web Server on Port 3000..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$rootDir\frontend`" && python -m http.server 3000" -WindowStyle Normal

Start-Sleep -Seconds 4
Write-Host "`n===================================================" -ForegroundColor Green
Write-Host "  UniGuide AI Services Launch Initiated!" -ForegroundColor Green
Write-Host "  Frontend Web App:  http://localhost:3000/" -ForegroundColor Green
Write-Host "  Backend REST API:  http://localhost:8080/api/colleges" -ForegroundColor Green
Write-Host "  Python AI Service: http://localhost:8000/" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Start-Process "http://localhost:3000/"
