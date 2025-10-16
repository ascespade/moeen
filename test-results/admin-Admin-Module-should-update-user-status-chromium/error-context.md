# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img "Hemam Logo" [ref=e6]
      - heading "مُعين" [level=1] [ref=e7]
    - generic [ref=e8]:
      - img [ref=e10]
      - heading "حدث خطأ غير متوقع" [level=2] [ref=e12]
      - paragraph [ref=e13]: عذراً، حدث خطأ غير متوقع. نحن نعمل على إصلاحه.
      - paragraph [ref=e15]: useT must be used within a TranslationProvider
      - generic [ref=e16]:
        - button "إعادة المحاولة" [ref=e17] [cursor=pointer]:
          - img [ref=e18]
          - text: إعادة المحاولة
        - link "العودة للرئيسية" [ref=e23] [cursor=pointer]:
          - /url: /
          - img [ref=e24]
          - text: العودة للرئيسية
      - generic [ref=e27]:
        - heading "إذا استمر الخطأ" [level=3] [ref=e28]
        - generic [ref=e29]:
          - link "الإبلاغ عن المشكلة" [ref=e30] [cursor=pointer]:
            - /url: /contact
            - img [ref=e31]
            - generic [ref=e40]: الإبلاغ عن المشكلة
          - link "الحصول على المساعدة" [ref=e41] [cursor=pointer]:
            - /url: /faq
            - img [ref=e42]
            - generic [ref=e44]: الحصول على المساعدة
    - paragraph [ref=e46]: © 2024 مُعين. جميع الحقوق محفوظة.
  - alert [ref=e47]
  - generic [ref=e50] [cursor=pointer]:
    - img [ref=e51]
    - generic [ref=e53]: 4 errors
    - button "Hide Errors" [ref=e54]:
      - img [ref=e55]
```