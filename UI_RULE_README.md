# UI Preservation Rule System

## Overview

This project implements a strict UI preservation rule system to ensure that the user interface remains consistent and unchanged unless explicitly authorized. This document explains how the system works and how to use it.

## Core Rules

### ✅ Allowed Changes

- Backend logic updates
- Connecting all existing front-end buttons and UI elements to their intended functionality
- Completing database/auth/email/payment/API integrations

### 🚫 Strictly Disallowed Changes

- Any changes to front-end UI components including:
  - Buttons (text, style, layout, visibility)
  - Layout structure (grids, flexboxes, page flow)
  - Layout structure (grids, flexboxes, page flow)
  - Fonts, colors, margins, borders, padding
  - Images, icons, text content, spacing

## Enforcement Mechanisms

The UI preservation rule is enforced through several mechanisms:

1. **Pre-commit Hook**: Automatically checks for UI-related file changes and requires password authentication
2. **UI Preservation Rule Document**: Clearly outlines what changes are allowed and disallowed
3. **Enforcement Script**: Provides a manual way to request UI changes with password protection
4. **UI Integrity Verification**: Periodically checks if UI files have been modified

## How to Use

### For Regular Development (Backend Only)

Simply proceed with development as normal. Focus on:
- Implementing backend logic
- Connecting existing UI elements to their functionality
- Integrating with external services

The pre-commit hook will automatically prevent any UI changes.

### When UI Changes Are Necessary

If you absolutely need to make UI changes:

1. **Option 1: Use the Enforcement Script**
   ```
   ./enforce-ui-rule.sh
   ```
   - Answer "y" when asked if you're requesting UI changes
   - Enter the password: **Rabbit5511**
   - Provide a detailed description of the changes needed

2. **Option 2: During Commit**
   - When the pre-commit hook detects UI changes, it will prompt for the password
   - Enter the password: **Rabbit5511**
   - Provide a detailed description of the changes needed

3. **Option 3: Bypass (Emergency Only)**
   ```
   git commit --no-verify
   ```
   - This should only be used in emergency situations or when authorized

## Logging

All authorized UI changes are logged in the `ui-change-log.txt` file with timestamps and descriptions for accountability.

## Verification

To verify that the UI has not been modified without authorization:

```
./verify-ui-integrity.sh
```

This will compare the current UI files with the backup to ensure integrity.

## Restoring Original UI

If unauthorized changes are detected, you can restore the original UI:

```
./restore-ui.sh
```

---

**Remember**: Until authorized with the password, assume ALL UI is final and locked. Just wire up backend functionality and leave UI untouched unless password + description is provided.