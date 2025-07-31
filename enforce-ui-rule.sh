#!/bin/bash

# UI Preservation Enforcement Script
# This script enforces the UI preservation rule with password protection

echo "🔒 UI Preservation Rule Enforcement 🔒"
echo "=================================="
echo ""
echo "✅ Allowed Changes:"
echo "- Backend logic updates"
echo "- Connecting existing front-end elements to functionality"
echo "- Completing database/auth/email/payment/API integrations"
echo ""
echo "🚫 Strictly Disallowed Changes:"
echo "- Any changes to front-end UI components"
echo "  (buttons, layout, fonts, colors, images, etc.)"
echo ""

# Check if UI changes are requested
read -p "Are you requesting to make UI changes? (y/n): " UI_CHANGE_REQUEST

if [[ $UI_CHANGE_REQUEST == "y" || $UI_CHANGE_REQUEST == "Y" ]]; then
  # Password protection
  read -s -p "Enter password for UI changes: " PASSWORD
  echo ""
  
  if [ "$PASSWORD" == "Rabbit5511" ]; then
    echo "Password accepted."
    echo ""
    read -p "You've requested a UI/front-end change. Please describe the exact changes required: " CHANGE_DESCRIPTION
    
    # Log the authorized change request
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$TIMESTAMP] Authorized UI change: $CHANGE_DESCRIPTION" >> ui-change-log.txt
    
    echo ""
    echo "✅ UI change request authorized and logged."
    echo "Please proceed with the specified changes only."
    echo "Remember to create a separate branch for these changes."
  else
    echo "❌ Incorrect password. UI changes are not authorized."
    echo "Please focus only on backend functionality without modifying the UI."
    exit 1
  fi
else
  echo "✅ No UI changes requested. You may proceed with backend development."
  echo "Remember: All UI is final and locked unless authorized with password."
fi