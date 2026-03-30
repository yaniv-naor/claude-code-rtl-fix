const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BACKUP_SUFFIX = '.bidi-backup';
const PATCH_MARKER = '/* HEBREW_BIDI_FIX */';

// Status bar item
let statusBarItem;

// JavaScript snippet injected at the end of index.js
const BIDI_JS_PATCH = `
/* HEBREW_BIDI_FIX */
;(function(){
  var SELECTORS = [
    '[class*="message_"]',
    '[class*="content_xGDvVg"]',
    '[class*="root_-a7MRw"]',
    '[class*="userMessage_"]',
    '[class*="messageInput_"]',
    '[class*="messageInputContainer_"]',
    '[class*="root_-a7MRw"] p',
    '[class*="root_-a7MRw"] span',
    '[class*="root_-a7MRw"] li',
    '[class*="content_xGDvVg"] p',
    '[class*="content_xGDvVg"] span'
  ].join(',');

  function applyBidi() {
    document.querySelectorAll(SELECTORS).forEach(function(el) {
      if (el.getAttribute('dir') !== 'auto') {
        el.setAttribute('dir', 'auto');
        el.style.direction = 'auto';
      }
    });
  }

  // Apply immediately
  applyBidi();

  // Watch for new messages
  var observer = new MutationObserver(applyBidi);
  observer.observe(document.body, { childList: true, subtree: true });
})();
/* END_HEBREW_BIDI_FIX */
`;

/**
 * Get VS Code extensions directory
 */
function getExtensionsDir() {
  const home = os.homedir();
  return path.join(home, '.vscode', 'extensions');
}

/**
 * Find all Claude Code webview index.js files
 */
function findJsFiles() {
  const extDir = getExtensionsDir();
  const results = [];

  try {
    if (!fs.existsSync(extDir)) {
      return results;
    }

    const dirs = fs.readdirSync(extDir);
    for (const dir of dirs) {
      if (dir.startsWith('anthropic.claude-code-')) {
        const indexPath = path.join(extDir, dir, 'webview', 'index.js');
        if (fs.existsSync(indexPath)) {
          results.push(indexPath);
        }
      }
    }

    return results.sort();
  } catch (error) {
    return [];
  }
}

/**
 * Check if a file is already patched
 */
function isPatched(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes(PATCH_MARKER);
  } catch (error) {
    return false;
  }
}

/**
 * Apply patch to a file
 */
function patchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Already patched
    if (content.includes(PATCH_MARKER)) {
      return { success: false, reason: 'already-patched' };
    }

    // Create backup
    const backupPath = filePath + BACKUP_SUFFIX;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // Append patch
    fs.appendFileSync(filePath, BIDI_JS_PATCH, 'utf-8');

    return { success: true };
  } catch (error) {
    return { success: false, reason: 'error', error: error.message };
  }
}

/**
 * Restore original file
 */
function restoreFile(filePath) {
  try {
    const backupPath = filePath + BACKUP_SUFFIX;

    // Restore from backup if exists
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      return { success: true };
    }

    // In-place restore by removing patch
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(PATCH_MARKER)) {
      const startIndex = content.indexOf(PATCH_MARKER);
      const cleaned = content.substring(0, startIndex).trimEnd();
      fs.writeFileSync(filePath, cleaned, 'utf-8');
      return { success: true };
    }

    return { success: false, reason: 'nothing-to-restore' };
  } catch (error) {
    return { success: false, reason: 'error', error: error.message };
  }
}

/**
 * Update status bar item based on current state
 */
function updateStatusBar() {
  if (!statusBarItem) return;

  const files = findJsFiles();
  if (files.length === 0) {
    statusBarItem.hide();
    return;
  }

  const patchedCount = files.filter(f => isPatched(f)).length;
  const isEnabled = patchedCount > 0;

  if (isEnabled) {
    statusBarItem.text = '$(check) Claude RTL';
    statusBarItem.tooltip = `Claude Code: Right-to-left text fix active`;
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
    statusBarItem.color = new vscode.ThemeColor('statusBarItem.prominentForeground');
  } else {
    statusBarItem.text = '$(circle-slash) Claude RTL';
    statusBarItem.tooltip = 'Claude Code: Right-to-left text fix inactive (Click to enable)';
    statusBarItem.backgroundColor = undefined;
    statusBarItem.color = undefined;
  }

  statusBarItem.show();
}

/**
 * Toggle BiDi fix (for status bar click)
 */
