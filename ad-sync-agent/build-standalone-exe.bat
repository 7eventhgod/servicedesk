@echo off
REM ========================================
REM Build Standalone .exe file
REM All dependencies included in .exe!
REM ========================================
title AD Sync Agent - Build Standalone .exe

chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

color 0B
cls
echo.
echo ==========================================
echo   AD Sync Agent - Build Standalone .exe
echo   ALL DEPENDENCIES INCLUDED IN .EXE!
echo ==========================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found!
    echo.
    echo Opening browser to download Python...
    timeout /t 2 >nul
    start https://www.python.org/downloads/
    echo.
    echo Please install Python and run this file again.
    pause
    exit /b 1
)

echo [OK] Python found
python --version
echo.

REM Install dependencies
echo Installing dependencies...
echo     (This may take 1-2 minutes...)
echo.

pip install --quiet --upgrade pip >nul 2>&1
pip install --quiet -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    echo.
    echo Try running as administrator.
    pause
    exit /b 1
)

pip install --quiet pyinstaller
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install PyInstaller
    pause
    exit /b 1
)

REM Verify PyInstaller is installed
python -m PyInstaller --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PyInstaller installed but not accessible
    echo Trying to fix PATH...
    set PATH=%PATH%;%LOCALAPPDATA%\Programs\Python\Python313\Scripts
    set PATH=%PATH%;%APPDATA%\Python\Python313\Scripts
    python -m PyInstaller --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] PyInstaller still not accessible
        echo Please restart command prompt and try again
        pause
        exit /b 1
    )
)
echo [OK] PyInstaller verified

echo [OK] Dependencies installed
echo.

REM Clean old build files
if exist build rmdir /s /q build >nul 2>&1
if exist dist rmdir /s /q dist >nul 2>&1
if exist AD-Sync-Agent.spec del /q AD-Sync-Agent.spec >nul 2>&1

REM Build standalone .exe with ALL dependencies
echo Building standalone .exe file...
echo     Including all dependencies in .exe...
echo     (This will take 2-5 minutes, please wait...)
echo.

REM Use python -m PyInstaller instead of pyinstaller to avoid PATH issues
python -m PyInstaller --onefile --name "AD-Sync-Agent" --windowed --add-data "ad_sync_agent.py;." --add-data ".env.example;." --hidden-import ldap3 --hidden-import ldap3.core --hidden-import ldap3.protocol --hidden-import requests --hidden-import urllib3 --hidden-import certifi --hidden-import dotenv --hidden-import python-dotenv --hidden-import tkinter --hidden-import tkinter.ttk --hidden-import tkinter.scrolledtext --hidden-import tkinter.messagebox --hidden-import tkinter.filedialog --hidden-import threading --hidden-import subprocess --hidden-import pathlib --hidden-import sys --hidden-import os --collect-all tkinter --collect-all ldap3 --collect-all requests --collect-all dotenv --noconsole --clean --noconfirm ad_sync_gui.py

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo   BUILD COMPLETED SUCCESSFULLY!
    echo ==========================================
    echo.
    echo File created: dist\AD-Sync-Agent.exe
    echo.
    echo IMPORTANT: This is a STANDALONE .exe file!
    echo     - ALL dependencies included in .exe
    echo     - Python NOT needed to run
    echo     - Just run the .exe file!
    echo.
    echo What to do next:
    echo     1. Copy dist\AD-Sync-Agent.exe to any folder
    echo     2. Copy ad_sync_agent.py to the same folder
    echo     3. Run AD-Sync-Agent.exe
    echo     4. Fill in settings in GUI and run!
    echo.
    echo File size:
    dir dist\AD-Sync-Agent.exe
    echo.
    echo You can now distribute AD-Sync-Agent.exe
    echo to administrators - they just run it!
    echo.
) else (
    echo.
    echo [ERROR] Build failed
    echo.
    echo Check:
    echo - Is Python installed?
    echo - Do you have enough disk space?
    echo - Try running as administrator
    echo.
    pause
    exit /b 1
)

echo Press any key to exit...
pause >nul
