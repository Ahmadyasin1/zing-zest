@echo off

title Zing ^& Zest — AI Marketing Intelligence Platform

cd /d "%~dp0"

rem Redirect if user ran from Project/ subfolder (common mistake)
if not exist "package.json" (
  if exist "..\package.json" (
    cd /d "%~dp0.."
    echo  Switched to project root: %CD%
    echo.
  ) else (
    echo  ERROR: package.json not found in this folder.
    echo  Open START.bat from: Assignment 4 ^(1^)
    pause
    exit /b 1
  )
)

rem ── Fix corrupted .next cache (webpack ENOENT / module not found) ──
if exist ".next" (
  if not exist ".next\routes-manifest.json" (
    echo  Corrupted .next cache — clearing...
    rmdir /s /q ".next" 2>nul
  )
)

rem Clear partial webpack pack files (causes __webpack_modules__ errors on Windows)
if exist ".next\cache\webpack" (
  dir /s /b ".next\cache\webpack\*.pack.gz_" >nul 2>&1
  if not errorlevel 1 (
    echo  Stale webpack cache detected — clearing...
    rmdir /s /q ".next\cache" 2>nul
  )
)

rem Free ports 3000-3010 if stale Next.js processes are holding them
for /l %%p in (3000,1,3010) do (
  for /f "tokens=5" %%a in ('netstat -aon ^| find ":%%p " ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)

echo.
echo  ================================================
echo   Zing ^& Zest Street Bites
echo   AI Marketing Intelligence Platform (Next.js)
echo  ================================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js is not installed.
    echo  Install from https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo  Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo  ERROR: npm install failed.
        pause
        exit /b 1
    )
)

if not exist ".env.local" (
    if exist ".env.example" (
        echo  Creating .env.local from .env.example...
        copy /Y ".env.example" ".env.local" >nul
        echo  Add HF_TOKEN to .env.local for live AI (optional — offline mode works)
        echo.
    )
)

set PORT=3000
:tryport
netstat -an | find ":%PORT% " | find "LISTENING" >nul 2>&1
if not errorlevel 1 (
    set /a PORT+=1
    if %PORT% leq 3010 goto tryport
)

echo  Starting Next.js on port %PORT%...
echo  Keep this window OPEN while using the website.
echo.
echo  Open: http://localhost:%PORT%
echo.
echo  Press Ctrl+C to stop.
echo  ================================================
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:%PORT%"

set PORT=%PORT%
call npx next dev -p %PORT%

pause
