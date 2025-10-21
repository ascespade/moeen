'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Stethoscope,
  Star,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface DynamicDoctorsListProps {
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
}

interface Doctor {
  id: string;
  public_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  specialization: string;
  phone: string;
  email: string;
  license_number: string;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  qualifications: string[];
  bio: string;
  working_hours: any;
  languages: string[];
  experience_years: number;
  user_info?: {
    user_id: string;
    user_name: string;
    user_email: string;
    user_role: string;
    last_login: string;
    timezone: string;
    language: string;
  };
}

export default function DynamicDoctorsList({
  className,
  showFilters = true,
  maxItems,
}: DynamicDoctorsListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, selectedSpecialization, selectedLanguage]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        '/api/dynamic-data/doctors?include_users=true'
      );
      const data = await response.json();

      if (data.doctors) {
        setDoctors(data.doctors);
      } else {
        setError('لم يتم العثور على أطباء في قاعدة البيانات');
      }
    } catch (err) {
      setError('فشل في تحميل قائمة الأطباء');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch =
        doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.bio?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization =
        selectedSpecialization === 'all' ||
        doctor.specialization
          ?.toLowerCase()
          .includes(selectedSpecialization.toLowerCase());

      const matchesLanguage =
        selectedLanguage === 'all' ||
        doctor.languages?.includes(selectedLanguage);

      return matchesSearch && matchesSpecialization && matchesLanguage;
    });

    // تطبيق الحد الأقصى للعناصر إذا تم تحديده
    if (maxItems && maxItems > 0) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredDoctors(filtered);
  };

  // الحصول على التخصصات الفريدة
  const specializations = Array.from(
    new Set(doctors.map(doctor => doctor.specialization).filter(Boolean))
  );

  // الحصول على اللغات الفريدة
  const languages = Array.from(
    new Set(doctors.flatMap(doctor => doctor.languages || []))
  );

  const formatWorkingHours = (workingHours: any) => {
    if (!workingHours || typeof workingHours !== 'object') return 'غير محدد';

    const entries = Object.entries(workingHours);
    if (entries.length === 0) return 'غير محدد';

    return entries.map(([day, hours]) => `${day}: ${hours}`).join(', ');
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <RefreshCw className='h-8 w-8 animate-spin' />
        <span className='ml-2'>جاري تحميل قائمة الأطباء...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <AlertTriangle className='h-8 w-8 text-red-500 mx-auto mb-2' />
        <p className='text-red-500 mb-4'>{error}</p>
        <Button onClick={fetchDoctors}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* الفلاتر */}
      {showFilters && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Input
                placeholder='البحث في الأطباء...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='flex-1'
              />

              <Select
                value={selectedSpecialization}
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='التخصص' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>جميع التخصصات</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='اللغة' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>جميع اللغات</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={fetchDoctors} variant='outline'>
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* قائمة الأطباء */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredDoctors.map(doctor => (
          <Card key={doctor.id} className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Stethoscope className='h-5 w-5 text-blue-600' />
                {doctor.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* المعلومات الأساسية */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='secondary'>{doctor.specialization}</Badge>
                    <Badge variant={doctor.is_active ? 'primary' : 'secondary'}>
                      {doctor.is_active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>

                  {doctor.rating > 0 && (
                    <div className='flex items-center gap-1'>
                      <Star className='h-4 w-4 text-yellow-500 fill-current' />
                      <span className='text-sm font-medium'>
                        {doctor.rating}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        ({doctor.total_reviews} تقييم)
                      </span>
                    </div>
                  )}
                </div>

                {/* معلومات الاتصال */}
                <div className='space-y-2'>
                  {doctor.phone && (
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-muted-foreground' />
                      <a
                        href={`tel:${doctor.phone}`}
                        className='text-sm text-primary hover:underline'
                      >
                        {doctor.phone}
                      </a>
                    </div>
                  )}

                  {doctor.email && (
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <a
                        href={`mailto:${doctor.email}`}
                        className='text-sm text-primary hover:underline'
                      >
                        {doctor.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* الخبرة والترخيص */}
                <div className='space-y-2'>
                  {doctor.experience_years && (
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>
                        {doctor.experience_years} سنة خبرة
                      </span>
                    </div>
                  )}

                  {doctor.license_number && (
                    <div className='text-sm text-muted-foreground'>
                      <strong>الترخيص:</strong> {doctor.license_number}
                    </div>
                  )}
                </div>

                {/* المؤهلات */}
                {doctor.qualifications && doctor.qualifications.length > 0 && (
                  <div>
                    <h4 className='text-sm font-semibold mb-2'>المؤهلات</h4>
                    <div className='flex flex-wrap gap-1'>
                      {doctor.qualifications.slice(0, 3).map((qual, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {qual}
                        </Badge>
                      ))}
                      {doctor.qualifications.length > 3 && (
                        <Badge variant='secondary' className='text-xs'>
                          +{doctor.qualifications.length - 3} أخرى
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* اللغات */}
                {doctor.languages && doctor.languages.length > 0 && (
                  <div>
                    <h4 className='text-sm font-semibold mb-2'>اللغات</h4>
                    <div className='flex flex-wrap gap-1'>
                      {doctor.languages.map((lang, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* ساعات العمل */}
                {doctor.working_hours &&
                  Object.keys(doctor.working_hours).length > 0 && (
                    <div>
                      <h4 className='text-sm font-semibold mb-2'>
                        ساعات العمل
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {formatWorkingHours(doctor.working_hours)}
                      </p>
                    </div>
                  )}

                {/* السيرة الذاتية */}
                {doctor.bio && (
                  <div>
                    <h4 className='text-sm font-semibold mb-2'>نبذة</h4>
                    <p className='text-sm text-muted-foreground line-clamp-3'>
                      {doctor.bio}
                    </p>
                  </div>
                )}

                {/* معلومات المستخدم */}
                {doctor.user_info && (
                  <div className='mt-4 p-3 bg-muted rounded-lg'>
                    <div className='flex items-center gap-2 mb-2'>
                      <User className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm font-semibold'>
                        حساب المستخدم
                      </span>
                    </div>
                    <div className='text-xs text-muted-foreground space-y-1'>
                      <p>
                        <strong>الاسم:</strong> {doctor.user_info.user_name}
                      </p>
                      <p>
                        <strong>الدور:</strong> {doctor.user_info.user_role}
                      </p>
                      {doctor.user_info.last_login && (
                        <p>
                          <strong>آخر دخول:</strong>{' '}
                          {new Date(
                            doctor.user_info.last_login
                          ).toLocaleDateString('ar-SA')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* رسالة في حالة عدم وجود أطباء */}
      {filteredDoctors.length === 0 && !loading && (
        <Card>
          <CardContent className='p-8 text-center'>
            <Stethoscope className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>لا توجد نتائج</h3>
            <p className='text-muted-foreground mb-4'>
              لم يتم العثور على أطباء يطابقون معايير البحث
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('all');
                setSelectedLanguage('all');
              }}
            >
              إعادة تعيين الفلاتر
            </Button>
          </CardContent>
        </Card>
      )}

      {/* إحصائيات */}
      {doctors.length > 0 && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between text-sm text-muted-foreground'>
              <span>
                عرض {filteredDoctors.length} من {doctors.length} طبيب
              </span>
              <span>
                التخصصات: {specializations.length} | اللغات: {languages.length}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
