import Image from "next/image";
import Link from "next/link";
// Icons removed for performance

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <header className="container-app px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Image
              src="/hemam-logo.jpg"
              alt="Hemam Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
              unoptimized
            />
            <span className="text-2xl font-bold text-brand-primary">مُعين</span>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/login" 
              className="px-4 py-2 text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/register" 
              className="btn-brand px-6 py-2 rounded-lg font-medium"
            >
              ابدأ الآن
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container-app px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            منصة دردشة متعددة القنوات
            <span className="block text-brand-primary">مدعومة بالذكاء الاصطناعي</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            اجمع جميع قنوات التواصل مع عملائك في مكان واحد. واتساب، تليجرام، فيسبوك، 
            إنستغرام والمزيد - كلها في منصة واحدة ذكية.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/demo" 
              className="btn-brand px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center justify-center"
            >
              جرب الآن مجاناً
            </Link>
            <Link 
              href="/features" 
              className="px-8 py-4 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
            >
              اكتشف المميزات
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="card card-pad shadow-soft text-center">
              <div className="mx-auto mb-4 text-brand-primary text-4xl">💬</div>
              <h3 className="text-xl font-semibold mb-2">دردشة موحدة</h3>
              <p className="text-gray-600 dark:text-gray-300">
                اجمع جميع رسائل عملائك من جميع القنوات في واجهة واحدة
              </p>
            </div>
            
            <div className="card card-pad shadow-soft text-center">
              <div className="mx-auto mb-4 text-brand-primary text-4xl">👥</div>
              <h3 className="text-xl font-semibold mb-2">إدارة العملاء</h3>
              <p className="text-gray-600 dark:text-gray-300">
                تتبع تفاعلات العملاء وتاريخ المحادثات بسهولة
              </p>
            </div>
            
            <div className="card card-pad shadow-soft text-center">
              <div className="mx-auto mb-4 text-brand-primary text-4xl">📊</div>
              <h3 className="text-xl font-semibold mb-2">تقارير ذكية</h3>
              <p className="text-gray-600 dark:text-gray-300">
                احصل على تحليلات مفصلة عن أداء فريقك
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container-app px-4 py-8 border-t border-brand-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse mb-4 md:mb-0">
            <Image
              src="/hemam-logo.jpg"
              alt="Hemam Logo"
              width={32}
              height={32}
              className="rounded"
              unoptimized
            />
            <span className="text-lg font-semibold text-brand-primary">مُعين</span>
          </div>
          <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-brand-primary transition-colors">الخصوصية</Link>
            <Link href="/terms" className="hover:text-brand-primary transition-colors">الشروط</Link>
            <Link href="/contact" className="hover:text-brand-primary transition-colors">اتصل بنا</Link>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-500 mt-4">
          © 2024 مُعين. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
