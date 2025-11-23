#!/bin/bash
# Build script for AD Sync Agent using PyInstaller
# Creates standalone executable that doesn't require Python

echo "🔨 Building AD Sync Agent with PyInstaller..."

# Check if PyInstaller is installed
if ! python3 -c "import PyInstaller" 2>/dev/null; then
    echo "📦 Installing PyInstaller..."
    pip3 install pyinstaller
fi

# Build standalone executable
echo "📦 Building standalone executable..."
pyinstaller --onefile \
    --name ad-sync-agent \
    --hidden-import ldap3 \
    --hidden-import requests \
    --hidden-import dotenv \
    --add-data ".env.example:.env.example" \
    --console \
    ad_sync_agent.py

# Copy .env.example to dist directory
cp .env.example dist/.env.example 2>/dev/null || true
cp README.md dist/README.md 2>/dev/null || true

echo "✅ Build completed!"
echo "Executable location: dist/ad-sync-agent"
ls -lh dist/ad-sync-agent 2>/dev/null || echo "Build failed"

