@echo off
cls
color 0A
echo ============================================================
echo   ServiceDesk AD Sync Agent - Easy Setup Wizard
echo ============================================================
echo.
echo This wizard will help you set up Active Directory synchronization
echo.
pause

:STEP1
cls
echo ============================================================
echo   STEP 1/3: Active Directory Information
echo ============================================================
echo.
echo Please provide your Active Directory details:
echo.

set /p AD_HOST="AD Server (e.g., dc01.company.local or 192.168.1.10): "
set /p AD_PORT="AD Port (389 for LDAP, 636 for LDAPS) [389]: "
if "%AD_PORT%"=="" set AD_PORT=389

set /p AD_DOMAIN="Domain (e.g., company.local): "

REM Build AD_HOST with protocol
if "%AD_PORT%"=="636" (
    set FULL_AD_HOST=ldaps://%AD_HOST%:%AD_PORT%
    set AD_SSL=true
) else (
    set FULL_AD_HOST=ldap://%AD_HOST%:%AD_PORT%
    set AD_SSL=false
)

REM Build Base DN from domain
set BASE_DN=DC=%AD_DOMAIN:.=,DC=%

echo.
echo Detected Base DN: %BASE_DN%
echo.

set /p AD_USERNAME="Service Account Username (e.g., svc_servicedesk@%AD_DOMAIN%): "
set /p AD_PASSWORD="Service Account Password: "

:STEP2
cls
echo ============================================================
echo   STEP 2/3: ServiceDesk Platform Information
echo ============================================================
echo.

set /p PLATFORM_URL="ServiceDesk URL (e.g., http://localhost:3000): "
set /p TENANT_ID="Tenant ID (from ServiceDesk settings): "
set /p API_KEY="API Key (from ServiceDesk AD Sync settings): "

:STEP3
cls
echo ============================================================
echo   STEP 3/3: Review and Save
echo ============================================================
echo.
echo Please review your settings:
echo.
echo [Active Directory]
echo   Server:   %FULL_AD_HOST%
echo   Domain:   %AD_DOMAIN%
echo   Base DN:  %BASE_DN%
echo   Username: %AD_USERNAME%
echo   Password: ******** (hidden)
echo.
echo [ServiceDesk Platform]
echo   URL:       %PLATFORM_URL%
echo   Tenant ID: %TENANT_ID%
echo   API Key:   %API_KEY:~0,10%...
echo.

set /p CONFIRM="Is this correct? (Y/N): "
if /i not "%CONFIRM%"=="Y" goto STEP1

echo.
echo Creating .env file...
echo.

(
echo # Active Directory Configuration
echo AD_HOST=%FULL_AD_HOST%
echo AD_USERNAME=%AD_USERNAME%
echo AD_PASSWORD=%AD_PASSWORD%
echo AD_BASE_DN=%BASE_DN%
echo AD_USER_SEARCH_BASE=CN=Users,%BASE_DN%
echo AD_USER_SEARCH_FILTER=^(objectClass=user^)
echo AD_USE_SSL=%AD_SSL%
echo.
echo # Platform Configuration
echo PLATFORM_URL=%PLATFORM_URL%
echo TENANT_ID=%TENANT_ID%
echo API_KEY=%API_KEY%
echo.
echo # Sync Settings
echo SYNC_INTERVAL=3600
) > .env

echo ✓ Configuration saved to .env
echo.

:TEST
echo ============================================================
echo   Testing Connection...
echo ============================================================
echo.

echo Testing Active Directory connection...
python -c "from ad_sync_agent import ADSynchronizer; sync = ADSynchronizer(); print('✓ Config loaded'); sync.connect_ldap()" 2>nul

if errorlevel 1 (
    echo.
    echo ❌ Configuration test failed!
    echo.
    echo Please check your settings and try again.
    echo You can edit the .env file manually or run this wizard again.
    pause
    exit /b 1
)

echo.
echo ✓ Active Directory connection successful!
echo.

:RUN
echo ============================================================
echo   Start Synchronization?
echo ============================================================
echo.
set /p START="Do you want to start the sync agent now? (Y/N): "

if /i "%START%"=="Y" (
    echo.
    echo Starting AD Sync Agent...
    echo.
    echo Press Ctrl+C to stop at any time.
    echo.
    timeout /t 3 /nobreak >nul
    python ad_sync_agent.py
) else (
    echo.
    echo Setup complete!
    echo.
    echo To start the agent later, run:
    echo   python ad_sync_agent.py
    echo.
    echo Or double-click START.bat
    echo.
)

pause