async function cmdToggle() {
  const files = findJsFiles();
  if (files.length === 0) {
    vscode.window.showErrorMessage('Claude Code not found.');
    return;
  }

  // Check current state BEFORE any changes
  const patchedCountBefore = files.filter(f => isPatched(f)).length;
  const wasEnabled = patchedCountBefore > 0;

  // Update UI immediately BEFORE calling cmdEnable/Disable
  if (wasEnabled) {
    // Update to disabled state
    statusBarItem.text = '$(circle-slash) Claude RTL';
    statusBarItem.tooltip = 'Claude Code: Right-to-left text fix inactive (Click to enable)';
    statusBarItem.backgroundColor = undefined;
    statusBarItem.color = undefined;

    await cmdDisable();
  } else {
    // Update to enabled state
    statusBarItem.text = '$(check) Claude RTL';
    statusBarItem.tooltip = 'Claude Code: Right-to-left text fix active';
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
    statusBarItem.color = new vscode.ThemeColor('statusBarItem.prominentForeground');

    await cmdEnable();
  }
}

/**
 * Enable BiDi fix command
 */
async function cmdEnable() {
  const files = findJsFiles();

  if (files.length === 0) {
    vscode.window.showErrorMessage('Claude Code not found. Please install it first.');
    return;
  }

  let patchedCount = 0;
  let alreadyPatchedCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const file of files) {
    const result = patchFile(file);
    if (result.success) {
      patchedCount++;
    } else if (result.reason === 'already-patched') {
      alreadyPatchedCount++;
    } else {
      errorCount++;
      errors.push(`${path.basename(path.dirname(path.dirname(file)))}: ${result.error}`);
    }
  }

  // Show results
  if (patchedCount > 0 || alreadyPatchedCount > 0) {
    if (patchedCount > 0) {
      const action = await vscode.window.showInformationMessage(
        `✅ Right-to-left text fix applied.\nReload VS Code to activate.`,
        'Reload Now',
        'Later'
      );

      if (action === 'Reload Now') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      }
    } else {
      vscode.window.showInformationMessage(`Already active.`);
    }
  }

  if (errorCount > 0) {
    vscode.window.showErrorMessage(
      `Failed to apply fix:\n${errors.join('\n')}`
    );
  }
}

/**
 * Disable BiDi fix command
 */
async function cmdDisable() {
  const files = findJsFiles();

  if (files.length === 0) {
    vscode.window.showErrorMessage('Claude Code not found.');
    return;
  }

  let restoredCount = 0;
  let nothingToRestoreCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const file of files) {
    const result = restoreFile(file);
    if (result.success) {
      restoredCount++;
    } else if (result.reason === 'nothing-to-restore') {
      nothingToRestoreCount++;
    } else {
      errorCount++;
      errors.push(`${path.basename(path.dirname(path.dirname(file)))}: ${result.error}`);
    }
  }

  // Show results
  if (restoredCount > 0 || nothingToRestoreCount > 0) {
    if (restoredCount > 0) {
      const action = await vscode.window.showInformationMessage(
        `✅ Right-to-left text fix removed.\nReload VS Code to complete.`,
        'Reload Now',
        'Later'
      );

      if (action === 'Reload Now') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      }
    } else {
      vscode.window.showInformationMessage(`Already inactive.`);
    }
  }

  if (errorCount > 0) {
    vscode.window.showErrorMessage(
      `Failed to remove fix:\n${errors.join('\n')}`
    );
  }
}

/**
 * Status check command
 */
async function cmdStatus() {
  const files = findJsFiles();

  if (files.length === 0) {
    vscode.window.showErrorMessage('Claude Code not found.');
    return;
  }

  const statusLines = [];
  let patchedCount = 0;

  for (const file of files) {
    const patched = isPatched(file);
    const dirName = path.basename(path.dirname(path.dirname(file)));
    const status = patched ? '✅ ENABLED' : '❌ DISABLED';
    statusLines.push(`${status}: ${dirName}`);
    if (patched) patchedCount++;
  }

  const summary = patchedCount > 0
    ? `Hebrew BiDi fix is ENABLED for ${patchedCount}/${files.length} installation(s)`
    : `Hebrew BiDi fix is DISABLED for all installations`;

  vscode.window.showInformationMessage(
    `${summary}\n\n${statusLines.join('\n')}`,
    { modal: false }
  );

  // Also log to output channel
  const channel = vscode.window.createOutputChannel('Claude Code Hebrew BiDi');
  channel.appendLine(summary);
  channel.appendLine('');
  statusLines.forEach(line => channel.appendLine(line));
  channel.appendLine('');
  channel.appendLine('Files:');
  files.forEach(file => channel.appendLine(`  ${file}`));
  channel.show();
}

/**
 * Extension activation
 */
function activate(context) {
  console.log('Claude Code Hebrew BiDi extension is now active');

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'claude-code-hebrew-bidi.toggle';
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('claude-code-hebrew-bidi.enable', cmdEnable)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('claude-code-hebrew-bidi.disable', cmdDisable)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('claude-code-hebrew-bidi.status', cmdStatus)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('claude-code-hebrew-bidi.toggle', cmdToggle)
  );

  // Update status bar on activation (reflects actual file state)
  updateStatusBar();

  // Auto-enable if configured
  const config = vscode.workspace.getConfiguration('claude-code-hebrew-bidi');
  if (config.get('autoEnable')) {
    cmdEnable();
  }
}

/**
 * Extension deactivation
 */
function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};
