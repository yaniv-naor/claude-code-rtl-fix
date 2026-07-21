# RTL Test Cases - Claude Code RTL Fix

קובץ בדיקות ליישור טקסט RTL. יש להריץ לאחר כל שינוי בתוסף או עדכון גרסה של Claude Code.

## הוראות הרצה

כשמבקשים "תריץ בדיקות" או "בדיקות RTL":
1. הצג את כל הטקסטים מסעיפים 1-10 בתשובה אחת כדי שהמשתמש יבדוק את ה-output ויזואלית
2. לאחר מכן, בקש מהמשתמש לבצע את בדיקות ה-input מסעיף 11 ידנית בשדה הצ'אט

---

## 1. כותרות בגדלים שונים

### עברית בלבד

# שלום עולם
## ברוכים הבאים למערכת
### הגדרות כלליות של המשתמש
#### סעיף משנה בתוך הדוח
##### פרטי יצירת קשר עם התמיכה
###### הערת שוליים קטנה

### אנגלית בלבד

# Hello World
## Welcome to the System
### General User Settings
#### Subsection Within the Report
##### Support Contact Details
###### A Small Footnote

### משולב עברית ואנגלית

# ברוכים הבאים ל-Claude Code
## הגדרות Settings עבור המשתמש
### ניהול Authentication במערכת
#### שימוש ב-API לצורך אינטגרציה
##### פרטי Deployment ותצורת השרת
###### הערה בנוגע ל-edge cases

---

## 2. מספור על כל צורותיו

### עברית בלבד

1. פתיחת קובץ חדש
2. עריכת תוכן קיים
3. שמירת השינויים
4. סגירת המסמך

א. הכנת הסביבה
ב. הרצת הבדיקות
ג. ניתוח התוצאות
ד. כתיבת הדוח

1) שלב ראשון בתהליך
2) שלב שני בתהליך
3) שלב שלישי בתהליך

i. מבוא כללי לנושא
ii. רקע תיאורטי
iii. שיטות מחקר
iv. ממצאים ודיון

- פריט רשימה ראשון
- פריט רשימה שני
- פריט רשימה שלישי
  - תת-פריט א
  - תת-פריט ב

### אנגלית בלבד

1. Open a new file
2. Edit existing content
3. Save changes
4. Close the document

a. Prepare the environment
b. Run the tests
c. Analyze the results
d. Write the report

1) First step in the process
2) Second step in the process
3) Third step in the process

i. General introduction
ii. Theoretical background
iii. Research methods
iv. Findings and discussion

- First list item
- Second list item
- Third list item
  - Sub-item a
  - Sub-item b

### משולב עברית ואנגלית

1. התקנת Node.js בסביבת העבודה
2. הרצת npm install עבור התלויות
3. הגדרת Environment Variables
4. בדיקת Connection למסד הנתונים

א. יצירת Repository חדש
ב. הוספת Remote Origin
ג. ביצוע Push ל-main branch
ד. פתיחת Pull Request

1) קונפיגורציית Webpack
2) הגדרת TypeScript paths
3) אופטימיזציית Bundle size

---

## 3. מספור באמצעות אימוג'י וסמלים

### עברית בלבד

🔴 שגיאה קריטית בשרת
🟡 אזהרה - ביצועים נמוכים
🟢 המערכת פועלת תקין

✅ המשימה הושלמה בהצלחה
❌ הפעולה נכשלה
⚠️ נדרשת בדיקה נוספת

📁 תיקיית פרויקט ראשית
📄 קובץ תצורה
🗂️ ארכיון גרסאות ישנות

➡️ שלב ראשון
➡️ שלב שני
➡️ שלב שלישי

🥇 עדיפות גבוהה ביותר
🥈 עדיפות בינונית
🥉 עדיפות נמוכה

⭐ תכונה חדשה ומבוקשת
🐛 באג שדורש תיקון
🔧 שיפור טכני נדרש
💡 רעיון לפיתוח עתידי

### אנגלית בלבד

🔴 Critical server error
🟡 Warning - low performance
🟢 System operating normally

✅ Task completed successfully
❌ Operation failed
⚠️ Further review required

