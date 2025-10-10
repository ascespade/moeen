'use client';

import React from 'react';
import { Calendar, Users, FileText, MessageCircle, Phone, Mail, MapPin, Clock, Heart, Shield, Brain, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'تنظيم المواعيد',
      description: 'نظام متقدم لإدارة المواعيد مع إشعارات ذكية وتذكيرات تلقائية',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'سجل المرضى',
      description: 'إدارة شاملة لسجلات المرضى مع تتبع التاريخ الطبي والاحتياجات الخاصة',
      color: 'text-green-600'
    },
    {
      icon: FileText,
      title: 'التقارير الذكية',
      description: 'تقارير مفصلة وإحصائيات دقيقة لتحسين الخدمات المقدمة',
      color: 'text-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'الشات بوت الذكي',
      description: 'معين - مساعد ذكي متخصص في دعم ذوي الهمم والإعاقات',
      color: 'text-orange-600'
    }
  ];

  const services = [
    {
      title: 'العلاج الطبيعي',
      description: 'برامج علاجية متخصصة لتحسين الحركة والقدرات البدنية',
      icon: Heart
    },
    {
      title: 'العلاج الوظيفي',
      description: 'تدريب على المهارات اليومية وتحسين الاستقلالية',
      icon: Shield
    },
    {
      title: 'العلاج النفسي',
      description: 'دعم نفسي واجتماعي للمرضى وأسرهم',
      icon: Brain
    },
    {
      title: 'الاستشارات الطبية',
      description: 'استشارات طبية متخصصة من أطباء مؤهلين',
      icon: Star
    }
  ];

  const testimonials = [
    {
      name: 'أحمد محمد',
      role: 'والد طفل',
      content: 'مركز الهمم غير حياة ابني للأفضل. الخدمات المقدمة ممتازة والطاقم متخصص جداً.',
      rating: 5
    },
    {
      name: 'فاطمة علي',
      role: 'مريضة',
      content: 'أشكر المركز على الدعم المستمر والرعاية المتميزة. أنصح الجميع بالتعامل معهم.',
      rating: 5
    },
    {
      name: 'محمد حسن',
      role: 'ولي أمر',
      content: 'الخدمات المقدمة تتجاوز التوقعات. المركز يهتم بكل التفاصيل الصغيرة.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="mr-4">
                <h1 className="text-2xl font-bold text-gray-900">مركز الهمم</h1>
                <p className="text-sm text-gray-600">دعم ذوي الهمم والإعاقات</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <Link href="#home" className="text-gray-900 hover:text-blue-600">الرئيسية</Link>
              <Link href="#services" className="text-gray-600 hover:text-blue-600">الخدمات</Link>
              <Link href="#appointments" className="text-gray-600 hover:text-blue-600">المواعيد</Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600">تواصل معنا</Link>
            </nav>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button variant="outline" size="sm">
                تسجيل الدخول
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                حجز موعد
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              مركز الهمم
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              مركز متخصص في دعم ذوي الهمم والإعاقات، مع إدارة مواعيد، محادثات، وسجلات المرضى
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Calendar className="w-5 h-5 ml-2" />
                حجز موعد الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <MessageCircle className="w-5 h-5 ml-2" />
                تحدث مع معين
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              مميزاتنا الرئيسية
            </h2>
            <p className="text-xl text-gray-600">
              نقدم خدمات متطورة ومتخصصة لدعم ذوي الهمم
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدماتنا المتخصصة
            </h2>
            <p className="text-xl text-gray-600">
              نقدم مجموعة شاملة من الخدمات الطبية والعلاجية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              آراء عملائنا
            </h2>
            <p className="text-xl text-gray-600">
              ما يقوله عملاؤنا عن خدماتنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-300">
              نحن هنا لمساعدتك في أي وقت
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">الهاتف</h3>
                <p className="text-gray-300">+966581421483</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">البريد الإلكتروني</h3>
                <p className="text-gray-300">info@alhemmamcenter.com.sa</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">العنوان</h3>
                <p className="text-gray-300">جدة، المملكة العربية السعودية</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="mr-3">
                  <h3 className="text-xl font-bold">مركز الهمم</h3>
                </div>
              </div>
              <p className="text-gray-300">
                مركز متخصص في دعم ذوي الهمم والإعاقات، نقدم خدمات شاملة ومتطورة.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="#home" className="text-gray-300 hover:text-white">الرئيسية</Link></li>
                <li><Link href="#services" className="text-gray-300 hover:text-white">الخدمات</Link></li>
                <li><Link href="#appointments" className="text-gray-300 hover:text-white">المواعيد</Link></li>
                <li><Link href="#contact" className="text-gray-300 hover:text-white">تواصل معنا</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">الخدمات</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">العلاج الطبيعي</li>
                <li className="text-gray-300">العلاج الوظيفي</li>
                <li className="text-gray-300">العلاج النفسي</li>
                <li className="text-gray-300">الاستشارات الطبية</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">معلومات الاتصال</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-400 ml-2" />
                  <span className="text-gray-300">+966581421483</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-400 ml-2" />
                  <span className="text-gray-300">info@alhemmamcenter.com.sa</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-blue-400 ml-2" />
                  <span className="text-gray-300">جدة، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 مركز الهمم. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;