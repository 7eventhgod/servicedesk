#!/bin/bash
# Build script for AD Sync Agent
# Creates standalone executables for Windows, Linux, and macOS

echo "🔨 Building AD Sync Agent executables..."

# Install dependencies if go.mod doesn't exist
if [ ! -f "go.mod" ]; then
    echo "📦 Initializing Go module..."
    go mod init ad-sync-agent
fi

# Download dependencies
echo "📥 Downloading dependencies..."
go mod download
go mod tidy

# Build for Linux (amd64)
echo "🐧 Building for Linux (amd64)..."
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ad-sync-agent-linux-amd64 ad_sync_agent.go

# Build for Windows (amd64)
echo "🪟 Building for Windows (amd64)..."
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o ad-sync-agent-windows-amd64.exe ad_sync_agent.go

# Build for macOS (amd64)
echo "🍎 Building for macOS (amd64)..."
GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o ad-sync-agent-darwin-amd64 ad_sync_agent.go

# Build for macOS (arm64)
echo "🍎 Building for macOS (arm64 - Apple Silicon)..."
GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o ad-sync-agent-darwin-arm64 ad_sync_agent.go

echo "✅ Build completed!"
echo ""
echo "Generated files:"
ls -lh ad-sync-agent-* 2>/dev/null || echo "No executables found"

