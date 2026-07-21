# ניתוח באגים — Claude Code RTL Fix

עדכון אחרון: 2026-07-21 | גרסה נוכחית: 1.0.9 | Claude Code: 2.1.216

---

## סקירה כללית

התוסף מחיל RTL patch על קובץ `index.js` של Claude Code webview.
הפאצ' רץ בתוך ה-webview (browser context) ומטפל ב:
- יישור טקסט לפי תוכן (RTL/LTR)
- שדה הקלט (direction + mirror sync)
- רשימות ממוספרות/לא-ממוספרות
- בלוקי קוד (תמיד LTR)

---

## ארכיטקטורת Claude Code Webview (גרסה 2.1.216)

### מבנה כללי

```
VS Code Extension Host
├── Claude Code Extension (anthropic.claude-code-*)
│   ├── registerWebviewViewProvider("claudeVSCodeSidebar")
│   └── registerWebviewPanelSerializer("claudeVSCodePanel")
└── Claude Code RTL Fix Extension (yaniv-naor.claude-code-rtl-fix-*)
    └── patches index.js on disk
```

### Webview HTML Generation
- `getHtmlForWebview()` → HTML חדש בכל `resolveWebviewView` / `setupPanel`
- Script: `<script nonce="${nonce}" src="${indexJsUri}" type="module"></script>`
- Nonce: `randomBytes(16).toString("hex")` — חדש בכל render
- CSP: `script-src 'nonce-${nonce}'` — רק scripts עם nonce מורשים
- `retainContextWhenHidden: true` — webview לא נהרס כש-tab מוסתר

### שדה הקלט — ארכיטקטורת שכבות

```
messageInputContainer_*
├── messageInput_*  (contentEditable)
│   ├── color: #0000 (שקוף!)
│   ├── caret-color: var(--app-input-foreground)
│   ├── z-index: 1, position: relative
│   └── padding: 10px 36px 10px 14px
└── mentionMirror_*  (aria-hidden="true")
    ├── position: absolute, inset: 0
    ├── pointer-events: none
    ├── color: var(--app-input-foreground) (הטקסט הנראה!)
    └── padding: 10px 36px 10px 14px
```

**המשמעות:** המשתמש מקליד ב-messageInput (שקוף) אבל **רואה** את mentionMirror.
כל שינוי direction חייב לחול על **שניהם** — אחרת הסמן והטקסט לא מסונכרנים.

### React 18.3.1 — Text Node Updates

כש-React מעדכן תוכן טקסט (למשל, הקלדה בשדה):
- **לא** יוצר DOM node חדש (childList mutation)
- **כן** מעדכן text node קיים (characterData mutation)
- MutationObserver עם `childList: true` בלבד **לא** יתפוס שינויים אלה
- לכן חובה להשתמש ב-`input` event listener בנוסף ל-MutationObserver

### CSS קריטי

```css
/* messageInput — טקסט שקוף */
.messageInput_cKsPxg {
  color: #0000;
  caret-color: var(--app-input-foreground);
  z-index: 1;
  position: relative;
  padding: 10px 36px 10px 14px;
}

/* mentionMirror — הטקסט הנראה למשתמש */
.mentionMirror_cKsPxg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: var(--app-input-foreground);
  padding: 10px 36px 10px 14px;
}

/* Lists — logical padding שמתהפך לפי direction */
.root_-a7MRw ol, .root_-a7MRw ul {
  padding-inline-start: 2em;
}

/* Li items — unicode-bidi plaintext (מופעל כבר ע"י Claude Code) */
.root_-a7MRw :is(p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th) {
  unicode-bidi: plaintext;
}

/* Root — overflow hidden שחותך markers שנדחפים מחוץ לגבול */
.root_-a7MRw {
  overflow-x: hidden;
  width: 100%;
}
```

### שמות Classes

Claude Code משתמש ב-CSS Modules עם hash suffixes (למשל `messageInput_cKsPxg`).
ה-hash **משתנה בין גרסאות** — לכן הפאצ' משתמש ב-`[class*="messageInput_"]` ולא selector מדויק.

---

## באג 2: שדה הקלט לא מתעדכן + רשימות שבורות

### סטטוס: ✅ תוקן (גרסה 1.0.8 → 1.0.9)

### תסמינים שדווחו

