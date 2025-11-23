@echo off
REM Простой установщик AD Sync Agent для Windows
echo ========================================
echo AD Sync Agent - Простая установка
echo ========================================
echo.

REM Проверяем наличие Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python найден
    python --version
    echo.
    echo Устанавливаю зависимости...
    pip install -r requirements.txt
    echo.
    echo ========================================
    echo Установка завершена!
    echo ========================================
    echo.
    echo Следующие шаги:
    echo 1. Откройте .env.example в блокноте
    echo 2. Заполните ваши данные
    echo 3. Сохраните как .env
    echo 4. Запустите: python ad_sync_agent.py
    echo.
) else (
    echo [X] Python не найден
    echo.
    echo Установите Python с https://www.python.org/downloads/
    echo Или используйте исполняемый файл (если доступен)
    echo.
)

REM Проверяем наличие .env файла
if not exist .env (
    echo Создаю файл .env из .env.example...
    copy .env.example .env >nul
    echo [OK] Файл .env создан
    echo.
    echo ВАЖНО: Откройте .env в блокноте и заполните ваши данные!
    echo.
)

pause

