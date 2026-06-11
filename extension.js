const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BACKUP_SUFFIX = '.bidi-backup';
const PATCH_MARKER = '/* RTL_BIDI_FIX */';

// Status bar item
let statusBarItem;

// Extension context (for globalState access)
let extensionContext;

// JavaScript snippet injected at the end of index.js
const BIDI_JS_PATCH = `
/* RTL_BIDI_FIX */
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
    '[class*="content_xGDvVg"] span',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ].join(',');

  function applyBidi() {
    document.querySelectorAll(SELECTORS).forEach(function(el) {
      if (el.getAttribute('dir') !== 'auto') {
        el.setAttribute('dir', 'auto');
        el.style.direction = 'auto';
      }
    });
  }

  applyBidi();
  new MutationObserver(applyBidi).observe(document.body, { childList: true, subtree: true });
})();
/* END_RTL_BIDI_FIX */
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
 * Update status bar item based on globalState (source of truth for user intent).
 * Falls back to file state only when globalState is not yet set.
 */
function updateStatusBar() {
  if (!statusBarItem) return;

  const files = findJsFiles();
  if (files.length === 0) {
    statusBarItem.hide();
    return;
  }

  const userWantsEnabled = extensionContext
    ? extensionContext.globalState.get('userWantsEnabled')
    : undefined;

  // globalState is the source of truth; only fall back to file state on first install
  const isEnabled = userWantsEnabled !== undefined
    ? userWantsEnabled
    : files.some(f => isPatched(f));

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
 * Toggle BiDi fix (for status bar click).
 * Determines state from globalState (the source of truth), not file state.
 */
async function cmdToggle() {
  const files = findJsFiles();
  if (files.length === 0) {
    vscode.window.showErrorMessage('Claude Code not found.');
    return;
  }

  const userWantsEnabled = extensionContext
    ? extensionContext.globalState.get('userWantsEnabled')
    : null;

  // Use globalState as source of truth; fall back to file state
  const isCurrentlyEnabled = userWantsEnabled !== null && userWantsEnabled !== undefined
    ? userWantsEnabled
    : files.some(f => isPatched(f));

  if (isCurrentlyEnabled) {
    await cmdDisable();
  } else {
    await cmdEnable();
  }
}

/**
 * Apply patches to all Claude Code files.
 * Returns { patchedCount, alreadyPatchedCount, errorCount, errors }
 */
function applyPatches() {
  const files = findJsFiles();
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

  return { patchedCount, alreadyPatchedCount, errorCount, errors, totalFiles: files.length };
}

/**
 * Enable BiDi fix command (user-initiated)
 */
async function cmdEnable() {
  const files = findJsFiles();

  if (files.length === 0) {
    vscode.window.showErrorMessage('Claude Code not found. Please install it first.');
    return;
  }

  // Save preference FIRST, before doing anything else
  if (extensionContext) {
    await extensionContext.globalState.update('userWantsEnabled', true);
  }

  const { patchedCount, alreadyPatchedCount, errorCount, errors } = applyPatches();

  // Update status bar IMMEDIATELY, before any popup
  updateStatusBar();

  if (patchedCount > 0 || alreadyPatchedCount > 0) {
    if (patchedCount > 0) {
      vscode.window.showInformationMessage(
        `✅ Right-to-left text fix applied.\nReload VS Code to activate.`,
        'Reload Now',
        'Later'
      ).then(action => {
        if (action === 'Reload Now') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
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
 * Disable BiDi fix command (user-initiated)
 */
async function cmdDisable() {
  const files = findJsFiles();

  if (files.length === 0) {
    vscode.window.showErrorMessage('Claude Code not found.');
    return;
  }

  // Save preference FIRST, before doing anything else
  if (extensionContext) {
    await extensionContext.globalState.update('userWantsEnabled', false);
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

  // Update status bar IMMEDIATELY, before any popup
  updateStatusBar();

  if (restoredCount > 0 || nothingToRestoreCount > 0) {
    if (restoredCount > 0) {
      vscode.window.showInformationMessage(
        `✅ Right-to-left text fix removed.\nReload VS Code to complete.`,
        'Reload Now',
        'Later'
      ).then(action => {
        if (action === 'Reload Now') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
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
    ? `RTL text fix is ENABLED for ${patchedCount}/${files.length} installation(s)`
    : `RTL text fix is DISABLED for all installations`;

  vscode.window.showInformationMessage(
    `${summary}\n\n${statusLines.join('\n')}`,
    { modal: false }
  );

  // Also log to output channel
  const channel = vscode.window.createOutputChannel('Claude Code RTL Fix');
  channel.appendLine(summary);
  channel.appendLine('');
  statusLines.forEach(line => channel.appendLine(line));
  channel.appendLine('');
  channel.appendLine('Files:');
  files.forEach(file => channel.appendLine(`  ${file}`));
  channel.show();
}

/**
 * Silently apply patches without user interaction.
 * Used during auto-enable on activation (first install or Claude Code update).
 */
async function silentEnable(context) {
  await context.globalState.update('userWantsEnabled', true);
  const { patchedCount, errorCount } = applyPatches();

  if (patchedCount > 0) {
    vscode.window.showInformationMessage(
      '✅ RTL fix applied automatically. Reload VS Code to activate.',
      'Reload Now'
    ).then(action => {
      if (action === 'Reload Now') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      }
    });
  }

  updateStatusBar();
}

/**
 * Extension activation
 */
async function activate(context) {
  console.log('Claude Code RTL Fix extension is now active');

  extensionContext = context;

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'claude-code-rtl-fix.toggle';
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('claude-code-rtl-fix.enable', cmdEnable),
    vscode.commands.registerCommand('claude-code-rtl-fix.disable', cmdDisable),
    vscode.commands.registerCommand('claude-code-rtl-fix.status', cmdStatus),
    vscode.commands.registerCommand('claude-code-rtl-fix.toggle', cmdToggle)
  );

  const files = findJsFiles();
  if (files.length === 0) {
    statusBarItem.hide();
    return;
  }

  const userWantsEnabled = context.globalState.get('userWantsEnabled');
  const patchedCount = files.filter(f => isPatched(f)).length;

  if (userWantsEnabled === undefined) {
    // First install — auto-enable and persist preference
    await silentEnable(context);
  } else if (userWantsEnabled === true && patchedCount === 0) {
    // User wants enabled but patch is gone (Claude Code updated) — re-apply silently
    applyPatches();
    updateStatusBar();
  } else if (userWantsEnabled === true && patchedCount > 0) {
    // Everything is in order — just update UI
    updateStatusBar();
  } else {
    // userWantsEnabled === false — respect user's choice
    updateStatusBar();
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
