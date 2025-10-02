@echo off
REM اختصارات سريعة للاتصال بالسيرفرات
REM Quick connection shortcuts

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    🚀 اختصارات الاتصال السريعة                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

if "%1"=="cursor" (
    echo 🌐 الاتصال بسيرفر Cursor...
    powershell -ExecutionPolicy Bypass -File "connect_cursor.ps1"
    goto :end
)

if "%1"=="aws" (
    echo ☁️ الاتصال بسيرفر Amazon...
    powershell -ExecutionPolicy Bypass -File "connect_aws.ps1"
    goto :end
)

if "%1"=="test" (
    echo 🔧 اختبار جميع الاتصالات...
    echo.
    echo اختبار سيرفر Cursor:
    powershell -ExecutionPolicy Bypass -File "connect_cursor.ps1" -Test
    echo.
    echo اختبار سيرفر Amazon:
    powershell -ExecutionPolicy Bypass -File "connect_aws.ps1" -Test
    goto :end
)

if "%1"=="web" (
    echo 🌐 فتح خدمات الويب...
    powershell -ExecutionPolicy Bypass -File "connect_aws.ps1" -Web
    goto :end
)

if "%1"=="help" (
    goto :help
)

if "%1"=="" (
    goto :help
)

echo ❌ خيار غير صحيح: %1
echo.

:help
echo 📋 الاستخدام:
echo   quick_connect cursor    - الاتصال بسيرفر Cursor
echo   quick_connect aws       - الاتصال بسيرفر Amazon
echo   quick_connect test      - اختبار جميع الاتصالات
echo   quick_connect web       - فتح خدمة الويب
echo   quick_connect help      - عرض هذه المساعدة
echo.
echo 💡 أمثلة:
echo   quick_connect cursor
echo   quick_connect aws
echo   quick_connect test

:end
echo.
pause
