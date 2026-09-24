@echo off
echo ==================================================
echo ZERO TRUST ENTERPRISE - NATIVE STARTUP SCRIPT
echo ==================================================
echo.
echo This script will start both the Python Backend and the React Frontend.
echo Please ensure you have Python 3.10/3.11/3.12 and Node.js installed.
echo.

:: 1. Start Backend in a new window
echo [*] Starting Backend Service...
start "Zero Trust Backend" cmd /k "cd backend && echo Cleaning old database... && if exist enterprise.db del enterprise.db && echo Setting up Python environment... && python -m venv venv && call venv\Scripts\activate.bat && pip install -r requirements.txt && echo Starting Server... && uvicorn main:app --host 0.0.0.0 --port 8008 --reload"

:: 2. Start Frontend in a new window
echo [*] Starting Frontend Service...
start "Zero Trust Frontend" cmd /k "cd frontend && echo Installing NPM packages... && npm install && echo Starting React... && npm run dev"

echo.
echo ==================================================
echo SUCCESS!
echo - Backend is running on port 8000 in a separate window.
echo - Frontend is running on port 5173 in a separate window.
echo.
echo Open your browser and go to: http://localhost:5173
echo ==================================================
pause
