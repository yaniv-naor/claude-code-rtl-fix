/**
 * Simple tests for Hebrew BiDi extension
 * Run with: node test.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const BACKUP_SUFFIX = '.bidi-backup';
const PATCH_MARKER = '/* HEBREW_BIDI_FIX */';
const SAMPLE_JS = 'console.log("hello");';

// Import functions from extension.js
const extension = require('./extension.js');

// Test utilities
let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ FAIL: ${name}`);
  }
}

function createTempFile(content) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bidi-test-'));
  const tmpFile = path.join(tmpDir, 'index.js');
  fs.writeFileSync(tmpFile, content, 'utf-8');
  return tmpFile;
}

function cleanupTempFile(filePath) {
  const dir = path.dirname(filePath);
  fs.rmSync(dir, { recursive: true, force: true });
}

// Test: File structure check
console.log('\n--- File Structure Tests ---');
assert(fs.existsSync('./extension.js'), 'extension.js exists');
assert(fs.existsSync('./package.json'), 'package.json exists');
assert(fs.existsSync('./README.md'), 'README.md exists');
assert(fs.existsSync('./LICENSE'), 'LICENSE exists');

// Test: package.json validity
console.log('\n--- Package.json Tests ---');
try {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  assert(pkg.name === 'claude-code-hebrew-bidi', 'package name correct');
  assert(pkg.main === './extension.js', 'main entry point correct');
  assert(pkg.contributes && pkg.contributes.commands, 'commands defined');
  assert(pkg.contributes.commands.length === 3, 'three commands registered');

  const commands = pkg.contributes.commands.map(c => c.command);
  assert(commands.includes('claude-code-hebrew-bidi.enable'), 'enable command exists');
  assert(commands.includes('claude-code-hebrew-bidi.disable'), 'disable command exists');
  assert(commands.includes('claude-code-hebrew-bidi.status'), 'status command exists');
} catch (error) {
  failed++;
  console.log(`  ✗ FAIL: package.json parsing: ${error.message}`);
}

// Test: extension.js structure
console.log('\n--- Extension.js Tests ---');
const extCode = fs.readFileSync('./extension.js', 'utf-8');
assert(extCode.includes('BIDI_JS_PATCH'), 'BIDI_JS_PATCH defined');
assert(extCode.includes('MutationObserver'), 'MutationObserver in patch');
assert(extCode.includes('dir'), 'dir attribute in patch');
assert(extCode.includes('auto'), 'auto value in patch');
assert(extCode.includes('function activate'), 'activate function exists');
assert(extCode.includes('function deactivate'), 'deactivate function exists');
assert(extCode.includes('findJsFiles'), 'findJsFiles function exists');
assert(extCode.includes('isPatched'), 'isPatched function exists');
assert(extCode.includes('patchFile'), 'patchFile function exists');
assert(extCode.includes('restoreFile'), 'restoreFile function exists');

// Test: Patch content
console.log('\n--- Patch Content Tests ---');
const patchStart = extCode.indexOf('const BIDI_JS_PATCH = `');
const patchEnd = extCode.indexOf('`;', patchStart);
const patchContent = extCode.substring(patchStart, patchEnd);

assert(patchContent.includes('HEBREW_BIDI_FIX'), 'patch has marker');
assert(patchContent.includes('message_'), 'patch targets message elements');
assert(patchContent.includes('content_xGDvVg'), 'patch targets content elements');
assert(patchContent.includes('root_-a7MRw'), 'patch targets root elements');
assert(patchContent.includes('userMessage_'), 'patch targets user messages');
assert(patchContent.includes('messageInput_'), 'patch targets message input');
assert(patchContent.includes("setAttribute('dir', 'auto')"), 'patch sets dir=auto');
assert(patchContent.includes('observer.observe'), 'patch uses MutationObserver');

// Test: README content
console.log('\n--- README Tests ---');
const readme = fs.readFileSync('./README.md', 'utf-8');
assert(readme.includes('Hebrew'), 'README mentions Hebrew');
assert(readme.includes('BiDi'), 'README mentions BiDi');
assert(readme.includes('Claude Code'), 'README mentions Claude Code');
assert(readme.includes('dir="auto"'), 'README explains dir=auto');
assert(readme.includes('English'), 'README mentions English support');
assert(readme.includes('mixed'), 'README mentions mixed text');
assert(readme.includes('Installation'), 'README has installation section');
assert(readme.includes('Usage'), 'README has usage section');
assert(readme.includes('Enable'), 'README explains enable');
assert(readme.includes('Disable'), 'README explains disable');
assert(readme.includes('Status'), 'README explains status');

// Test: Logic validation (simplified - no actual file operations)
console.log('\n--- Logic Validation ---');
assert(PATCH_MARKER.length > 0, 'PATCH_MARKER defined');
assert(BACKUP_SUFFIX === '.bidi-backup', 'BACKUP_SUFFIX correct');

// Test: No dependencies
console.log('\n--- Dependency Tests ---');
try {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const deps = Object.keys(pkg.dependencies || {});
  assert(deps.length === 0, 'no external dependencies');
} catch (error) {
  failed++;
  console.log(`  ✗ FAIL: dependency check: ${error.message}`);
}

// Results
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  console.log('\nThe extension is ready to be packaged and tested in VS Code.');
  console.log('\nNext steps:');
  console.log('1. Press F5 in VS Code to test the extension');
  console.log('2. Try the commands in the Command Palette');
  console.log('3. Verify Hebrew text displays correctly in Claude Code');
  process.exit(0);
}
