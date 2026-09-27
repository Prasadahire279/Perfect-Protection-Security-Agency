@echo off
title Perfect Protection Security Agency - Web Platform
echo =========================================================================
echo   PERFECT PROTECTION SECURITY AGENCY
echo   Security ^& Housekeeping Staff Management System (Final Year Project)
echo =========================================================================
echo.

cd /d "%~dp0"

echo [1/2] Checking local web server environment...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [2/2] Launching local HTTP server via Python on http://localhost:8000 ...
    echo Opening application in your default web browser...
    start http://localhost:8000/index.html
    echo.
    echo Server is running! Keep this window open while testing.
    echo Press Ctrl+C in this window anytime to stop the server.
    echo.
    python -m http.server 8000
) else (
    echo [2/2] Python not found in PATH. Opening directly in default browser...
    start index.html
    echo Opened index.html successfully!
    pause
)
