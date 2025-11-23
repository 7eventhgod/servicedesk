@echo off
REM Build script for AD Sync Agent (Windows)
REM Creates standalone executables for Windows, Linux, and macOS

echo Building AD Sync Agent executables...

REM Install dependencies if go.mod doesn't exist
if not exist "go.mod" (
    echo Initializing Go module...
    go mod init ad-sync-agent
)

REM Download dependencies
echo Downloading dependencies...
go mod download
go mod tidy

REM Build for Windows (amd64)
echo Building for Windows (amd64)...
set GOOS=windows
set GOARCH=amd64
go build -ldflags="-s -w" -o ad-sync-agent-windows-amd64.exe ad_sync_agent.go

REM Build for Linux (amd64)
echo Building for Linux (amd64)...
set GOOS=linux
set GOARCH=amd64
go build -ldflags="-s -w" -o ad-sync-agent-linux-amd64 ad_sync_agent.go

REM Build for macOS (amd64)
echo Building for macOS (amd64)...
set GOOS=darwin
set GOARCH=amd64
go build -ldflags="-s -w" -o ad-sync-agent-darwin-amd64 ad_sync_agent.go

REM Build for macOS (arm64)
echo Building for macOS (arm64 - Apple Silicon)...
set GOOS=darwin
set GOARCH=arm64
go build -ldflags="-s -w" -o ad-sync-agent-darwin-arm64 ad_sync_agent.go

echo Build completed!
echo.
echo Generated files:
dir ad-sync-agent-* /B 2>nul || echo No executables found

