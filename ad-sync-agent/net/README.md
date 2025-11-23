# AD Sync Agent - .NET Framework Version

Native Windows application built with .NET Framework 4.7.2.

## Requirements

- Windows 7 or later
- .NET Framework 4.7.2 or later
- Python (for running the sync agent script)

## Building

### Using Visual Studio:
1. Open `ADSyncAgent.sln` in Visual Studio
2. Build -> Build Solution (or press F6)
3. Executable will be in `ADSyncAgent\bin\Release\AD-Sync-Agent.exe`

### Using MSBuild (Command Line):
```cmd
build.bat
```

The executable will be in `ADSyncAgent\bin\Release\AD-Sync-Agent.exe`

## Usage

1. Copy `AD-Sync-Agent.exe` to any folder
2. Copy `ad_sync_agent.py` to the same folder
3. Run `AD-Sync-Agent.exe`
4. Fill in the settings in the GUI
5. Click "Save settings"
6. Click "Start agent"

## Advantages over Python version

- ✅ Native Windows application
- ✅ No Python dependencies required for GUI
- ✅ Faster startup
- ✅ Better Windows integration
- ✅ Professional look

## Note

The .NET application provides the GUI interface, but the actual sync agent (`ad_sync_agent.py`) still requires Python to run. The .NET app launches the Python script as a subprocess.