📁 Main project folder
📄 Configuration file
🗂️ Old versions archive

➡️ Step one
➡️ Step two
➡️ Step three

🥇 Highest priority
🥈 Medium priority
🥉 Low priority

⭐ New requested feature
🐛 Bug that needs fixing
🔧 Technical improvement needed
💡 Idea for future development

### משולב עברית ואנגלית

🔴 שגיאת Runtime קריטית
🟡 אזהרת Memory Leak
🟢 ה-Deployment הושלם בהצלחה

✅ Unit Tests עוברים
❌ Integration Test נכשל
⚠️ נדרש Code Review נוסף

📁 תיקיית Source Code
📄 קובץ README.md
🗂️ ארכיון Releases קודמים

⭐ פיצ'ר Dark Mode חדש
🐛 באג ב-Authentication Flow
🔧 שיפור Performance ב-API
💡 רעיון ל-Plugin Architecture

---

## 4. ציטוטים (Blockquotes)

### עברית בלבד

> זהו ציטוט בעברית שצריך להיות מיושר לימין
> עם שורה שנייה

> ציטוט ארוך יותר שמכיל מספר משפטים. המטרה היא לבדוק שהטקסט נשאר מיושר לימין גם כשהוא עובר שורה. חשוב לוודא שזה עובד כמו שצריך.

### אנגלית בלבד

> This is an English quote
> with a second line

> A longer quote that contains multiple sentences. The goal is to verify that the text stays left-aligned even when it wraps to a new line. It's important to make sure this works properly.

### משולב עברית ואנגלית

> ציטוט שמכיל API reference וגם עברית
> שורה שנייה עם מונח כמו Runtime Environment

> According to the documentation, הפונקציה מחזירה ערך boolean

---

## 5. סימני פיסוק ותווים מיוחדים

### עברית בלבד

שאלה: האם זה עובד? כן! (בהחלט) - ואפילו עם "מרכאות"

המחיר הוא 100 ש"ח + מע"מ = 117 ש"ח

הזמן: 14:30 | התאריך: 16/07/2026 | מיקום: תל-אביב

### אנגלית בלבד

Question: Does this work? Yes! (Absolutely) - and even with "quotes"

The price is $100 + tax = $117

Time: 14:30 | Date: 07/16/2026 | Location: Tel-Aviv

### משולב עברית ואנגלית

