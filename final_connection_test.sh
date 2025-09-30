#!/bin/bash

echo "=== اختبار نهائي للاتصال من خادم Amazon ==="
echo ""

# معلومات الخادم
echo "معلومات الخادم الحالي:"
echo "- عنوان IP العام: 3.228.249.171"
echo "- اسم الخادم: cursor"
echo "- المستخدم: ubuntu"
echo "- المنفذ: 22"
echo ""

# فحص خدمة SSH
echo "فحص خدمة SSH:"
if systemctl is-active --quiet ssh 2>/dev/null || service ssh status >/dev/null 2>&1; then
    echo "✅ خدمة SSH تعمل"
else
    echo "❌ خدمة SSH لا تعمل"
fi

# فحص المفاتيح
echo ""
echo "فحص المفاتيح:"
if [ -f ~/.ssh/authorized_keys ]; then
    echo "✅ ملف authorized_keys موجود"
    echo "عدد المفاتيح: $(wc -l < ~/.ssh/authorized_keys)"
else
    echo "❌ ملف authorized_keys غير موجود"
fi

# فحص صلاحيات الملفات
echo ""
echo "فحص صلاحيات الملفات:"
if [ -r ~/.ssh/authorized_keys ] && [ -w ~/.ssh/authorized_keys ]; then
    echo "✅ صلاحيات authorized_keys صحيحة"
else
    echo "❌ صلاحيات authorized_keys غير صحيحة"
fi

