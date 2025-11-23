# Создание Standalone .exe файла (как ProvisioningApp.exe от ZOHO)

Чтобы создать полностью standalone .exe файл (как ProvisioningApp.exe), нужно:

## Способ 1: PyInstaller с включением всех файлов

1. **Создайте spec файл** для точной настройки:
```bash
pyinstaller --name "AD-Sync-Agent" ad_sync_gui.py
```

2. **Отредактируйте** `AD-Sync-Agent.spec`:
```python
a = Analysis(
    ['ad_sync_gui.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('ad_sync_agent.py', '.'),
        ('.env.example', '.'),
    ],
    hiddenimports=[
        'ldap3',
        'requests',
        'dotenv',
        'tkinter',
        'threading',
        'subprocess',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)
```

3. **Соберите**:
```bash
pyinstaller AD-Sync-Agent.spec
```

## Способ 2: Auto-py-to-exe (GUI для PyInstaller)

1. Установите:
```bash
pip install auto-py-to-exe
```

2. Запустите GUI:
```bash
auto-py-to-exe
```

3. В GUI выберите:
   - Script: `ad_sync_gui.py`
   - Onefile: ✅
   - Console Window: Window Based
   - Icon: (опционально)
   - Additional Files: `ad_sync_agent.py`, `.env.example`

## Способ 3: cx_Freeze (альтернатива)

1. Установите:
```bash
pip install cx_Freeze
```

2. Создайте `setup.py`:
```python
from cx_Freeze import setup, Executable

setup(
    name="AD-Sync-Agent",
    version="1.0",
    description="AD Sync Agent",
    executables=[Executable("ad_sync_gui.py", 
                           base="Win32GUI" if sys.platform == "win32" else None)],
    options={
        "build_exe": {
            "include_files": ["ad_sync_agent.py", ".env.example"],
            "packages": ["tkinter", "ldap3", "requests", "dotenv"],
        }
    }
)
```

3. Соберите:
```bash
python setup.py build
```

## Рекомендация

Используйте **PyInstaller** - он самый надёжный и создаёт полностью standalone .exe файл.

