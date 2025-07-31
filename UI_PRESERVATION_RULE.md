# CRITICAL UI PRESERVATION RULE

## HARD RULE: DO NOT MODIFY THE UI

This document establishes a critical project rule:

**THE CURRENT UI MUST BE PRESERVED AT ALL TIMES**

Under no circumstances should the user interface be modified, changed, or updated without explicit and direct authorization from the project owner.

## ✅ Allowed Changes

- Backend logic updates
- Connecting all existing front-end buttons and UI elements to their intended functionality
- Completing database/auth/email/payment/API integrations

## 🚫 Strictly Disallowed Changes

- Any changes to front-end UI components including:
  - Buttons (text, style, layout, visibility)
  - Layout structure (grids, flexboxes, page flow)
  - Fonts, colors, margins, borders, padding
  - Images, icons, text content, spacing

## 🔒 Rule Enforcement

- Before ANY front-end or UI change is made, require the password: **Rabbit5511**
- After password is entered, prompt:
  "You've requested a UI/front-end change. Please describe the exact changes required."

## Guidelines for Developers

1. **No UI Changes**: Do not modify any UI components, styles, layouts, or visual elements
2. **No Framework Changes**: Do not update, replace, or modify the UI framework or libraries
3. **CSS Preservation**: Do not modify CSS/styling files that affect the appearance
4. **Component Preservation**: Do not restructure, refactor, or modify UI components

## Process for Authorized Changes

If UI changes are absolutely necessary:

1. Provide the required password: **Rabbit5511**
2. Document the specific changes that are authorized
3. Create a separate branch for the changes
4. Submit for review before merging

## Rationale

The current UI represents the approved and finalized design for this project. Maintaining consistency in the user interface is critical for user experience and brand identity.

---

*This rule has been established as a HARD RULE and must be followed without exception.*
*Until authorized with the password, assume ALL UI is final and locked.*
*Just wire up backend functionality and leave UI untouched unless password + description is provided.*