echo ""
echo "=== تعليمات الاتصال من خادم Amazon ==="
echo ""
echo "1. انسخ المفتاح الخاص التالي إلى خادم Amazon:"
echo ""
echo "-----BEGIN OPENSSH PRIVATE KEY-----"
echo "b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn"
echo "NhAAAAAwEAAQAAAgEAqcftXH4VRvYbl+KrwuOHLGDibABd+vDuuP2JxVADG6V5cpRiJSlB"
echo "VBKV9BYSQ3HHkW7Fqb19LrSg0UBQ3t6Iqu3xrLxxS47W3BAvStSV6arqCCbUL2vgy0fo7y"
echo "PCQg8h5R+7s6ns9CxnLlrseI0Ev3YIFFsyrtJcKazAs4aoLyGNIO9N8uPTKpuAoxFvQ7s9"
echo "fEhnRX1er2frBISNoLNAtHopmPhVtWU/hySHbzK2oOzE4N5yup6unnxLmTxnXKpOfBWJgI"
echo "NRJ/Nzsclul+tkftWQ9ZLY/oUP63Pj5kLDbDuuqZQFmqQtEFarWUK8c2LyutSZU48e3Xb+"
echo "d/5bk0oiZa/UBff6joUexFNPMO5KMpMch9DhFe+bqBQsHcf0as5llaeEExmEx94iCXt/o5"
echo "Mvptl2BNUxsTusOgNq7YzL15LeH2Z+gC+TfK1mMI7ms0y6vz0lWpkD2Dus5FNqfZfZguVj"
echo "1pMPCTEOv/UkZnop17vrA8JQ8VFayaMfSaOklREh81WiyvaLLYGu3jYc9TVmSQMA5kW7JO"
echo "yE2b7dt+LJjdEiHqGwxF21rQ5WfRGx2QdoZRZQYllTT/s0BEPiyGEroazcTWPDB+KVUNpL"
echo "envX0i8Ab/wgBwH8X0HQ9W6pXlLpJwkvV8O21eFH4zDZDt577LTT4YBFb2xsYEpNf7lWtw"
echo "MAAAdISExJ3UhMSd0AAAAHc3NoLXJzYQAAAgEAqcftXH4VRvYbl+KrwuOHLGDibABd+vDu"
echo "uP2JxVADG6V5cpRiJSlBVBKV9BYSQ3HHkW7Fqb19LrSg0UBQ3t6Iqu3xrLxxS47W3BAvSt"
echo "SV6arqCCbUL2vgy0fo7yPCQg8h5R+7s6ns9CxnLlrseI0Ev3YIFFsyrtJcKazAs4aoLyGN"
echo "IO9N8uPTKpuAoxFvQ7s9fEhnRX1er2frBISNoLNAtHopmPhVtWU/hySHbzK2oOzE4N5yup"
echo "6unnxLmTxnXKpOfBWJgINRJ/Nzsclul+tkftWQ9ZLY/oUP63Pj5kLDbDuuqZQFmqQtEFar"
echo "WUK8c2LyutSZU48e3Xb+d/5bk0oiZa/UBff6joUexFNPMO5KMpMch9DhFe+bqBQsHcf0as"
echo "5llaeEExmEx94iCXt/o5Mvptl2BNUxsTusOgNq7YzL15LeH2Z+gC+TfK1mMI7ms0y6vz0l"
echo "WpkD2Dus5FNqfZfZguVj1pMPCTEOv/UkZnop17vrA8JQ8VFayaMfSaOklREh81WiyvaLLY"
echo "Gu3jYc9TVmSQMA5kW7JOyE2b7dt+LJjdEiHqGwxF21rQ5WfRGx2QdoZRZQYllTT/s0BEPi"
echo "yGEroazcTWPDB+KVUNpLenvX0i8Ab/wgBwH8X0HQ9W6pXlLpJwkvV8O21eFH4zDZDt577L"
echo "TT4YBFb2xsYEpNf7lWtwMAAAADAQABAAACABFCjGxfOv2ETojR1+FPrTHDRbFyFhvJO5Od"
echo "3tAq0q4QU/jkgdfCSmxoGUt/pOqrWfz8dGbNpzjEzyaGsdH+cIlj+DI11BS42Dn2AUDLvN"
echo "PM9s7OV7rcbjVsQY9yJLD/hdQbtkLNDxRBoVmyj6CvwWBPeQHMxanFI+5urAZ0NYvZDtZe"
echo "zZ9YLuMBfQHW52dM1TLZz3nehW4yk89ZRGamYnkWhD0TXe87dEpiWcxhrPROLbOomaRENn"
echo "9RJoRVAjMG80SlEd35O5piowvbbP1Pxl8oifyVKa8ySsyGcxA5EFHj/V0q+ajfcN9c2D2S"
echo "TcMzN3br3wyCG8Kq8rKzLo8aNcXS9fI2J1POWjyTXSGWoUN8jPwU2HaVk0NREzYOXPDffT"
echo "JRKyyPHFBQcORO43WjKCRBb1LgNEOtu/l8ydaTSOLXLmYyB5anVsX21n4nwHxUx0Lage/0"
echo "rNp2Pcv7mLCvDVK7DCXN128tbSKNTMBslKclwRDwHNZVXh+a1pa+xLcFom68hSbdbeoBp9"
echo "fkUG6tJIJ0BPa0xhHd9XYTMpN5gRRItLnk6vbVJi/eLnc+C+LoVHrWw6GhMt3IiSCz+wpx"
echo "c3xsbfBRZ9XQ0GPGQolGK36lDkf576F0hhBmNs/yqOh3UUxZwit/xWgMp2YxBv+4c+E3pb"
echo "BI/W8fq5siyuBznOCBAAABAAfSHo3CV0CIQq4AMzvIxb+92fsuhzz+bE4i+/GGq/IWFPAe"
echo "UiWJ7vF2aUqvoBmc2rAgzuTpbwfD+wwJdUvjyDy59AXln1sKy/DKEn9iLom4EI9wq5YfFf"
echo "tPRs0RO7bFs3X9rju66csFXLvKxpkrhDCpDv42uF0wxHR4GemSfRvoEW5W3TN/YzEas04M"
echo "QgC0/Yheb6WqO6D/hxLUDs0iPiRfezIPNdNJPGTg364F79OGjkVvR/1EEpBNnejRN/EWxQ"
echo "tA2iBm+3ERei3HTNlNDrJa8YwGTWEdFBy2vJLTQKQDvOXx7KuMbFSWVdRZ+ECx3GoeX348"
echo "BeptpoesK13sEAwAAAEBAOuWkhltoQzE0Du88OXTM4pc9PvLp3YqT0B0Np+2Xq3PBT9mtf"
echo "CRalEOz8OOm3lwyzKVHeQuSySm9waP+JNqvb/GBiNs1v0sUKueTcN1TQ1+Ef3TCLlgpxEb"
echo "fVbezg899iCxgPoAcaAXLCFz31XkEjAdNqM5C3wN6futQpSt48g+HN+Ef86QRy39bsCi6+"
echo "TbLCQJABNrrhtlzqlzGm9nj+P6zWKHINVndeTJCP7Zd8VfXysg4WAQUWZU4ZsDA9AJ3nNs"
echo "1MDOcPBcFtqvlNfg3A+vHCPJSyBSGouiDhBZCn8h4VgoS3mIA3G/3lGLmI7va66KQ/yHvg"
echo "WMdWJpJumxz4MAAAEBALh9urgp1WjnPckVEQfMT/FtEnbY29jMPj5ruOk6I2VOi7R2q/nU"
echo "F1cyW8ozrVas4QJTGwYt9TgssgXkQsJC89IV/XcGzJGosUHV1YdtUsGClYxyVBQhyz4xVW"
echo "lgAYpWIEOO5NfQP5Sk0B3f6lINQqiEhO9hHee57Awb4LKTGwOh6DcRnjnMUCTcKTui19JV"
echo "JH889Sw6k0TNqPFPsUFVW8kI3MwWkiQnD41dhbqeZlwq+8Pvwy9OI1tpc+JFK/dcmDZAZG"
echo "52W7W3j7KOkAYbx1u+Bx+IzfkpINUHkhFzuvfFhHljhlOjircFa/d7sihy1InCSdvR0qJ2"
echo "JMumXA7vYoEAAAARYW1hem9uLXNlcnZlci1rZXkBAg=="
echo "-----END OPENSSH PRIVATE KEY-----"
echo ""
echo "2. اجعل المفتاح آمن:"
echo "   chmod 600 ~/.ssh/amazon_server_key"
echo ""
echo "3. اختبر الاتصال:"
echo "   ssh -i ~/.ssh/amazon_server_key ubuntu@3.228.249.171"
echo ""
echo "✅ الإعداد مكتمل! يمكن الآن الاتصال من خادم Amazon إلى هذا الخادم."
