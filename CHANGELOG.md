# Change Log

All notable changes to the "Claude Code RTL Fix" extension will be documented in this file.

## [1.0.0] - 2026-03-30

### Added
- Initial release
- **Status Bar Toggle** - One-click enable/disable button in status bar
- Enable RTL Text Fix command
- Disable RTL Text Fix command
- Check RTL Text Fix Status command
- Toggle RTL Text Fix command (for status bar)
- Automatic backup of original files
- Support for multiple Claude Code installations
- Auto-enable configuration option
- Comprehensive README with usage instructions
- Custom icon
- MIT License

### Features
- **Quick toggle button** in bottom-right status bar with visual feedback
- Fixes RTL text rendering in Claude Code webview for Hebrew, Arabic, Farsi, Urdu
- Uses `dir="auto"` for intelligent text direction detection
- Supports mixed RTL-LTR text
- Does not affect LTR-only text
- Dynamic detection of new messages via MutationObserver
- Zero external dependencies
- Idempotent patching (safe to run multiple times)
- Full reversibility with restore functionality
- Visual status indicator: ✓ (enabled) or ⊘ (disabled)

## [1.0.4] - 2026-04-30

### Improved
- Added heading support (h1-h6) for correct RTL/LTR direction detection
- Headings now use `dir="auto"` for intelligent direction detection per heading

## [1.0.5] - 2026-05-14

### Fixed
- Extension no longer auto-enables itself after VSCode restart when user intentionally disabled it
- User preference (enabled/disabled) is now persisted via `globalState` across sessions
- Fixed race condition where `globalState` could be written after window reload, causing stale state on next activation
- If Claude Code updates and replaces its files, the patch is silently re-applied only if the user had previously enabled the fix

## [1.0.7] - 2026-06-17

### Improved
- Replaced `dir="auto"` with active RTL detection logic — if any RTL character (Hebrew, Arabic, Farsi, etc.) is present in the text, the entire block is aligned right
- Pure LTR text correctly remains left-aligned
- Mixed text (RTL + LTR) now always aligns to the right as expected
- Added broader selector coverage for Claude Code UI elements (dialogs, options, labels, descriptions, chips)
- Code blocks (`pre`, `code`) are now always forced LTR regardless of content
- Lists (`ol`, `ul`) receive RTL direction when any child item contains RTL text
- Input field direction updates dynamically as user types
- Added support for emojis and symbols followed by RTL text

### Fixed
- Text starting with numbers, symbols, or English followed by Hebrew was incorrectly left-aligned
- Numbered lists had markers on the left side even when content was in Hebrew/Arabic
- Claude Code question/option dialogs were not receiving correct text direction

## [Unreleased]

### Planned
- Configuration UI improvements
