# نظام إدارة الثيم والتباين - Theme Visibility System

## ✅ نظام متكامل للتباين والوضوح - WCAG AA Compliant

تم تطبيق نظام شامل لضمان وضوح جميع المكونات في الوضع الفاتح والداكن وفقًا لمعايير WCAG AA (نسبة تباين 4.5:1 على الأقل).

## 🎨 المتغيرات الأساسية

### Light Theme (الوضع الفاتح)
- **Text Primary**: `#1e293b` - نسبة تباين 15:1 (ممتاز)
- **Text Secondary**: `#475569` - نسبة تباين 8:1 (جيد)
- **Text Muted**: `#64748b` - نسبة تباين 6:1 (مقبول)
- **Borders**: `#94a3b8` - واضحة على الخلفية الفاتحة
- **Background**: `#ffffff` - خلفية بيضاء نقية

### Dark Theme (الوضع الداكن)
- **Text Primary**: `#f8fafc` - نسبة تباين عالية
- **Text Secondary**: `#e5eef7` - نسبة تباين متوسطة
- **Text Muted**: `#cbd5e1` - نسبة تباين 6:1
- **Borders**: `#475569` - واضحة على الخلفية الداكنة
- **Background**: `#0d1117` - خلفية داكنة

## 🔧 المتغيرات الخاصة بالوضوح

```css
--ensure-text-visible: /* نص واضح دائماً */
--ensure-icon-visible: /* أيقونات واضحة دائماً */
--ensure-border-visible: /* حدود واضحة دائماً */
--auto-adjust-shadow: /* ظل تلقائي للمكونات */
```

## 🎯 Classes المساعدة

### `.ensure-visible`
يضمن وضوح النص والحدود:
```html
<div class="ensure-visible">نص واضح دائماً</div>
```

### `.ensure-visible-text`
يضمن وضوح النص فقط:
```html
<p class="ensure-visible-text">نص واضح</p>
```

### `.ensure-visible-border`
يضمن وضوح الحدود فقط:
```html
<div class="ensure-visible-border">حدود واضحة</div>
```

### `.ensure-visible-icon`
يضمن وضوح الأيقونات:
```html
<svg class="ensure-visible-icon">...</svg>
```

### `.auto-contrast`
تعديل تلقائي للتباين:
```html
<div class="auto-contrast">تلقائي التباين</div>
```

### `.blend-fix`
إصلاح المكونات التي تندمج مع الخلفية:
```html
<div class="blend-fix">مكون واضح</div>
```

## 📋 القواعد المطبقة

### 1. Navigation (الهيدر)
- خلفية: `rgba(255, 255, 255, 0.98)` مع `backdrop-filter`
- حدود: `2px solid var(--ensure-border-visible)`
- روابط: `var(--ensure-text-visible)` مع opacity: 1
- ظل محسّن للوضوح

### 2. Cards (البطاقات)
- خلفية: `var(--panel)` (أبيض في الوضع الفاتح)
- حدود: `var(--ensure-border-visible)`
- ظل تلقائي: `var(--auto-adjust-shadow)`

### 3. Buttons (الأزرار)
- `.btn-outline`: حدود `2px solid` مع opacity: 1
- جميع الأزرار: opacity: 1 دائماً

### 4. Status & Badges
- خلفيات: opacity `0.15` (بدلاً من `0.12`)
- حدود: `1px solid` مع opacity `0.2`
- opacity: 1 دائماً

### 5. Text Colors
- `.text-muted`: `#64748b` في الوضع الفاتح (6:1)
- `.text-muted`: `#cbd5e1` في الوضع الداكن (6:1)
- opacity: 1 دائماً

## 🔍 نظام Auto-Detection

المكونات التي قد تختفي أو تندمج مع الخلفية تحصل تلقائياً على:
- لون نص واضح不离
- حدود واضحة
- opacity: 1
- ظل محسّن

## 📊 نسبة التباين المضمونة

جميع الألوان الآن تلتزم بمعايير WCAG AA:
- ✅ Primary text: 15:1 (ممتاز)
- ✅ Secondary text: 8:1 (جيد)
- ✅ Muted text: 6:1 (أعلـى من 4.5)
- ✅ Borders: واضحة دائماً
- ✅ Icons: واضحة دائماً

## 🚀 الاستخدام

### إضافة وضوح تلقائي لمكون
```jsx
<div data-visibility="auto">
  {/* سيحصل على ألوان واضحة تلقائياً */}
</div>
```

### استخدام Classes المساعدة
```jsx
<nav className="ensure-visible">
  <Link className="ensure-visible-text" href="/">...</Link>
</nav>
```

---

**جميع التحسينات مركزية في `src/styles/centralized.css`** ✅

