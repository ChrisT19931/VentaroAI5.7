#!/bin/bash

# UI Restoration Script
# This script restores the UI to its original state from the backup

echo "Restoring UI from backup..."

# Check if backup exists
if [ ! -d "./ui-backup" ]; then
  echo "Error: UI backup not found. Cannot restore UI."
  exit 1
fi

# Remove existing components and styles
echo "Removing existing components and styles..."
rm -rf ./src/components
rm -rf ./src/styles

# Restore components
echo "Restoring components..."
cp -r ./ui-backup/components ./src/

# Restore styles
echo "Restoring styles..."
cp -r ./ui-backup/styles ./src/

# Restore tailwind config
echo "Restoring tailwind configuration..."
cp ./ui-backup/tailwind.config.js ./

# Fix permissions
echo "Fixing file permissions..."
chmod -R 644 ./src/components/**/*.tsx ./src/components/**/**/*.tsx ./src/styles/**/*.css
chmod -R 755 ./src/components ./src/components/* ./src/components/*/* ./src/styles ./src/styles/*

echo "UI restoration complete!"
echo "The UI has been restored to its original state."