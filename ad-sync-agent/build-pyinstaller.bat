@echo off
REM Build script for AD Sync Agent using PyInstaller (Windows)
REM Creates standalone executable that doesn't require Python

echo Building AD Sync Agent with PyInstaller...

REM Check if PyInstaller is installed
python -c "import PyInstaller" 2>nul
if errorlevel 1 (
    echo Installing PyInstaller...
    pip install pyinstaller
)

REM Build standalone executable
echo Building standalone executable...
pyinstaller --onefile ^
    --name ad-sync-agent ^
    --hidden-import ldap3 ^
    --hidden-import requests ^
    --hidden-import dotenv ^
    --add-data ".env.example;.env.example" ^
    --console ^
    ad_sync_agent.py

REM Copy .env.example to dist directory
copy .env.example dist\.env.example 2>nul
copy README.md dist\README.md 2>nul

echo Build completed!
echo Executable location: dist\ad-sync-agent.exe
dir dist\ad-sync-agent.exe 2>nul || echo Build failed

