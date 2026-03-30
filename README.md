# Claude Code RTL Fix

**Adds full right-to-left (RTL) text support to Claude Code in VS Code**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

Claude Code currently enforces a left-to-right (ltr) text direction across its webview, which prevents proper rendering of right-to-left (RTL) languages such as Hebrew, Arabic, Farsi, and Urdu.

This extension resolves the issue by enabling dynamic text direction detection using the standard `dir="auto"` attribute, allowing the browser to render text correctly based on its content.

## Problem

The Claude Code VS Code extension applies `direction: ltr` globally to its UI. As a result:

- RTL languages are rendered incorrectly
- Text may appear reversed or visually broken
- Mixed-direction (bilingual) content is not displayed properly

## Solution

This extension patches the Claude Code webview to delegate text direction handling to the browser.

By applying `dir="auto"` to relevant elements, the browser automatically determines whether content should be rendered as LTR or RTL based on the first strong directional character.

### Key Benefits
- ✅ Ensures correct rendering of RTL languages (Hebrew, Arabic, Farsi, Urdu)
- ✅ Preserves expected LTR behavior for Latin-based languages
- ✅ Correctly handles mixed-direction (bilingual) text
- ✅ Applies dynamically to newly rendered content
- ✅ Safe and fully reversible (includes automatic backups)

## Features

### Status Bar Integration
Toggle the fix directly from the VS Code status bar

### Command Palette Support
Enable or disable the fix via standard VS Code commands

### Automatic Reload Prompt
Prompts to reload VS Code after applying changes

### Installation Detection
Detects and patches all installed instances of Claude Code

### Automatic Backups
Preserves original files before modification

### Startup Automation (Optional)
Automatically enables the fix on VS Code launch

## Installation

### Manual Installation (VSIX)

1. Download the `.vsix` file
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
4. Run: `Extensions: Install from VSIX`
5. Select the downloaded file

### Marketplace

*Coming soon.*
Search for "Claude Code RTL Fix" in the Extensions view.

## Usage

### Status Bar Toggle (Recommended)

Use the status bar button in the bottom-right corner of VS Code:

- **Enabled:** `✓ Claude RTL` (green)
- **Disabled:** `⊘ Claude RTL` (gray)

Click to toggle the fix. You will be prompted to reload VS Code.

### Command Palette

#### Enable
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `Enable RTL Text Fix`
3. Confirm reload

#### Disable
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `Disable RTL Text Fix`
3. Confirm reload

#### Check Status
1. Open Command Palette
2. Run: `Check RTL Text Fix Status`

Displays which Claude Code installations are currently patched.

## Configuration

Enable automatic activation on startup:

**VS Code Settings** → Search: `Claude Code RTL`

Or via `settings.json`:

```json
{
  "claude-code-hebrew-bidi.autoEnable": true
}
```

## How It Works

The extension modifies Claude Code's webview at runtime by applying a minimal, targeted patch:

1. Locates installed Claude Code extensions (`~/.vscode/extensions/`)
2. Identifies the relevant webview bundle (e.g., `index.js`)
3. Creates a backup of the original file (`.bidi-backup`)
4. Injects a lightweight JavaScript snippet that:
   - Uses a `MutationObserver` to monitor DOM updates
   - Applies `dir="auto"` to message and content elements
   - Ensures correct rendering for both static and dynamic content

### Why `dir="auto"`?

`dir="auto"` is a standard HTML attribute that:

- Detects the first strong directional character in a string
- Applies RTL for languages like Hebrew and Arabic
- Applies LTR for Latin-based languages
- Handles mixed-language content correctly without manual intervention

## Technical Details

**Targeted DOM selectors:**

```javascript
[class*="message_"]
[class*="content_xGDvVg"]
[class*="root_-a7MRw"]
[class*="userMessage_"]
[class*="messageInput_"]
[class*="messageInputContainer_"]
```

(including nested elements such as `p`, `span`, `li`)

**Patch marker:**
`/* HEBREW_BIDI_FIX */`

**Backup suffix:**
`.bidi-backup`

## Safety

- ✅ Original files are backed up before modification
- ✅ The patch process is idempotent and safe to run multiple times
- ✅ Fully reversible via the disable command
- ✅ No external dependencies
- ✅ Minimal footprint (~30 lines of vanilla JavaScript)

## Compatibility

- **VS Code:** 1.80.0 or later
- **Claude Code:** All versions (auto-detected)
- **Platforms:** Windows, macOS, Linux

## Troubleshooting

### The fix does not take effect

1. Reload VS Code (`Reload Window`)
2. Verify status using the "Check RTL Status" command
3. Restart the Claude Code panel

### Multiple installations detected

All installations are patched automatically. Use the status command to inspect each one.

### Claude Code not found

Ensure the Claude Code extension is installed before enabling this fix.

## Contributing

Contributions are welcome.

- Report issues
- Suggest improvements
- Submit pull requests

**GitHub repository:**
https://github.com/yaniv-naor/claude-code-rtl-fix

## License

MIT License. See the [LICENSE](LICENSE) file for details.

## Credits

Developed by **Yaniv Naor**

## Related

- [Claude Code Extension](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code)
- [BiDi (Bidirectional Text) Web Standard](https://www.w3.org/International/articles/inline-bidi-markup/)

---

**If this extension helped you, please ⭐ star it on GitHub and share it with others!**