שאלה: האם ה-feature הזה עובד? כן! (ראה issue #42)

המחיר: $100 (כ-370 ש"ח) כולל VAT

עדכון אחרון: 16/07/2026 בשעה 14:30 (UTC+3)

---

## 6. מעבר בין כיוונים באותה שורה

המשתנה userName מכיל את שם המשתמש

Use the פונקציה called getData

הפונקציה מחזירה true אם הערך תקין

הקובץ config.json נמצא בתיקייה הראשית

The component רכיב renders correctly

שים לב ש-localStorage שומר את הערך כ-string

---

## 7. טקסט רגיל (פסקאות)

### עברית בלבד

זוהי פסקה רגילה בעברית שנועדה לבדוק את היישור של טקסט ארוך. הטקסט צריך להיות מיושר לימין ולזרום בצורה טבעית משורה לשורה. חשוב לוודא שגם כאשר הטקסט ארוך ועובר מספר שורות, היישור נשמר בצורה תקינה.

### אנגלית בלבד

This is a regular paragraph in English to test alignment of long text. The text should be left-aligned and flow naturally from line to line. It's important to verify that even when the text is long and spans multiple lines, the alignment is maintained properly.

### משולב עברית ואנגלית

זוהי פסקה שמכילה מונחים טכניים כמו React components ו-TypeScript interfaces. המטרה היא לוודא שכשיש מילים באנגלית בתוך טקסט עברי, הכיוון נשמר ולא מתבלבל. למשל, כשאני כותב שה-function צריכה return value מסוג boolean, הכל צריך להיראות תקין.

---

## 8. קוד inline בתוך טקסט

### עברית בלבד

השתמש בפקודה `npm install` כדי להתקין

הקובץ נמצא בנתיב `src/components/`

הפונקציה `getData()` מחזירה מערך

### אנגלית בלבד

Use the command `npm install` to install

The file is located at `src/components/`

The function `getData()` returns an array

### משולב עברית ואנגלית

הרץ `npm run build` כדי לבנות את הפרויקט

השתמש ב-`useEffect` hook בתוך הקומפוננטה

הגדר `"type": "module"` בקובץ `package.json`

---

## 9. Bold, Italic, ועיצוב טקסט

### עברית בלבד

**טקסט מודגש בעברית** ואז טקסט רגיל

*טקסט נטוי בעברית* ואז טקסט רגיל

***טקסט מודגש ונטוי*** ואז טקסט רגיל

~~טקסט עם קו חוצה~~ ואז טקסט רגיל

### אנגלית בלבד

**Bold text in English** and then regular text

*Italic text in English* and then regular text

***Bold and italic text*** and then regular text

~~Strikethrough text~~ and then regular text

### משולב עברית ואנגלית

**שים לב:** יש לעדכן את ה-Dependencies לפני ה-Build

*הערה חשובה:* ה-API key צריך להיות ב-Environment Variables

---

## 10. שורות עם מספרים וכתובות

### עברית בלבד

טלפון: 050-1234567
כתובת: רחוב הרצל 42, תל אביב
מיקוד: 6120101

### אנגלית בלבד

Phone: 050-1234567
Address: 42 Herzl St, Tel Aviv
Zip: 6120101

### משולב עברית ואנגלית

IP: 192.168.1.1 - שרת מקומי
Port: 3000 - שרת פיתוח
URL: https://example.com - אתר הייצור

---

## 11. בדיקות Input — הקלדה בשדה הצ'אט

### A. כיוון ראשוני

- פתיחת צ'אט חדש — הסמן בימין
- אחרי שליחת הודעה — הסמן חוזר לימין

### B. הקלדה רגילה

- `שלום עולם` — מיושר ימינה
- `hello world` — מיושר שמאלה
- `שלום hello עולם` — מיושר ימינה (מתחיל RTL)
- `hello שלום world` — מיושר שמאלה (מתחיל LTR)

### C. מספור (input)

- `1. שלום עולם` — מיושר ימינה מהרגע שנכתבת עברית
- `1. hello world` — נשאר שמאלה
- `- פריט ברשימה` — מיושר ימינה

### D. מחיקה וכתיבה מחדש

- כתוב עברית → מחק הכל → כתוב אנגלית — עובר לשמאל
- כתוב אנגלית → מחק הכל → כתוב עברית — עובר לימין

### E. מצבי קצה (input)

- רק מספרים `12345` — שמאלה
- רק סימנים `...!!!` — שמאלה
- טקסט ארוך עם גלילה — הכיוון נשמר
- Paste טקסט עברי — מיושר ימינה

---

## צ'קליסט בדיקה

### Output (הודעות שהתקבלו מ-Claude)

- [ ] כל הכותרות העבריות מיושרות לימין
- [ ] כל הכותרות האנגליות מיושרות לשמאל
- [ ] רשימות ממוספרות בעברית מיושרות לימין
- [ ] רשימות ממוספרות באנגלית מיושרות לשמאל
- [ ] אימוג'י לא שובר את היישור
- [ ] ציטוטים עבריים מיושרים לימין
- [ ] טקסט משולב (bidi) מוצג בצורה קריאה
- [ ] קוד inline לא משפיע על כיוון הטקסט
- [ ] עיצוב טקסט (bold/italic) לא שובר יישור
- [ ] מספרים וכתובות מוצגים נכון בשני הכיוונים

### Input (הקלדה בשדה הצ'אט)

- [ ] סמן מתחיל בימין בצ'אט חדש
- [ ] סמן חוזר לימין אחרי שליחת הודעה
- [ ] עברית מיושרת ימינה
- [ ] אנגלית מיושרת שמאלה
- [ ] מספור + עברית מתיישר ימינה
- [ ] מחיקה + כתיבה מחדש — כיוון מתעדכן
- [ ] Paste עובד נכון
- [ ] טקסט ארוך עם גלילה — כיוון נשמר
