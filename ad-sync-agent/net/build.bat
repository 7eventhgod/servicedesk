@echo off
REM Build .NET Framework application
title Build AD-Sync-Agent .NET

echo.
echo ========================================
echo   Building AD-Sync-Agent .NET
echo ========================================
echo.

REM Check for MSBuild
where msbuild >nul 2>&1
if errorlevel 1 (
    echo ERROR: MSBuild not found!
    echo.
    echo Please install Visual Studio or Build Tools for Visual Studio
    echo Download from: https://visualstudio.microsoft.com/downloads/
    echo.
    pause
    exit /b 1
)

echo [OK] MSBuild found
echo.

REM Build Release version
echo Building Release version...
echo.

cd ADSyncAgent
msbuild ADSyncAgent.csproj /p:Configuration=Release /p:Platform=AnyCPU /t:Clean,Build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Build completed!
echo ========================================
echo.
echo File created: bin\Release\AD-Sync-Agent.exe
echo.
echo You can now:
echo 1. Copy bin\Release\AD-Sync-Agent.exe anywhere
echo 2. Copy ad_sync_agent.py to the same folder
echo 3. Run AD-Sync-Agent.exe
echo.
dir bin\Release\AD-Sync-Agent.exe
echo.
pause

