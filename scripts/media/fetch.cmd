@echo off
cd /d "%~dp0"
for /f "usebackq tokens=1,2" %%A in ("urls.txt") do (
  if not exist "%%A" curl.exe -sSL -A "KarnakFieldGuide/0.1 (research)" -o "%%A" "%%B"
)
echo done> fetch-done.txt
