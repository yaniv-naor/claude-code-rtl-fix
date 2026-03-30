# Installation & Testing Guide

## For Users

### Method 1: Install from VSIX (Recommended for testing)

1. Download the `.vsix` file
2. Open VS Code
3. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
4. Type "Extensions: Install from VSIX"
5. Select the downloaded `.vsix` file
6. Restart VS Code if prompted

### Method 2: Install from Marketplace (When published)

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Search for "Claude Code Hebrew BiDi Fix"
4. Click "Install"

## For Developers

### Setting Up Development Environment

1. **Prerequisites:**
   - VS Code installed
   - Node.js 16+ installed (optional, for testing)
   - Claude Code extension installed

2. **Clone or download this repository:**
   ```bash
   git clone https://github.com/yaniv-naor/claude-code-rtl-fix.git
   cd claude-code-rtl-fix
   ```

3. **Open in VS Code:**
   ```bash
   code .
   ```

4. **Test the extension:**
   - Press `F5` to open a new VS Code window with the extension loaded
   - Or use "Run" → "Start Debugging" from the menu

### Testing the Extension

1. **In the Extension Development Host window:**
   - Press `Ctrl+Shift+P`
   - Type "Enable Hebrew BiDi Fix"
   - Press Enter
   - Click "Reload Now"

2. **Open Claude Code:**
   - Open the Claude Code panel
   - Type a Hebrew message: "שלום, איך אתה?"
   - Verify that the text displays correctly (right-to-left)

3. **Test mixed text:**
   - Type: "אני משתמש ב-Claude Code"
   - Verify that Hebrew is RTL and English is LTR

4. **Check status:**
   - Press `Ctrl+Shift+P`
   - Type "Check Hebrew BiDi Status"
   - Verify the status shows "ENABLED"

5. **Test disable:**
   - Press `Ctrl+Shift+P`
   - Type "Disable Hebrew BiDi Fix"
   - Click "Reload Now"
   - Verify Hebrew text reverts to broken state (if you want to confirm it's working)

### Building the VSIX Package

1. **Install vsce (VS Code Extension Manager):**
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Package the extension:**
   ```bash
   vsce package
   ```

3. **This creates a `.vsix` file:**
   ```
   claude-code-rtl-fix-1.0.0.vsix
   ```

### Publishing to Marketplace

1. **Create a publisher account:**
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with Microsoft account
   - Create a publisher

2. **Update package.json:**
   - Change `"publisher": "your-publisher-name"` to your actual publisher name

3. **Get a Personal Access Token (PAT):**
   - Go to https://dev.azure.com/
   - Create a PAT with "Marketplace (Manage)" scope

4. **Publish:**
   ```bash
   vsce publish
   ```

## Troubleshooting

### Extension doesn't work after enabling

1. Make sure you clicked "Reload Now" or manually reloaded VS Code
2. Close and reopen the Claude Code panel
3. Check the status to verify the fix is enabled
4. Check VS Code Developer Tools console for errors (Help → Toggle Developer Tools)

### Can't find Claude Code installation

1. Make sure Claude Code is installed
2. Check that it's in the standard location: `~/.vscode/extensions/anthropic.claude-code-*`
3. On Windows, this is: `C:\Users\YourName\.vscode\extensions\`

### Changes don't persist after Claude Code update

When Claude Code updates, it creates a new directory with a new version number. You'll need to:
1. Run "Enable Hebrew BiDi Fix" again
2. The extension will automatically patch the new version

### Want to contribute?

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## File Structure

```
claude-code-rtl-fix/
├── .vscode/
│   └── launch.json          # Debug configuration
├── extension.js             # Main extension code
├── package.json             # Extension manifest
├── README.md                # User documentation
├── INSTALLATION.md          # This file
├── CHANGELOG.md             # Version history
├── LICENSE                  # MIT License
├── .vscodeignore            # Files to exclude from package
├── .gitignore               # Git ignore rules
└── test.js                  # Test suite (optional)
```

## System Requirements

- **VS Code:** 1.80.0 or higher
- **Claude Code:** Any version
- **Operating System:** Windows, macOS, or Linux
- **Node.js:** Not required for end users (only for development/testing)

## Security Note

This extension modifies files in your VS Code extensions directory. It:
- Creates backups before making changes (`.bidi-backup` files)
- Only modifies Claude Code's webview JavaScript
- Uses standard Node.js file operations
- Does not connect to the internet
- Does not collect or transmit any data
- Is open source and auditable

## Support

- **Issues:** https://github.com/yaniv-naor/claude-code-rtl-fix/issues
- **Questions:** Open a GitHub Discussion
- **Email:** yaniv3109@gmail.com
