# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img "مُعين" [ref=e8]
        - heading "مُعين" [level=1] [ref=e9]
      - heading "نسيان كلمة المرور" [level=2] [ref=e10]
      - paragraph [ref=e11]: أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
    - generic [ref=e12]:
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: البريد الإلكتروني
          - textbox "البريد الإلكتروني" [active] [ref=e16]:
            - /placeholder: أدخل بريدك الإلكتروني
            - text: invalid-email
        - button "إرسال رابط إعادة التعيين" [ref=e17] [cursor=pointer]
      - paragraph [ref=e19]:
        - text: تذكرت كلمة المرور؟
        - link "تسجيل الدخول" [ref=e20] [cursor=pointer]:
          - /url: /login
    - paragraph [ref=e22]:
      - text: إذا لم تستلم البريد الإلكتروني، تحقق من مجلد الرسائل المزعجة أو
      - button "حاول مرة أخرى" [ref=e23] [cursor=pointer]
  - alert [ref=e24]
```