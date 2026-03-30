# 📦 Build and Test Instructions

## הוראות אריזה ובדיקה על אמת

---

## שלב 1: בדיקה מקומית (Extension Development Host)

### 1.1 פתח את התיקייה ב-VS Code

```bash
cd /c/Users/Naor/Downloads/simple-app/hebrew-bidi-vscode-extension
code .
```

### 1.2 הפעל את התוסף במצב Debug

**אופציה A: מקש קיצור**
- לחץ `F5`

**אופציה B: תפריט**
1. לחץ על תפריט "Run" → "Start Debugging"
2. או: `Ctrl+Shift+D` ואז לחץ על כפתור ה-Play הירוק

### 1.3 מה אמור לקרות:

✅ חלון VS Code חדש ייפתח (Extension Development Host)
✅ בפינה ימנית תחתונה תראה: `⊘ Claude RTL` (אפור)
✅ כשמרחף מעל הכפתור: "Claude Code: Right-to-left text fix inactive (Click to enable)"

### 1.4 בדוק את הכפתור:

**בחלון החדש שנפתח:**

1. **לחץ על** `⊘ Claude RTL`
2. **אמור לקפוץ הודעה:**
   ```
   ✅ Right-to-left text fix applied.
   Reload VS Code to activate.

   [Reload Now] [Later]
   ```
3. **לחץ "Reload Now"**
4. **החלון נטען מחדש**
5. **הכפתור אמור להשתנות ל:** `✓ Claude RTL` (ירוק/בולט)
6. **Tooltip:** "Claude Code: Right-to-left text fix active"

### 1.5 בדוק את העברית:

1. **פתח Claude Code** בחלון ה-Extension Development Host
2. **כתוב הודעה בעברית:**
   ```
   שלום! איך אתה?
   ```
3. **✅ בדוק שהטקסט מוצג נכון מימין לשמאל**

4. **בדוק טקסט מעורב:**
   ```
   אני משתמש ב-Claude Code ומדבר עברית
   ```
5. **✅ בדוק שעברית RTL ואנגלית LTR**

### 1.6 בדוק כיבוי:

1. **לחץ שוב על** `✓ Claude RTL` (הירוק)
2. **אמור לקפוץ:**
   ```
   ✅ Right-to-left text fix removed.
   Reload VS Code to complete.

   [Reload Now] [Later]
   ```
3. **לחץ "Reload Now"**
4. **הכפתור חוזר ל:** `⊘ Claude RTL` (אפור)

### 1.7 בדוק את ה-Command Palette:

1. לחץ `Ctrl+Shift+P`
2. הקלד: "hebrew" או "claude"
3. אמור לראות 4 פקודות:
   - ✅ Enable Hebrew BiDi Fix
   - ✅ Disable Hebrew BiDi Fix
   - ✅ Check Hebrew BiDi Status
   - ✅ Toggle Hebrew BiDi Fix

---

## שלב 2: אריזה (Creating .vsix file)

### 2.1 התקן את vsce (פעם אחת בלבד)

**אם יש לך Node.js:**
```bash
npm install -g @vscode/vsce
```

**אם אין Node.js:**
1. הורד והתקן מ: https://nodejs.org/
2. בחר את ה-LTS version
3. התקן עם ההגדרות הדיפולטיביות
4. אחרי ההתקנה, פתח terminal חדש והרץ:
   ```bash
   npm install -g @vscode/vsce
   ```

### 2.2 עדכן את הפרטים ב-package.json (חשוב!)

פתח את `package.json` ועדכן:

```json
{
  "publisher": "your-actual-publisher-name",  // ← שנה את זה!
  "repository": {
    "type": "git",
    "url": "https://github.com/yaniv-naor/claude-code-rtl-fix"  // ← שנה את זה!
  },
  "bugs": {
    "url": "https://github.com/yaniv-naor/claude-code-rtl-fix/issues"  // ← שנה את זה!
  }
}
```

### 2.3 ארוז את התוסף

```bash
cd /c/Users/Naor/Downloads/simple-app/hebrew-bidi-vscode-extension
vsce package
```

### 2.4 מה אמור לקרות:

```
Executing prepublish script 'npm run vscode:prepublish'...
DONE  Packaged: /c/Users/Naor/Downloads/simple-app/hebrew-bidi-vscode-extension/claude-code-rtl-fix-1.0.0.vsix (XX files, XX KB)
```

✅ נוצר קובץ: `claude-code-rtl-fix-1.0.0.vsix`

---

## שלב 3: התקנה מ-VSIX (בדיקה על אמת!)

### 3.1 התקן את ה-VSIX

**אופציה A: דרך Command Palette**
1. פתח VS Code רגיל (לא Extension Development Host)
2. לחץ `Ctrl+Shift+P`
3. הקלד: "install from vsix"
4. בחר: "Extensions: Install from VSIX..."
5. נווט ל: `claude-code-rtl-fix-1.0.0.vsix`
6. בחר את הקובץ

**אופציה B: דרך Terminal**
```bash
code --install-extension claude-code-rtl-fix-1.0.0.vsix
```

### 3.2 מה אמור לקרות:

```
Installing extension 'claude-code-rtl-fix'...
Extension 'claude-code-rtl-fix' was successfully installed.
```

### 3.3 אתחל את VS Code

