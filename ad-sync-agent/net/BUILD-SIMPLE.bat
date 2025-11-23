@echo off
REM Simple build script for .NET application
title Build AD-Sync-Agent .NET

echo.
echo ========================================
echo   Building AD-Sync-Agent .NET
echo ========================================
echo.

REM Check for .NET Framework
where msbuild >nul 2>&1
if errorlevel 1 (
    echo ERROR: MSBuild not found!
    echo.
    echo Please install one of:
    echo 1. Visual Studio (Community/Professional/Enterprise)
    echo 2. Build Tools for Visual Studio
    echo.
    echo Download from: https://visualstudio.microsoft.com/downloads/
    echo.
    echo OR try opening ADSyncAgent.sln in Visual Studio directly.
    pause
    exit /b 1
)

echo [OK] MSBuild found
echo.

REM Build Release version
echo Building Release version...
echo.

cd ADSyncAgent
msbuild ADSyncAgent.csproj /p:Configuration=Release /p:Platform=AnyCPU /t:Clean,Build /v:minimal

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo.
    echo Try:
    echo 1. Open ADSyncAgent.sln in Visual Studio
    echo 2. Right-click on project - Restore NuGet Packages
    echo 3. Build - Build Solution
    echo.
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   SUCCESS! Build completed!
echo ========================================
echo.
echo File created: ADSyncAgent\bin\Release\AD-Sync-Agent.exe
echo.
echo You can now:
echo 1. Copy ADSyncAgent\bin\Release\AD-Sync-Agent.exe anywhere
echo 2. Copy ad_sync_agent.py (from archive root) to the same folder
echo 3. Run AD-Sync-Agent.exe
echo.
dir ADSyncAgent\bin\Release\AD-Sync-Agent.exe
echo.
pause

