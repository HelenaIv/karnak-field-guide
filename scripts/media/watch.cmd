@echo off
title Karnak image fetcher - leave open
cd /d "%~dp0"
:loop
for /f "usebackq tokens=1,2" %%A in ("urls.txt") do (
  if not exist "%%A" (
    echo fetching %%A
    curl.exe -sSL -A "KarnakFieldGuide/0.1 (research)" -o "%%A.part" "%%B" && move /y "%%A.part" "%%A" >nul
  )
)
echo %date% %time%> watch-alive.txt
timeout /t 5 /nobreak >nul
goto loop