- סגור את כל חלונות VS Code
- פתח מחדש

### 3.4 בדוק שהתוסף מותקן:

1. `Ctrl+Shift+X` (Extensions view)
2. חפש: "Claude Code Hebrew"
3. ✅ אמור להופיע: "Claude Code Hebrew BiDi Fix"
4. ✅ סטטוס: "Installed"

### 3.5 בדוק את הכפתור:

1. ✅ בפינה ימנית תחתונה: `⊘ Claude RTL`
2. ✅ לחץ עליו → הודעה מופיעה
3. ✅ Reload → הכפתור משתנה לירוק
4. ✅ פתח Claude Code → כתוב עברית → עובד!

---

## שלב 4: בדיקות נוספות

### 4.1 בדוק עם Claude Code בפועל:

1. פתח פרויקט כלשהו
2. פתח את Claude Code panel
3. שאל שאלה בעברית: "מה זה TypeScript?"
4. ✅ התשובה של Claude בעברית מוצגת נכון
5. ✅ השאלה שלך מוצגת נכון

### 4.2 בדוק טקסט מעורב:

```
כתוב:
היי Claude! אני צריך עזרה עם React component
מה הדרך הנכונה לעשות useState?
```

✅ עברית RTL, אנגלית LTR, קוד קריא

### 4.3 בדוק אנגלית בלבד (חשוב!):

```
Write:
Hello Claude! Can you help me with JavaScript?
What is the best way to use async/await?
```

✅ הכל עובד נורמלי, אין שינוי, LTR

### 4.4 בדוק את ה-Settings:

1. `Ctrl+,` (Settings)
2. חפש: "hebrew bidi"
3. ✅ אמור להיות: "Auto Enable" (checkbox)
4. סמן אותו → סגור VS Code → פתח מחדש
5. ✅ הכפתור אמור להיות ירוק אוטומטית

---

## שלב 5: בדיקות קצה (Edge Cases)

### 5.1 מה קורה אם Claude Code לא מותקן?

1. הסר את Claude Code זמנית (או בדוק על מכונה אחרת)
2. פתח VS Code
3. ✅ הכפתור **לא** אמור להופיע
4. אם תנסה Enable דרך Command Palette:
   ```
   Claude Code not found. Please install it first.
   ```

### 5.2 מה קורה אם כבר מופעל?

1. הפעל את התיקון (ירוק)
2. לחץ שוב על הכפתור → Disable
3. לחץ Enable דרך Command Palette
4. ✅ הודעה: "Already active."

### 5.3 מה קורה אם Claude Code מתעדכן?

1. כשClaud Code מתעדכן לגרסה חדשה
2. התיקון יירד (כי יש תיקייה חדשה)
3. ✅ פשוט תלחץ על הכפתור שוב
4. ✅ התיקון יחול על הגרסה החדשה

---

## שלב 6: הכנה לפרסום

### 6.1 ודא שהכל תקין:

- ✅ הכפתור עובד
- ✅ העברית מוצגת נכון
- ✅ האנגלית לא מושפעת
- ✅ הטקסט המעורב עובד
- ✅ ההודעות מקצועיות
- ✅ אין שגיאות בקונסולה

### 6.2 צור README עברי (אופציונלי):

אם רוצה גם גרסה עברית:
```bash
cp README.md README.he.md
# ערוך את README.he.md בעברית
```

### 6.3 הוסף אייקון (מומלץ):

1. צור אייקון 128x128 PNG
2. שמור בשם `icon.png`
3. הוסף ל-package.json:
   ```json
   "icon": "icon.png",
   ```

---

## ✅ Checklist סופי

לפני פרסום, ודא:

- [ ] VSIX נוצר בהצלחה
- [ ] התקנה מ-VSIX עובדת
- [ ] הכפתור מופיע בפינה
- [ ] Toggle עובד (אפור → ירוק → אפור)
- [ ] עברית מוצגת נכון כש-enabled
- [ ] אנגלית לא מושפעת
- [ ] טקסט מעורב עובד
- [ ] כל ההודעות מקצועיות (אנגלית, ללא "BiDi")
- [ ] Reload מציע אחרי שינוי
- [ ] Auto-enable setting עובד
- [ ] שדות ב-package.json מעודכנים (publisher, repo)
- [ ] README ברור ומקצועי
- [ ] LICENSE קיים (MIT)
- [ ] אין שגיאות ב-Developer Tools Console

---

## 🚀 מוכן לפרסום!

אחרי שכל הבדיקות עברו, אתה יכול:

### GitHub:
```bash
git init
git add .
git commit -m "Release v1.0.0: Claude Code Hebrew RTL Fix"
git remote add origin https://github.com/yaniv-naor/claude-code-rtl-fix.git
git push -u origin main
```

### VS Code Marketplace:
1. צור publisher: https://marketplace.visualstudio.com/manage
2. קבל Personal Access Token
3. `vsce publish`

### שיתוף:
- העלה את ה-VSIX ל-GitHub Releases
- שתף ב-LinkedIn
- פרסם ב-Reddit r/vscode
- שלח לקהילת המפתחים העברית

---

## 🎉 זהו!

יש לך תוסף מקצועי ומוכן לשימוש!

**שאלות? בעיות?** פתח issue ב-GitHub או צור קשר.

**Good luck! בהצלחה!** 🚀🇮🇱
