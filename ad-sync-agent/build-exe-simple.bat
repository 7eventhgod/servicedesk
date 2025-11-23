@echo off
REM Простая сборка .exe файла для Windows
echo ========================================
echo Сборка AD Sync Agent .exe файла
echo ========================================
echo.

REM Проверяем Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Python не найден!
    echo Установите Python с https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python найден
python --version
echo.

echo Устанавливаю зависимости...
pip install -q -r requirements.txt
pip install -q pyinstaller

if %errorlevel% neq 0 (
    echo [ОШИБКА] Не удалось установить зависимости
    pause
    exit /b 1
)

echo.
echo Собираю .exe файл...
pyinstaller --onefile --name ad-sync-agent --console --clean --noconfirm ad_sync_agent.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ СБОРКА ЗАВЕРШЕНА!
    echo ========================================
    echo.
    echo Файл создан: dist\ad-sync-agent.exe
    echo.
    echo Теперь вы можете:
    echo 1. Скопировать dist\ad-sync-agent.exe в любую папку
    echo 2. Создать .env файл из .env.example
    echo 3. Запустить ad-sync-agent.exe
    echo.
) else (
    echo [ОШИБКА] Сборка не удалась
)

pause