1. **Input direction לא מסתנכרן:** מתחיל להקליד מספר (למשל "1.") → שדה נשאר LTR → ממשיך בעברית → לא מתהפך
2. **סמן מתחיל בשמאל:** פותח צ'אט חדש או אחרי שליחת הודעה — הסמן בצד שמאל במקום ימין
3. **רשימות ממוספרות — מספרים נעלמים:** ברשימות עברית ו/או אנגלית ה-markers (1. 2. 3.) לא מוצגים
4. **רשימות — מספרים בצד אחד, טקסט בצד שני:** desync בין marker position לבין text alignment

### שורש הבעיות

#### בעיה A: mentionMirror לא מסונכרן

**מה קרה:** ה-input event handler הישן עדכן direction רק על `el` (messageInput) אבל לא על mentionMirror.

**למה זה בעיה:** messageInput שקוף — המשתמש רואה את mentionMirror. אם רק messageInput מקבל `dir=rtl` אבל mirror נשאר `dir=ltr`, הטקסט הנראה לא מיושר.

**פתרון:**
```javascript
document.addEventListener('input', function(e) {
  var el = e.target;
  var dir = getDir(el.textContent || el.value || '');
  setDir(el, dir);
  // Strategy 1: nextElementSibling with aria-hidden
  var mirror = el.nextElementSibling;
  if (mirror && mirror.getAttribute('aria-hidden') === 'true') {
    setDir(mirror, dir);
  } else {
    // Strategy 2: find via container class
    var container = el.closest('[class*="messageInputContainer_"]');
    if (container) {
      var m = container.querySelector('[class*="mentionMirror_"]');
      if (m) setDir(m, dir);
    }
  }
}, true);
```

#### בעיה B: MutationObserver לא תופס הקלדה

**מה קרה:** MutationObserver מוגדר עם `childList: true, subtree: true` בלבד.

**למה זה בעיה:** React 18.3.1 מעדכן text nodes קיימים (characterData) ולא יוצר nodes חדשים. ה-observer לא יורה בזמן הקלדה.

**פתרון:** שילוב `input` event listener (capturing) עם MutationObserver. ה-input event מטפל בשדה הקלט בזמן אמת, ה-observer מטפל בתוכן חדש שנוסף ל-DOM (הודעות Claude).

#### בעיה C: סמן מתחיל בשמאל

**מה קרה:** `getDir("")` מחזיר `"ltr"` כי RTL_REGEX לא מוצא תווים RTL במחרוזת ריקה.

**למה זה בעיה:** שדה ריק מקבל `dir=ltr` — סמן בשמאל. עבור משתמשי RTL זה הפוך.

**פתרון:** זיהוי שדות ריקים והגדרתם ל-RTL כברירת מחדל:
```javascript
if (!text.trim() && el.matches('[contenteditable], [class*="messageInput_"], [class*="mentionMirror_"]')) {
  setDir(el, 'rtl');
  return;
}
```
וגם בסעיף ה-input fields:
```javascript
if (!text.trim()) {
  setDir(el, 'rtl');
  return;
}
```

#### בעיה D: List markers נעלמים — padding-inline-start

**מה קרה:** Claude Code CSS מגדיר `padding-inline-start: 2em` על ol/ul.

**למה זה בעיה:** `padding-inline-start` הוא CSS logical property — כש-direction=rtl, הוא הופך ל-`padding-right`. אם ה-list element מקבל `direction: rtl` מהפאצ' שלנו, ה-padding עובר ימינה, אבל ה-list marker נשאר בצד שמאל — ואז `overflow-x: hidden` על `.root_-a7MRw` חותך אותו.

**פתרון:** הגדרת padding פיזי על שני הצדדים:
```javascript
list.style.paddingLeft = '2em';
list.style.paddingRight = '2em';
```
זה מבטיח שתמיד יש מקום ל-markers בשני הצדדים, בלי תלות ב-direction.

#### בעיה E: List markers נעלמים — direction על ol/ul עצמם

**מה קרה:** הפאצ' הגדיר `dir` + `style.direction` על ה-`<ol>`/`<ul>` עצמם.

**למה זה בעיה:** שינוי direction על ה-list container משפיע על מיקום ה-markers. markers של ordered lists (1. 2. 3.) נשלטים ע"י ה-`list-style-position` ו-direction של ה-list element עצמו — לא של ה-li.

**פתרון:** **לא לגעת ב-direction של ol/ul!** במקום זה, לטפל רק ב-li items בנפרד:
```javascript
document.querySelectorAll('ol, ul').forEach(function(list) {
  if (list.closest('pre') || list.closest('code')) return;
  list.style.paddingLeft = '2em';
  list.style.paddingRight = '2em';
  list.querySelectorAll(':scope > li').forEach(function(li) {
    var dir = getDir(li.textContent);
    if (li.getAttribute('dir') !== dir) {
      li.setAttribute('dir', dir);
      li.style.direction = dir;
      li.style.textAlign = dir === 'rtl' ? 'right' : 'left';
    }
  });
});
```

