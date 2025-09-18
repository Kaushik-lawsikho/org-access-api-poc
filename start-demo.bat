@echo off
echo Starting Organization Access API Demo...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0\frontend && npm start"

echo.
echo Demo is starting up...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo.
echo Note: Frontend will run on port 3001 to avoid conflict with backend
echo.
echo Press any key to exit...
pause > nul
