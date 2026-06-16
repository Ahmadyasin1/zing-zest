@echo off
title Zing ^& Zest — Fix Dev Errors

cd /d "%~dp0"

rem Redirect if user ran from Project/ subfolder (common mistake)
if not exist "package.json" (
  if exist "..\package.json" (
    cd /d "%~dp0.."
    echo  Switched to project root: %CD%
  ) else (
    echo  ERROR: package.json not found. Run FIX.bat from the Assignment 4 folder.
    pause
    exit /b 1
  )
)

echo.
echo  Stopping Next.js servers on ports 3000-3010...
for /l %%p in (3000,1,3010) do (
  for /f "tokens=5" %%a in ('netstat -aon ^| find ":%%p " ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)

echo  Clearing Next.js build cache (.next)...
if exist ".next" rmdir /s /q ".next"

echo  Clearing stale webpack partial cache files...
if exist ".next\cache" rmdir /s /q ".next\cache" 2>nul

echo.
echo  Done. Run START.bat to launch the site again.
echo.
pause