וגם — skip li/ol/ul ב-BLOCK_SELECTORS כדי למנוע קונפליקט:
```javascript
if (el.tagName === 'LI' || el.tagName === 'OL' || el.tagName === 'UL') return;
```

#### בעיה F: מספרים בצד אחד, טקסט בצד שני

**מה קרה:** li items עם `dir=ltr` בתוך הורה RTL (או להיפך) — marker מיושר לצד אחד, טקסט לצד שני.

**פתרון:** הגדרה מפורשת של `li.style.direction` + `li.style.textAlign` על כל li:
```javascript
li.style.direction = dir;
li.style.textAlign = dir === 'rtl' ? 'right' : 'left';
```

### סיכום: סדר הטיפול ברשימות

1. **אל** תשנה direction על ol/ul עצמם
2. **כן** הגדר `paddingLeft` + `paddingRight` = `2em` (פיזי, לא logical)
3. **כן** הגדר על כל li: `dir`, `style.direction`, `style.textAlign` — לפי תוכנו
4. **כן** הוצא li/ol/ul מה-BLOCK_SELECTORS loop כדי שלא ייפגעו שם

### מה למדנו (לשימוש בגרסאות עתידיות)

- **CSS logical properties הם מלכודת:** `padding-inline-start`, `margin-inline-end`, `border-inline-start` — כולם מתהפכים כש-direction משתנה. תמיד להשתמש ב-physical properties (left/right) כשמגדירים padding/margin מהפאצ'.
- **overflow-x: hidden חותך content:** אם element יוצא מגבול ההורה (marker של list שנדחף), הוא פשוט נחתך. תמיד לוודא שיש מקום בשני הצדדים.
- **React לא יוצר DOM nodes חדשים בהקלדה:** MutationObserver לבד לא מספיק — חייבים input event listener.
- **messageInput שקוף:** כל שינוי direction חייב לחול גם על mentionMirror, אחרת המשתמש רואה תוצאה שונה ממה שבאמת מוגדר.
- **Class names עם hash:** תמיד `[class*="prefix_"]` ולא selector מדויק — ה-hash משתנה בין builds.
- **`unicode-bidi: plaintext` כבר קיים:** Claude Code מגדיר את זה על li, p וכו' — אז per-element direction עובד.

---

## באג 1: התוסף לא פעיל אחרי עדכון Claude Code

### סטטוס: ❌ לא תוקן (מתוכנן לגרסה עתידית)

### תסמינים

- אחרי עדכון Claude Code + Reload — הטקסט לא מיושר RTL
- ה-status bar מראה "Claude RTL" פעיל (עם סימן ✓)
- צריך Reload **שני** כדי שזה יעבוד
- לפעמים הצ'אט לא עולה בכלל ב-Reload הראשון

### שורש הבעיה (מאומת)

כש-Claude Code מתעדכן, הרצף הוא:

```
1. הגרסה החדשה מותקנת → index.js חדש ללא פאצ' מחליף את הישן
2. VS Code נפתח / Reload
3. Claude Code extension activate() → sidebar webview נטען → index.js ללא פאצ' רץ
4. התוסף שלנו activate() → רואה שפאצ' חסר → מחיל לדיסק
   ↑↑↑ אבל ה-webview כבר טען את הגרסה הישנה!
5. Reload שני → webview טוען index.js עם הפאצ' → עובד
```

### למה Status Bar מטעה

ה-status bar מבוסס על `globalState.get('userWantsEnabled')` — שמציין את **רצון** המשתמש, לא את **המצב בפועל**. אחרי שה-activate מחיל את הפאצ' לדיסק, הוא מעדכן status bar ל-"פעיל" — למרות שה-webview עדיין רץ על הגרסה הלא-patched.

### פרטים טכניים

**Activation order:**
- Claude Code: `activationEvents: ["onStartupFinished", "onWebviewPanel:claudeVSCodePanel"]`
- התוסף שלנו: `activationEvents: ["onStartupFinished"]`
- שניהם `onStartupFinished` — אבל Claude Code עשוי להיטען קודם (יש לו גם `onWebviewPanel`)
- אין דרך לשלוט בסדר activation של extensions עם אותו event

