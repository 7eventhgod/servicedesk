@echo off
echo ========================================
echo AD Sync Agent - Easy Setup
echo ========================================
echo.
echo This will help you connect your Active Directory to ServiceDesk
echo.
echo STEP 1: Get your configuration info ready
echo.
echo You'll need:
echo   1. AD Server address (e.g., dc01.company.local or 192.168.1.10)
echo   2. Domain name (e.g., company.local)
echo   3. Service account username (e.g., svc_servicedesk@company.local)
echo   4. Service account password
echo   5. Your ServiceDesk URL (e.g., https://servicedesk.yourcompany.com)
echo   6. Tenant ID from ServiceDesk settings
echo   7. API Key from ServiceDesk AD Sync settings
echo.
pause
echo.
echo STEP 2: Opening GUI Configuration...
echo.
python ad_sync_gui.py
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start GUI.
    echo.
    echo Trying command-line version instead...
    echo.
    echo Please create a .env file with your settings.
    echo Copy .env.example to .env and fill in your details.
    echo.
    echo Then run: python ad_sync_agent.py
    pause
)
