@echo off
cd /d "%~dp0"

set ZIPNAME=Zing_Zest_Deploy_Ready.zip

echo.
echo  Creating deployment-ready ZIP package...
echo  (excludes node_modules, .next, secrets)
echo.

powershell -NoProfile -Command ^
  "$root = Get-Location;" ^
  "$dest = Join-Path $root '%ZIPNAME%';" ^
  "if (Test-Path $dest) { Remove-Item $dest -Force };" ^
  "$exclude = @('node_modules','.next','out','.git','%ZIPNAME%','Zing_Zest_Website_Team_Package.zip');" ^
  "$items = Get-ChildItem -Force | Where-Object { $exclude -notcontains $_.Name -and $_.Name -ne '.env.local' -and $_.Name -ne '.env' };" ^
  "Compress-Archive -Path $items.FullName -DestinationPath $dest -Force;" ^
  "Write-Host ''; Write-Host 'Created:' (Resolve-Path $dest).Path; Write-Host 'Size:' ([math]::Round((Get-Item $dest).Length / 1MB, 2)) 'MB'"

echo.
echo  Upload this ZIP to Vercel, Railway, Render, or any VPS.
echo  On the server: unzip, copy .env.example to .env.local, run DEPLOY.bat or deploy.sh
echo.
pause
