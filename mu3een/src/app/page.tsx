import Image from "next/image";
import Link from "next/link";
// Icons removed for performance

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
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
              className="btn-brand px-6 py-2 rounded-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
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
              className="btn btn-primary px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center justify-center"
            >
              جرب الآن مجاناً
            </Link>
            <Link 
              href="/features" 
              className="btn btn-secondary px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center justify-center"
            >
              اكتشف المميزات
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="card card-pad shadow-soft text-center" style={{contentVisibility: 'auto', containIntrinsicSize: '300px'}}>
              <div className="mx-auto mb-4 text-brand-primary text-4xl">💬</div>
              <h3 className="text-xl font-semibold mb-2">دردشة موحدة</h3>
              <p className="text-gray-600 dark:text-gray-300">
                اجمع جميع رسائل عملائك من جميع القنوات في واجهة واحدة
              </p>
            </div>
            
            <div className="card card-pad shadow-soft text-center" style={{contentVisibility: 'auto', containIntrinsicSize: '300px'}}>
              <div className="mx-auto mb-4 text-brand-primary text-4xl">👥</div>
              <h3 className="text-xl font-semibold mb-2">إدارة العملاء</h3>
              <p className="text-gray-600 dark:text-gray-300">
                تتبع تفاعلات العملاء وتاريخ المحادثات بسهولة
              </p>
            </div>
            
            <div className="card card-pad shadow-soft text-center" style={{contentVisibility: 'auto', containIntrinsicSize: '300px'}}>
              <div className="mx-auto mb-4 text-brand-primary text-4xl">📊</div>
              <h3 className="text-xl font-semibold mb-2">تقارير ذكية</h3>
              <p className="text-gray-600 dark:text-gray-300">
                احصل على تحليلات مفصلة عن أداء فريقك
              </p>
            </div>
          </div>
          {/* Infographic Section */}
          <div className="mt-16">
            {/* @ts-expect-error Server Component boundary */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="card card-pad shadow-soft">
              <h3 className="text-xl font-semibold mb-4">أثر المنصة (آخر 30 يوماً)</h3>
              <div className="h-64">
                {/* Lazy load the infographic to keep TTI fast */}
                <iframe title="stats" loading="lazy" className="w-full h-full rounded" srcdoc="<html><body style='margin:0;background:transparent'><script src='https://unpkg.com/echarts@5/dist/echarts.min.js'></script><div id='c' style='width:100%;height:100%'></div><script>var c=echarts.init(document.getElementById('c'));var x=[...Array(30)].map((_,i)=>i+1);var s=x.map(x=>Math.round(50+Math.random()*50));c.setOption({xAxis:{type:'category',data:x},yAxis:{type:'value'},grid:{left:24,right:12,top:12,bottom:24},series:[{data:s,type:'bar',itemStyle:{color:'#1e40af',borderRadius:[4,4,0,0]}}],tooltip:{}});</script></body></html>"></iframe>
              </div>
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