**קוד נוכחי (extension.js שורות 520-523):**
```javascript
} else if (userWantsEnabled === true && patchedCount === 0) {
    // User wants enabled but patch is gone (Claude Code updated) — re-apply silently
    applyPatches();
    updateStatusBar();
}
```
→ מחיל לדיסק אבל **לא מבקש reload!**

**לעומת `silentEnable()` (שורות 469-485):**
```javascript
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
```
→ **כן** מציג הודעת reload — אבל זה רק ב-first install!

### פתרונות אפשריים

| פתרון | יתרונות | חסרונות |
|--------|---------|---------|
| **הודעה + כפתור Reload** | פשוט, המשתמש מחליט | דורש פעולה ידנית |
| **Reload אוטומטי** | שקוף לחלוטין | אגרסיבי, עלול להפריע |
| **FileSystemWatcher** | תופס שינויים בזמן אמת | complexity, performance |
| **השהייה + בדיקת webview** | ממתין שה-webview ייטען | race conditions |
| **postMessage לwebview** | inject ישירות | CSP חוסם, nonce חדש |

### פתרון מומלץ

**הודעה עם כפתור Reload** — שינוי מינימלי בשורות 520-523:

```javascript
} else if (userWantsEnabled === true && patchedCount === 0) {
    applyPatches();
    updateStatusBar();
    vscode.window.showInformationMessage(
        'Claude Code updated — RTL fix re-applied. Reload to activate.',
        'Reload Now'
    ).then(action => {
        if (action === 'Reload Now') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    });
}
```

### סיכונים של הפתרון המומלץ
- **Reload spam:** אם Claude Code מתעדכן ב-background → הודעה מופיעה אוטומטית
- **Race condition:** אם Claude Code עצמו עושה reload אחרי התקנה (נדיר)
- **False positive:** אם הקובץ נמחק מסיבה אחרת

---

## קבצים רלוונטיים

| קובץ | תיאור |
|-------|--------|
| `~/.vscode/extensions/anthropic.claude-code-*/webview/index.js` | Target file — מקבל את הפאצ' |
| `~/.vscode/extensions/anthropic.claude-code-*/webview/index.css` | Claude Code CSS (logical properties) |
| `~/.vscode/extensions/anthropic.claude-code-*/extension.js` | Claude Code extension host |
| `~/Downloads/claude-code-rtl-fix/extension.js` | הקוד שלנו (source) |
| `~/.vscode/extensions/yaniv-naor.claude-code-rtl-fix-*/extension.js` | Installed copy |

### חשוב: Sync בזמן פיתוח

בזמן פיתוח, הקובץ ב-Downloads הוא ה-source. אבל VS Code טוען את ה-extension מ-`~/.vscode/extensions/`. אחרי כל שינוי צריך:
1. לעדכן את הקובץ ב-installed path
2. או לעשות `vsce package` + `code --install-extension`
3. ואז Reload

אם עושים שינוי ומריצים reload בלי להעתיק → הגרסה הישנה עדיין רצה!

---

## היסטוריית גרסאות

| גרסה | תאריך | שינויים |
|-------|--------|---------|
| 1.0.5 | 2026-06-17 | Fix auto-activation state persistence |
| 1.0.6 | 2026-06-17 | Fix status bar and toggle sync issues |
| 1.0.7 | 2026-06-17 | Fix input direction not syncing to mentionMirror |
| 1.0.8 | 2026-07-21 | Fix list markers + input direction (intermediate) |
| 1.0.9 | 2026-07-21 | Full fix: lists, input, cursor, mirror sync |

---

## הפאצ' המלא (v1.0.9)

