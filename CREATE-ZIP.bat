@echo off
cd /d "%~dp0"
set ZIPNAME=Zing_Zest_Website_Team_Package.zip

echo Creating team share package...

powershell -NoProfile -Command ^
  "$files = @('index.html','styles.css','app.js','data.js','content.js','zing_zest_logo.png','START.bat','OPEN.bat','README.md');" ^
  "$existing = $files | Where-Object { Test-Path $_ };" ^
  "Compress-Archive -Path $existing -DestinationPath '%ZIPNAME%' -Force;" ^
  "Write-Host 'Created:' (Resolve-Path '%ZIPNAME%').Path"

echo.
echo Done! Send %ZIPNAME% to your teammates.
pause
