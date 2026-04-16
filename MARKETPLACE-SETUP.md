# מדריך העלאה ל-VS Code Marketplace

## שלב 1: יצירת חשבון ו-Publisher

### 1.1 צור חשבון Azure DevOps
1. גש ל: https://dev.azure.com
2. התחבר עם חשבון Microsoft שלך (או צור חדש)
3. צור ארגון חדש (Organization)

### 1.2 צור Personal Access Token (PAT)
1. בעמוד Azure DevOps, לחץ על הסמל שלך למעלה → **User settings** → **Personal access tokens**
2. לחץ **+ New Token**
3. הגדר:
   - **Name**: `vsce-marketplace-token`
   - **Organization**: בחר את הארגון שיצרת
   - **Expiration**: בחר תוקף (מומלץ 90 ימים)
   - **Scopes**: סמן **Custom defined**
     - סמן **Marketplace** → **Manage** (זה נותן את כל ההרשאות הדרושות)
4. לחץ **Create**
5. **חשוב מאוד**: העתק את הטוקן ושמור אותו במקום בטוח! הוא יוצג רק פעם אחת.

### 1.3 רשום את ה-Publisher
1. גש ל: https://marketplace.visualstudio.com/manage
2. התחבר עם אותו חשבון Microsoft
3. לחץ **Create publisher**
4. מלא:
   - **ID**: `yaniv-naor` (חייב להתאים ל-publisher ב-package.json)
   - **Name**: שם תצוגה (למשל: "Yaniv Naor")
   - **Email**: האימייל שלך

---

## שלב 2: התקנת כלי העלאה

פתח טרמינל בתיקיית הפרויקט והתקן את `vsce`:

```bash
npm install -g @vscode/vsce
```

---

## שלב 3: בדיקה לפני העלאה

ודא שהכל תקין:

```bash
# בדוק את package.json
vsce ls

# צור קובץ .vsix לבדיקה
vsce package
```

---

## שלב 4: התחברות עם הטוקן

התחבר ל-publisher שלך:

```bash
vsce login yaniv-naor
```

כשיתבקש, הדבק את ה-Personal Access Token שיצרת.

---

## שלב 5: העלאה ל-Marketplace

העלה את התוסף:

```bash
vsce publish
```

או, אם אתה רוצה להעלות גרסה ספציפית:

```bash
vsce publish 1.0.0
```

---

## שלב 6: אימות

1. גש ל: https://marketplace.visualstudio.com/manage/publishers/yaniv-naor
2. וודא שהתוסף מופיע
3. התוסף יהיה זמין תוך מספר דקות בחנות התוספים של VS Code

---

## פקודות שימושיות

```bash
# עדכון גרסה והעלאה
vsce publish patch   # 1.0.0 → 1.0.1
vsce publish minor   # 1.0.0 → 1.1.0
vsce publish major   # 1.0.0 → 2.0.0

# בדיקת סטטוס
vsce show yaniv-naor.claude-code-rtl-fix

# הסרת גרסה מה-Marketplace
vsce unpublish yaniv-naor.claude-code-rtl-fix@1.0.0
```

---

## בעיות נפוצות

### שגיאה: "Missing publisher"
וודא ש-`package.json` מכיל: `"publisher": "yaniv-naor"`

### שגיאה: "Personal Access Token verification failed"
- וודא שהטוקן כולל הרשאות **Marketplace: Manage**
- נסה ליצור טוקן חדש

### שגיאה: "Publisher yaniv-naor not found"
- וודא שיצרת את ה-publisher ב: https://marketplace.visualstudio.com/manage
- וודא ש-ID של ה-publisher תואם בדיוק ל-package.json

### התוסף לא מופיע בחיפוש
- המתן 5-10 דקות אחרי העלאה
- בדוק ב: https://marketplace.visualstudio.com/items?itemName=yaniv-naor.claude-code-rtl-fix

---

## קישורים חשובים

- **Azure DevOps**: https://dev.azure.com
- **VS Code Marketplace Management**: https://marketplace.visualstudio.com/manage
- **vsce Documentation**: https://github.com/microsoft/vscode-vsce
- **Publishing Guide**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

---

## סיכום מהיר

1. ✅ יצירת חשבון Azure DevOps
2. ✅ יצירת Personal Access Token עם הרשאות Marketplace
3. ✅ רישום Publisher ב-Marketplace
4. ✅ התקנת `npm install -g @vscode/vsce`
5. ✅ התחברות: `vsce login yaniv-naor`
6. ✅ העלאה: `vsce publish`

---

**הצלחה! 🚀**
