@echo off
REM Simple build script for AD-Sync-Agent.exe
title AD Sync Agent - Build .exe

echo.
echo ========================================
echo   Building AD-Sync-Agent.exe
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo.
    echo Please install Python from:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [OK] Python found
python --version
echo.

REM Install dependencies
echo Installing dependencies...
python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet
python -m pip install pyinstaller --quiet

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed
echo.

REM Clean
if exist build rmdir /s /q build >nul 2>&1
if exist dist rmdir /s /q dist >nul 2>&1
if exist *.spec del /q *.spec >nul 2>&1

REM Build
echo Building .exe file...
echo This may take a few minutes...
echo.

python -m PyInstaller --onefile --name AD-Sync-Agent --windowed --add-data "ad_sync_agent.py;." --add-data ".env.example;." --hidden-import ldap3 --hidden-import requests --hidden-import dotenv --hidden-import tkinter --collect-all tkinter --collect-all ldap3 --collect-all requests --noconsole --clean --noconfirm ad_sync_gui.py

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Build completed!
echo ========================================
echo.
echo File created: dist\AD-Sync-Agent.exe
echo.
echo You can now:
echo 1. Copy dist\AD-Sync-Agent.exe anywhere
echo 2. Copy ad_sync_agent.py to the same folder
echo 3. Run AD-Sync-Agent.exe
echo.
dir dist\AD-Sync-Agent.exe
echo.
pause

