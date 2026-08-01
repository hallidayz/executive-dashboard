@echo off
title Executive Dashboard Auto-Start Installer
echo ========================================================
echo Installing Executive Dashboard Auto-Start for Windows...
echo ========================================================

set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set TARGET_VBS=%~dp0autostart-dashboard.vbs
set SHORTCUT_VBS=%STARTUP_DIR%\ExecutiveDashboardAutostart.vbs

copy /Y "%TARGET_VBS%" "%SHORTCUT_VBS%"

echo.
echo [SUCCESS] Auto-start configured!
echo The Executive Dashboard will automatically launch whenever you boot or restart Windows.
echo Shortcut placed at: %SHORTCUT_VBS%
echo.
pause
