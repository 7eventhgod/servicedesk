@echo off
REM Простой запуск AD Sync Agent для Windows
echo ========================================
echo AD Sync Agent - Запуск
echo ========================================
echo.

REM Проверяем наличие .env файла
if not exist .env (
    echo [ОШИБКА] Файл .env не найден!
    echo.
    echo Создайте файл .env:
    echo 1. Скопируйте .env.example в .env
    echo 2. Откройте .env в блокноте
    echo 3. Заполните ваши данные
    echo.
    pause
    exit /b 1
)

REM Проверяем наличие Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Запуск агента...
    echo.
    python ad_sync_agent.py
) else (
    echo [ОШИБКА] Python не найден!
    echo.
    echo Установите Python с https://www.python.org/downloads/
    echo Или запустите исполняемый файл (если доступен)
    echo.
    pause
    exit /b 1
)

pause

