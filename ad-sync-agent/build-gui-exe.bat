@echo off
chcp 65001 >nul
REM ========================================
REM Сборка GUI приложения в .exe файл
REM ========================================
title AD Sync Agent - Сборка GUI .exe

color 0B
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║   AD Sync Agent - Сборка GUI приложения (.exe)          ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Проверяем Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌] Python не найден!
    echo.
    echo Установите Python с https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [✅] Python найден
python --version
echo.

REM Устанавливаем зависимости
echo 📦 Устанавливаю зависимости...
pip install -q -r requirements.txt
pip install -q pyinstaller

if %errorlevel% neq 0 (
    echo [❌] Ошибка установки зависимостей
    pause
    exit /b 1
)

echo [✅] Зависимости установлены
echo.

REM Собираем GUI приложение
echo 🔨 Собираю GUI приложение...
pyinstaller --onefile ^
    --name "AD-Sync-Agent" ^
    --windowed ^
    --add-data "ad_sync_agent.py;." ^
    --add-data ".env.example;." ^
    --hidden-import ldap3 ^
    --hidden-import requests ^
    --hidden-import dotenv ^
    --hidden-import tkinter ^
    --hidden-import tkinter.ttk ^
    --hidden-import tkinter.scrolledtext ^
    --hidden-import tkinter.messagebox ^
    --hidden-import tkinter.filedialog ^
    --hidden-import threading ^
    --hidden-import subprocess ^
    --collect-all tkinter ^
    --clean ^
    --noconfirm ^
    ad_sync_gui.py

if %errorlevel% equ 0 (
    echo.
    echo ╔═══════════════════════════════════════════════════════╗
    echo ║   ✅ СБОРКА ЗАВЕРШЕНА!                                  ║
    echo ╚═══════════════════════════════════════════════════════╝
    echo.
    echo 📁 Файл создан: dist\AD-Sync-Agent.exe
    echo.
    echo 💡 Теперь вы можете:
    echo    1. Скопировать AD-Sync-Agent.exe в любую папку
    echo    2. Скопировать туда же ad_sync_agent.py
    echo    3. Запустить AD-Sync-Agent.exe
    echo    4. Заполнить настройки в GUI и запустить агента!
    echo.
) else (
    echo [❌] Ошибка сборки
)

pause

