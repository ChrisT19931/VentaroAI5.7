# UI Maintenance Guide

## Overview

This project has a **HARD RULE** to preserve the UI exactly as it is. This guide explains how to work with this requirement while still maintaining and enhancing the application.

## Why Preserve the UI?

The current UI represents the approved and finalized design for this project. Maintaining consistency in the user interface is critical for user experience and brand identity.

## Tools for UI Preservation

The following tools have been implemented to help enforce and maintain UI consistency:

### 1. Git Pre-commit Hook

A pre-commit hook has been installed that prevents committing changes to UI-related files. This includes:
- CSS/SCSS files
- JSX/TSX component files

If you attempt to commit changes to these files, the hook will block the commit with a warning message.

### 2. UI Backup

A backup of the original UI has been created in the `ui-backup/` directory. This includes:
- Component files
- Style files
- Tailwind configuration

### 3. Restoration Script

If the UI is accidentally modified, you can restore it to its original state using:

```bash
npm run restore-ui
```

or directly:

```bash
./restore-ui.sh
```

### 4. Verification Script

You can verify that the UI hasn't been modified from its original state using:

```bash
npm run verify-ui
```

or directly:

```bash
./verify-ui-integrity.sh
```

## How to Work with the UI Preservation Rule

### Adding New Features

When adding new features:

1. **DO NOT** modify existing UI components or styles
2. Create new components that follow the existing design patterns
3. Use existing style classes and avoid creating new global styles
4. If you need to override the pre-commit hook for authorized changes:
   ```bash
   git commit --no-verify
   ```

### Fixing Bugs

When fixing bugs:

1. Focus on fixing functionality without changing appearance
2. If a UI bug must be fixed, get explicit authorization first
3. Document the specific UI changes that are authorized

### Authorized UI Changes

If UI changes are absolutely necessary and have been authorized:

1. Document the authorization in the commit message
2. Update the UI backup after the changes are approved
3. Run the following to update the backup:
   ```bash
   mkdir -p ./ui-backup && cp -r ./src/components ./ui-backup/ && cp -r ./src/styles ./ui-backup/ && cp ./tailwind.config.js ./ui-backup/
   ```

## Troubleshooting

### "Cannot commit due to UI changes"

If you receive this error and the changes are authorized:

1. Use `git commit --no-verify` to bypass the hook
2. Update the UI backup as described above

### "UI integrity violation detected"

If the verification script fails:

1. Review the listed modified files
2. If changes are unauthorized, run `npm run restore-ui`
3. If changes are authorized, update the UI backup

## Questions

If you have questions about the UI preservation policy, please contact the project owner for clarification.