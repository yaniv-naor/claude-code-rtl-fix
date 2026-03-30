# Quick Start Guide 🚀

## 60 Second Setup

### Step 1: Install the Extension (Choose one)

**Option A: From VSIX file**
1. Open VS Code
2. Press `Ctrl+Shift+P`
3. Type "install from vsix"
4. Select the `.vsix` file

**Option B: From Marketplace** (when published)
1. Open Extensions (`Ctrl+Shift+X`)
2. Search "Claude Code RTL Fix"
3. Click Install

### Step 2: Enable the Fix

**Super Quick (One Click!):**
1. Look at **bottom-right corner** of VS Code
2. Click: `⊘ Claude RTL`
3. Click "Reload Now"

**Or via Command Palette:**
1. Press `Ctrl+Shift+P`
2. Type "enable rtl"
3. Select "Enable RTL Text Fix"
4. Click "Reload Now"

### Step 3: Test It!

1. Open Claude Code
2. Type: `שלום! איך אתה?`
3. ✅ Text should display correctly from right to left

## Done! 🎉

Your RTL text in Claude Code should now work perfectly.

---

## Common Commands

| Command | Shortcut | Purpose |
|---------|----------|---------|
| **Toggle** | **Click status bar button** | **Quick on/off** |
| Enable RTL Text Fix | `Ctrl+Shift+P` → "enable" | Turn on the fix |
| Disable RTL Text Fix | `Ctrl+Shift+P` → "disable" | Turn off the fix |
| Check Hebrew BiDi Status | `Ctrl+Shift+P` → "status" | See if enabled |

## Auto-Enable on Startup

Want it to enable automatically every time?

1. Open Settings (`Ctrl+,`)
2. Search "rtl fix"
3. Check "Auto Enable"

Or add to `settings.json`:
```json
{
  "claude-code-hebrew-bidi.autoEnable": true
}
```

## Troubleshooting in 3 Steps

1. ❌ **Doesn't work?** → Reload VS Code (`Ctrl+Shift+P` → "reload window")
2. ❌ **Still broken?** → Check status (should say "ENABLED")
3. ❌ **Still issues?** → Close/reopen Claude Code panel

## What It Does

- ✅ Fixes RTL text direction
- ✅ Works with mixed Hebrew-English
- ✅ Doesn't break English
- ✅ Safe & reversible
- ✅ No data collection

## Need Help?

- 📖 Full docs: [README.md](README.md)
- 🔧 Detailed setup: [INSTALLATION.md](INSTALLATION.md)
- 🐛 Report bugs: GitHub Issues
- 💬 Questions: GitHub Discussions

---

**Made with ❤️ for the RTL language developer community**
