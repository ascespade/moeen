# تعليمات الاتصال من خادم Amazon إلى هذا الخادم

## معلومات الخادم المستهدف
- **عنوان IP العام**: `3.228.249.171`
- **اسم الخادم**: `cursor`
- **المستخدم**: `ubuntu`
- **المنفذ**: `22`

## المفتاح الخاص للاتصال
```bash
# انسخ المفتاح الخاص التالي إلى خادم Amazon في الملف ~/.ssh/amazon_server_key
```

## خطوات الاتصال من خادم Amazon:

### 1. انسخ المفتاح الخاص إلى خادم Amazon:
```bash
# على خادم Amazon، أنشئ الملف:
nano ~/.ssh/amazon_server_key

# ثم انسخ محتوى المفتاح الخاص إليه
```

### 2. اجعل المفتاح آمن:
```bash
chmod 600 ~/.ssh/amazon_server_key
```

### 3. اختبر الاتصال:
```bash
ssh -i ~/.ssh/amazon_server_key ubuntu@3.228.249.171
```

### 4. أو استخدم SSH config:
```bash
# أنشئ ملف ~/.ssh/config على خادم Amazon:
nano ~/.ssh/config

# أضف المحتوى التالي:
Host cursor-server
    HostName 3.228.249.171
    User ubuntu
    IdentityFile ~/.ssh/amazon_server_key
    Port 22
    StrictHostKeyChecking no
```

### 5. الاتصال باستخدام SSH config:
```bash
ssh cursor-server
```

## نصائح مهمة:
- تأكد من أن Security Group في AWS يسمح بالاتصال الصادر على المنفذ 22
- تأكد من أن هذا الخادم متاح للاتصالات الواردة
- استخدم المفتاح الصحيح للاتصال الآمن
