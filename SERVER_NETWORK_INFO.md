# 🌐 معلومات الشبكة والسيرفر

## 📊 معلومات النظام

### نظام التشغيل
- **OS:** Ubuntu 24.04.3 LTS (Noble Numbat)
- **البيئة:** Docker Container
- **تاريخ التحقق:** 2025-01-20

---

## 🔌 معلومات الشبكة

### IP المحلي (Docker Network)
```
172.30.0.2  (Docker bridge network)
172.17.0.1  (Docker default bridge)
```

### IP العام (Public IP)
```
3.20.101.183
```

---

## ❌ Tailscale

### الحالة الحالية
**Tailscale غير مثبت** على هذا السيرفر/Container

---

## 💡 إذا أردت تثبيت Tailscale

### الخيار 1: تثبيت على Container

```bash
# تثبيت Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# تفعيل Tailscale
sudo tailscale up

# عرض الحالة
tailscale status

# عرض IP الخاص في Tailscale network
tailscale ip
```

### الخيار 2: تثبيت على Host (الأفضل للـ Containers)

إذا كنت تعمل داخل Docker container، من الأفضل تثبيت Tailscale على الـ Host machine بدلاً من Container:

```bash
# على Host machine
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# ثم ربط Container بـ Host network أو استخدام Tailscale proxy
```

### الخيار 3: استخدام Tailscale Docker Image

```yaml
# docker-compose.yml
version: '3.8'
services:
  tailscale:
    image: tailscale/tailscale:latest
    volumes:
      - ./tailscale:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      - TS_AUTHKEY=${TAILSCALE_AUTH_KEY}
      - TS_HOSTNAME=cursor-server
    network_mode: "host"
```

---

## 📝 ملاحظات مهمة

1. **Docker Container:** نحن داخل Docker container، لذلك:
   - IP المحلي (172.30.0.2) خاص بـ Docker network
   - قد تحتاج لتثبيت Tailscale على Host أو استخدام host network mode

2. **Public IP:** IP العام (3.20.101.183) هو IP السيرفر الرئيسي

3. **Tailscale Installation:** 
   - يتطلب صلاحيات root/admin
   - يحتاج تفعيل (authentication)
   - يعمل بشكل أفضل على Host machine للـ containers

---

## 🔗 روابط مفيدة

- [Tailscale Installation Guide](https://tailscale.com/download/linux)
- [Tailscale in Docker](https://tailscale.com/kb/1282/docker)
- [Tailscale for Servers](https://tailscale.com/kb/1044/cloud-sync)

---

**آخر تحديث:** 2025-01-20
