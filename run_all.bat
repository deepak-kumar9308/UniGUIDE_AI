@echo off
echo ===================================================
echo     Starting UniGuide AI Full System Stack
echo ===================================================
echo [1/3] Starting Python ML AI Service on Port 8000...
start "UniGuide AI ML Service" cmd /k "cd /d %~dp0ai-service && python server.py"

echo [2/3] Starting Java Spring Boot Backend on Port 8080...
start "UniGuide AI Backend Service" cmd /k "cd /d %~dp0backend && java -jar target/backend-0.0.1-SNAPSHOT.jar"

echo [3/3] Starting Frontend Web Server on Port 3000...
start "UniGuide AI Frontend Web Server" cmd /k "cd /d %~dp0frontend && python -m http.server 3000"

echo.
echo ===================================================
echo   UniGuide AI Services Launch Initiated!
echo   -----------------------------------------------
echo   Frontend Web App:  http://localhost:3000/
echo   Backend REST API:  http://localhost:8080/api/colleges
echo   Python AI Service: http://localhost:8000/
echo ===================================================
ping -n 5 127.0.0.1 > nul 2>&1
start http://localhost:3000/
