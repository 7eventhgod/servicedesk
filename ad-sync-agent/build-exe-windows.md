# Как собрать .exe файл на Windows

Если у вас есть Windows машина с Python, вы можете легко собрать готовый .exe файл:

## Способ 1: PyInstaller (рекомендуется)

1. **Установите Python 3.8+** с https://www.python.org/downloads/
   - При установке отметьте "Add Python to PATH"

2. **Откройте командную строку** в папке с агентом

3. **Установите зависимости:**
   ```cmd
   pip install -r requirements.txt
   pip install pyinstaller
   ```

4. **Соберите .exe:**
   ```cmd
   pyinstaller --onefile --name ad-sync-agent --console ad_sync_agent.py
   ```

5. **Готово!** Файл будет в папке `dist\ad-sync-agent.exe`

## Способ 2: Go (для опытных пользователей)

Если установлен Go:

1. Установите Go с https://go.dev/dl/

2. Откройте командную строку в папке с агентом

3. Выполните:
   ```cmd
   go mod download
   go build -ldflags="-s -w" -o ad-sync-agent.exe ad_sync_agent.go
   ```

4. Готово! Файл `ad-sync-agent.exe` создан