```javascript
/* RTL_BIDI_FIX */
;(function(){
  var RTL_REGEX = /[֐-׿؀-ۿ܀-ݏﭐ-﷿ﹰ-﻿]/;

  var BLOCK_SELECTORS = [
    '[class*="message_"]',
    '[class*="content_"]',
    '[class*="root_"]',
    '[class*="userMessage_"]',
    '[class*="messageInput_"]',
    '[class*="messageInputContainer_"]',
    '[class*="root_"] p',
    '[class*="root_"] li',
    '[class*="content_"] p',
    '[class*="question"]',
    '[class*="option"]',
    '[class*="label"]',
    '[class*="description"]',
    '[class*="header"]',
    '[class*="title"]',
    '[class*="text"]',
    '[class*="dialog"]',
    '[class*="modal"]',
    '[class*="popup"]',
    '[class*="chip"]',
    '[class*="badge"]',
    '[class*="select"]',
    '[class*="radio"]',
    '[class*="choice"]',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'span', 'div', 'li', 'td', 'th', 'summary', 'details'
  ].join(',');

  function getDir(text) {
    return RTL_REGEX.test(text || '') ? 'rtl' : 'ltr';
  }

  function setDir(el, dir) {
    if (el.getAttribute('dir') !== dir) {
      el.setAttribute('dir', dir);
      el.style.direction = dir;
      el.style.textAlign = dir === 'rtl' ? 'right' : 'left';
    }
  }

  function applyBidi() {
    // Code blocks — always LTR
    document.querySelectorAll('pre, code').forEach(function(el) {
      setDir(el, 'ltr');
    });

    // Block elements — skip li/ol/ul (handled separately)
    document.querySelectorAll(BLOCK_SELECTORS).forEach(function(el) {
      if (el.closest('pre') || el.closest('code')) return;
      if (el.tagName === 'LI' || el.tagName === 'OL' || el.tagName === 'UL') return;
      var text = el.textContent;
      if (!text.trim() && el.matches('[contenteditable], [class*="messageInput_"], [class*="mentionMirror_"]')) {
        setDir(el, 'rtl');
        return;
      }
      var dir = getDir(text);
      setDir(el, dir);
    });

    // Lists — physical padding + per-li direction
    document.querySelectorAll('ol, ul').forEach(function(list) {
      if (list.closest('pre') || list.closest('code')) return;
      list.style.paddingLeft = '2em';
      list.style.paddingRight = '2em';
      list.querySelectorAll(':scope > li').forEach(function(li) {
        var dir = getDir(li.textContent);
        if (li.getAttribute('dir') !== dir) {
          li.setAttribute('dir', dir);
          li.style.direction = dir;
          li.style.textAlign = dir === 'rtl' ? 'right' : 'left';
        }
      });
    });

    // Input fields — default RTL when empty
    document.querySelectorAll('[class*="messageInput_"], [class*="Input_"], textarea, [contenteditable]').forEach(function(el) {
      if (el.closest('pre') || el.closest('code')) return;
      var text = el.textContent || el.value || '';
      if (!text.trim()) {
        setDir(el, 'rtl');
        return;
      }
      var dir = getDir(text);
      setDir(el, dir);
    });
  }

  applyBidi();
  new MutationObserver(applyBidi).observe(document.body, { childList: true, subtree: true });

  // Input handler — real-time direction + mirror sync
  document.addEventListener('input', function(e) {
    var el = e.target;
    var dir = getDir(el.textContent || el.value || '');
    setDir(el, dir);
    var mirror = el.nextElementSibling;
    if (mirror && mirror.getAttribute('aria-hidden') === 'true') {
      setDir(mirror, dir);
    } else {
      var container = el.closest('[class*="messageInputContainer_"]');
      if (container) {
        var m = container.querySelector('[class*="mentionMirror_"]');
        if (m) setDir(m, dir);
      }
    }
  }, true);
})();
/* END_RTL_BIDI_FIX */
```

---

## דברים שיכולים להישבר בעדכון Claude Code עתידי

### סבירות גבוהה
- **Class name hashes משתנים** — לא אמור לשבור כי אנחנו משתמשים ב-`[class*="prefix_"]`
- **index.js מוחלף** — באג 1 (פאצ' נמחק, צריך reload)

### סבירות בינונית
- **מבנה DOM משתנה** — אם mentionMirror כבר לא nextElementSibling, ה-fallback (container lookup) אמור לתפוס
- **Class prefix משתנה** — אם `messageInput_` הופך לשם אחר, הפאצ' לא ימצא אותו
- **CSS logical properties נוספים** — אם יוסיפו `margin-inline-start` או דומה, markers עלולים להיפגע שוב

### סבירות נמוכה
- **contentEditable מוחלף ב-textarea** — ישבור את הלוגיקה של textContent
- **React version upgrade** — עלול לשנות את ה-text update mechanism
- **CSP שינוי** — לא אמור להשפיע כי הפאצ' הוא חלק מ-index.js עצמו

### בדיקות שחובה לעשות אחרי כל עדכון Claude Code

1. פתיחת Claude Code → בדיקה שטקסט עברי מיושר ימינה
2. הקלדה בשדה → בדיקה שסמן מתחיל בימין ו-direction מתעדכן
3. רשימה ממוספרת → בדיקה שיש markers בשני הכיוונים
4. קוד → בדיקה שנשאר LTR
5. Status bar → בדיקה שמראה "פעיל"
