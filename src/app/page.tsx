'use client';
import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import DynamicContactInfo from '@/components/dynamic-contact-info';
import DynamicStats from '@/components/dynamic-stats';
import DynamicServices from '@/components/dynamic-services';
import {
  Calendar,
  Users,
  Heart,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Background Elements */}
        <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-[var(--default-default)]/5'></div>
        <div className='absolute top-20 left-20 w-72 h-72 bg-[var(--default-default)]/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-[var(--default-info)]/10 rounded-full blur-3xl'></div>

        <div className='container-app relative z-10'>
          <div className='text-center max-w-4xl mx-auto'>
            <Badge variant='info' className='mb-4 text-sm'>
              🏥 مركز طبي متخصص
            </Badge>
            <h1 className='text-5xl md:text-7xl font-bold text-foreground mb-6'>
              مركز الهمم للرعاية الصحية
            </h1>
            <h2 className='text-2xl md:text-3xl text-[var(--default-default)] mb-6'>
              رعاية شاملة لذوي الاحتياجات الخاصة
            </h2>
            <p className='text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
              نقدم خدمات طبية متخصصة وبرامج تأهيلية شاملة لضمان حياة أفضل لذوي
              الاحتياجات الخاصة مع أحدث التقنيات الطبية
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button asChild size='lg' className='btn-default'>
                <Link
                  href='/appointments'
                  data-testid='book-appointment-button'
                >
                  <Calendar className='w-5 h-5 mr-2' />
                  احجز موعدك الآن
                </Link>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/features' data-testid='learn-more-button'>
                  تعرف على المزيد
                  <ArrowRight className='w-5 h-5 mr-2' />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2'>
          <button className='w-3 h-3 rounded-full bg-[var(--default-default)]' />
        </div>
      </section>

      {/* Services Section */}
      <section id='services' className='py-20 bg-[var(--default-surface)]'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <Badge variant='success' className='mb-4'>
              خدماتنا
            </Badge>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              خدماتنا المتكاملة
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              نقدم حلولاً شاملة لإدارة المراكز الصحية مع أحدث التقنيات
            </p>
          </div>

          <DynamicServices />
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <Badge variant='warning' className='mb-4'>
              المميزات
            </Badge>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              لماذا تختار مركز الهمم؟
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              نحن نقدم أفضل الخدمات الطبية مع أحدث التقنيات
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='text-center hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='w-16 h-16 bg-[var(--default-default)]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Heart className='w-8 h-8 text-[var(--default-default)]' />
                </div>
                <CardTitle>رعاية متخصصة</CardTitle>
                <CardDescription>
                  فريق طبي متخصص في رعاية ذوي الاحتياجات الخاصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='text-left space-y-2'>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    علاج طبيعي متقدم
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    علاج وظيفي شامل
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    برامج تأهيلية مخصصة
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className='text-center hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='w-16 h-16 bg-[var(--default-info)]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Shield className='w-8 h-8 text-[var(--default-info)]' />
                </div>
                <CardTitle>تقنيات حديثة</CardTitle>
                <CardDescription>
                  أحدث الأجهزة والتقنيات الطبية المتطورة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='text-left space-y-2'>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    أجهزة تشخيص متقدمة
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    برامج تأهيل ذكية
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    متابعة إلكترونية
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className='text-center hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='w-16 h-16 bg-[var(--default-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Users className='w-8 h-8 text-[var(--default-accent)]' />
                </div>
                <CardTitle>فريق متكامل</CardTitle>
                <CardDescription>
                  فريق طبي متكامل من مختلف التخصصات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='text-left space-y-2'>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    أطباء متخصصون
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    معالجون مؤهلون
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='w-4 h-4 text-green-500 mr-2' />
                    دعم نفسي واجتماعي
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-[var(--default-surface)]'>
        <div className='container-app'>
          <DynamicStats />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <Badge variant='info' className='mb-4'>
              آراء العملاء
            </Badge>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              ماذا يقول عملاؤنا؟
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              آراء حقيقية من عائلاتنا الكريمة
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='hover:shadow-lg transition-shadow'>
              <CardContent className='pt-6'>
                <div className='flex items-center mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-muted-foreground mb-4'>
                  &quot;مركز الهمم غير حياة ابني تماماً. الفريق الطبي متخصص جداً
                  والخدمات ممتازة.&quot;
                </p>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-[var(--default-default)]/10 rounded-full flex items-center justify-center mr-3'>
                    <span className='text-[var(--default-default)] font-bold'>
                      أ
                    </span>
                  </div>
                  <div>
                    <p className='font-semibold'>أم أحمد</p>
                    <p className='text-sm text-muted-foreground'>والدة مريض</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='hover:shadow-lg transition-shadow'>
              <CardContent className='pt-6'>
                <div className='flex items-center mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-muted-foreground mb-4'>
                  &quot;التقنيات الحديثة والرعاية المتميزة جعلت ابنتي تتحسن بشكل
                  ملحوظ.&quot;
                </p>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-[var(--default-info)]/10 rounded-full flex items-center justify-center mr-3'>
                    <span className='text-[var(--default-info)] font-bold'>
                      س
                    </span>
                  </div>
                  <div>
                    <p className='font-semibold'>سارة محمد</p>
                    <p className='text-sm text-muted-foreground'>والدة مريضة</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='hover:shadow-lg transition-shadow'>
              <CardContent className='pt-6'>
                <div className='flex items-center mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-muted-foreground mb-4'>
                  &quot;فريق العمل محترف جداً والمركز مجهز بأحدث الأجهزة. أنصح
                  به بشدة.&quot;
                </p>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-[var(--default-accent)]/10 rounded-full flex items-center justify-center mr-3'>
                    <span className='text-[var(--default-accent)] font-bold'>
                      خ
                    </span>
                  </div>
                  <div>
                    <p className='font-semibold'>خالد العتيبي</p>
                    <p className='text-sm text-muted-foreground'>والد مريض</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-[var(--default-default)] to-[var(--default-info)]'>
        <div className='container-app text-center'>
          <h2 className='text-4xl font-bold text-white mb-4'>
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
            انضم إلى آلاف العائلات التي تثق في مركز الهمم للرعاية الصحية
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              asChild
              size='lg'
              className='bg-white text-[var(--default-default)] hover:bg-gray-100'
            >
              <Link href='/register' data-testid='create-account-button'>
                <Users className='w-5 h-5 mr-2' />
                إنشاء حساب مجاني
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-white text-white hover:bg-white hover:text-[var(--default-default)]'
            >
              <Link href='/contact' data-testid='contact-us-button'>
                <MessageCircle className='w-5 h-5 mr-2' />
                تواصل معنا
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Moeen Section */}
      <section className='py-20'>
        <div className='container-app'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <Badge variant='default' className='mb-4'>
                عن المركز
              </Badge>
              <h2 className='text-4xl font-bold text-foreground mb-6'>
                مركز الهمم للرعاية الصحية
              </h2>
              <p className='text-lg text-muted-foreground mb-6'>
                مركز الهمم هو مركز طبي متخصص في رعاية ذوي الاحتياجات الخاصة،
                نقدم خدمات شاملة تشمل العلاج الطبيعي والوظيفي والنطق والسمع مع
                أحدث التقنيات الطبية.
              </p>
              <p className='text-lg text-muted-foreground mb-8'>
                مع أكثر من 1000 مريض نشط و 98% معدل رضا، نحن نثق في قدرتنا على
                تحسين جودة الحياة لذوي الاحتياجات الخاصة.
              </p>
              <Button asChild size='lg' className='btn-default'>
                <Link href='/about' data-testid='learn-about-button'>
                  تعرف على المزيد
                  <ArrowRight className='w-5 h-5 mr-2' />
                </Link>
              </Button>
            </div>
            <div className='relative'>
              <div className='aspect-square bg-gradient-to-br from-[var(--default-default)]/20 to-[var(--default-info)]/20 rounded-2xl flex items-center justify-center'>
                <div className='text-8xl'>🏥</div>
              </div>
              <div className='absolute -top-4 -right-4 w-24 h-24 bg-[var(--default-default)]/20 rounded-full blur-xl'></div>
              <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--default-info)]/20 rounded-full blur-xl'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Dynamic */}
      <section className='py-20 bg-[var(--default-surface)]'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <Badge variant='success' className='mb-4'>
              تواصل معنا
            </Badge>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              نحن هنا لمساعدتك
            </h2>
            <p className='text-xl text-muted-foreground'>
              تواصل معنا في أي وقت للحصول على استشارة مجانية
            </p>
          </div>

          <DynamicContactInfo />
        </div>
      </section>
    </div>
  );
}
