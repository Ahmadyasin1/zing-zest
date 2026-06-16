@echo off
setlocal EnableDelayedExpansion

title Zing ^& Zest — Production Deployment

cd /d "%~dp0"

echo.
echo  ========================================================
echo   Zing ^& Zest Street Bites
echo   PRODUCTION DEPLOYMENT (Next.js)
echo   Main Developer: Ahmad Yasin
echo  ========================================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js 18+ is required.
    echo  Download: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%a in ('node -p "process.versions.node.split('.')[0]"') do set NODE_MAJOR=%%a
if !NODE_MAJOR! LSS 18 (
    echo  ERROR: Node.js 18 or newer required. You have:
    node -v
    pause
    exit /b 1
)

if not exist ".env.local" (
    if exist ".env.example" (
        echo  Creating .env.local from .env.example ...
        copy /Y ".env.example" ".env.local" >nul
        echo  IMPORTANT: Edit .env.local and set HF_TOKEN for live AI features.
        echo.
    ) else (
        echo  WARNING: No .env.local found. AI features will use offline fallbacks.
        echo.
    )
)

echo  [1/4] Installing dependencies...
call npm ci
if %errorlevel% neq 0 (
    echo  npm ci failed. Trying npm install...
    call npm install
    if !errorlevel! neq 0 (
        echo  ERROR: Could not install dependencies.
        pause
        exit /b 1
    )
)

echo.
echo  [2/4] Running production build (may take 2-5 minutes)...
echo  NOTE: Stop dev server (Ctrl+C in START.bat window) before building.
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo  Build failed. Try running FIX.bat then DEPLOY.bat again.
    pause
    exit /b 1
)

echo.
echo  [3/4] Build successful.
echo.
echo  Deployment options:
echo    A) Start production server now (this window)
echo    B) Build only — use Docker or upload to Vercel
echo.
set /p DEPLOY_MODE="Choose A or B [A]: "
if /i "!DEPLOY_MODE!"=="B" goto build_only

echo.
echo  [4/4] Starting production server...
echo  Open: http://localhost:3000
echo  Press Ctrl+C to stop.
echo.

set NODE_ENV=production
set PORT=3000
call npm run start
goto end

:build_only
echo.
echo  Build complete. Next steps:
echo    - Local prod:  npm run start
echo    - Docker:      docker compose up -d --build
echo    - Vercel:      npx vercel --prod
echo    - Zip package: CREATE-DEPLOY-ZIP.bat
echo.

:end
pause
endlocal
