#!/bin/bash

# Script to copy alpha build file to Home Assistant config
# Run this script after building the alpha version

SOURCE_FILE="yet-another-media-player-alpha.js"
TARGET_DIR="/Volumes/config/www"
TARGET_FILE="$TARGET_DIR/yet-another-media-player-alpha.js"

echo "📁 Copying alpha file to Home Assistant config..."

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "❌ Source file $SOURCE_FILE not found!"
    echo "💡 Make sure you've built the alpha version first:"
    echo "   BRANCH=alpha npm run build"
    exit 1
fi

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Target directory $TARGET_DIR not found!"
    echo "💡 Make sure your Home Assistant config directory is mounted correctly"
    exit 1
fi

# Copy the file
cp "$SOURCE_FILE" "$TARGET_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Successfully copied $SOURCE_FILE to $TARGET_FILE"
    echo "🔄 Home Assistant should automatically reload the file"
    echo "🧪 You can now test the alpha version in Home Assistant"
else
    echo "❌ Failed to copy file to $TARGET_FILE"
    exit 1
fi
