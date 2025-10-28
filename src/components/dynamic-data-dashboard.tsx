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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  RefreshCw,
  Users,
  UserCheck,
  Stethoscope,
  Phone,
  Settings,
} from 'lucide-react';

interface DynamicDataProps {
  className?: string;
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

interface Patient {
  id: string;
  public_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
  allergies: string;
  insurance_provider: string;
  insurance_number: string;
  medications: string[];
  blood_type: string;
  preferred_language: string;
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

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  timezone: string;
  language: string;
  avatar_url: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: string;
  priority: number;
  is_available_24_7: boolean;
  working_hours: any;
  notes: string;
  is_active: boolean;
}

interface CenterInfo {
  id: string;
  name: string;
  name_en: string;
  description: string;
  phone: string;
  email: string;
  emergency_phone: string;
  admin_phone: string;
  city: string;
  services: string[];
  specialties: string[];
  working_hours: any;
  social_media: any;
}

export default function DynamicDataDashboard({ className }: DynamicDataProps) {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>('all');

  // جلب جميع البيانات الديناميكية
  const fetchDynamicData = async () => {
    try {
      setLoading(true);

      // جلب جميع البيانات في طلب واحد
      const response = await fetch('/api/dynamic-data?type=all');
      const data = await response.json();

      if (data.doctors) setDoctors(data.doctors);
      if (data.patients) setPatients(data.patients);
      if (data.staff) setStaff(data.staff);
      if (data.emergency_contacts)
        setEmergencyContacts(data.emergency_contacts);
      if (data.center_info) setCenterInfo(data.center_info);
    } catch (error) {
      console.error('Error fetching dynamic data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicData();
  }, []);

  // فلترة الأطباء
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === 'all' ||
      doctor.specialization
        ?.toLowerCase()
        .includes(selectedSpecialization.toLowerCase());

    return matchesSearch && matchesSpecialization;
  });

  // فلترة المرضى
  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // فلترة الموظفين
  const filteredStaff = staff.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || member.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // الحصول على التخصصات الفريدة
  const specializations = Array.from(
    new Set(doctors.map(doctor => doctor.specialization).filter(Boolean))
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <RefreshCw className='h-8 w-8 animate-spin' />
        <span className='ml-2'>جاري تحميل البيانات...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* معلومات المركز */}
      {centerInfo && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              معلومات المركز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <h3 className='font-semibold'>{centerInfo.name}</h3>
                <p className='text-sm text-muted-foreground'>
                  {centerInfo.description}
                </p>
              </div>
              <div>
                <p className='text-sm'>
                  <strong>الهاتف:</strong> {centerInfo.phone}
                </p>
                <p className='text-sm'>
                  <strong>البريد:</strong> {centerInfo.email}
                </p>
              </div>
              <div>
                <p className='text-sm'>
                  <strong>الطوارئ:</strong> {centerInfo.emergency_phone}
                </p>
                <p className='text-sm'>
                  <strong>المدير:</strong> {centerInfo.admin_phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* جهات الاتصال الطارئة */}
      {emergencyContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Phone className='h-5 w-5' />
              جهات الاتصال الطارئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {emergencyContacts.map(contact => (
                <div key={contact.id} className='p-4 border rounded-lg'>
                  <h4 className='font-semibold'>{contact.name}</h4>
                  <p className='text-sm text-muted-foreground'>
                    {contact.phone}
                  </p>
                  <Badge
                    variant={contact.type === 'medical' ? 'error' : 'secondary'}
                  >
                    {contact.type}
                  </Badge>
                  {contact.is_available_24_7 && (
                    <Badge variant='secondary' className='ml-2'>
                      24/7
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue='doctors' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='doctors'>الأطباء</TabsTrigger>
          <TabsTrigger value='patients'>المرضى</TabsTrigger>
          <TabsTrigger value='staff'>الموظفين</TabsTrigger>
          <TabsTrigger value='stats'>الإحصائيات</TabsTrigger>
        </TabsList>

        {/* تبويب الأطباء */}
        <TabsContent value='doctors' className='space-y-4'>
          <div className='flex gap-4'>
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
            <Button onClick={fetchDynamicData} variant='outline'>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredDoctors.map(doctor => (
              <Card key={doctor.id}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Stethoscope className='h-5 w-5' />
                    {doctor.full_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <strong>التخصص:</strong> {doctor.specialization}
                    </p>
                    <p className='text-sm'>
                      <strong>الهاتف:</strong> {doctor.phone}
                    </p>
                    <p className='text-sm'>
                      <strong>البريد:</strong> {doctor.email}
                    </p>
                    <p className='text-sm'>
                      <strong>الترخيص:</strong> {doctor.license_number}
                    </p>
                    <p className='text-sm'>
                      <strong>الخبرة:</strong> {doctor.experience_years} سنة
                    </p>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={doctor.is_active ? 'primary' : 'secondary'}
                      >
                        {doctor.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                      {doctor.rating > 0 && (
                        <Badge variant='secondary'>
                          ⭐ {doctor.rating} ({doctor.total_reviews})
                        </Badge>
                      )}
                    </div>
                    {doctor.user_info && (
                      <div className='mt-2 p-2 bg-muted rounded'>
                        <p className='text-xs'>
                          <strong>المستخدم:</strong>{' '}
                          {doctor.user_info.user_name}
                        </p>
                        <p className='text-xs'>
                          <strong>الدور:</strong> {doctor.user_info.user_role}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* تبويب المرضى */}
        <TabsContent value='patients' className='space-y-4'>
          <div className='flex gap-4'>
            <Input
              placeholder='البحث في المرضى...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='flex-1'
            />
            <Button onClick={fetchDynamicData} variant='outline'>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredPatients.map(patient => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='h-5 w-5' />
                    {patient.full_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <strong>الهاتف:</strong> {patient.phone}
                    </p>
                    <p className='text-sm'>
                      <strong>البريد:</strong> {patient.email}
                    </p>
                    <p className='text-sm'>
                      <strong>تاريخ الميلاد:</strong> {patient.date_of_birth}
                    </p>
                    <p className='text-sm'>
                      <strong>الجنس:</strong> {patient.gender}
                    </p>
                    <p className='text-sm'>
                      <strong>التأمين:</strong> {patient.insurance_provider}
                    </p>
                    <p className='text-sm'>
                      <strong>فصيلة الدم:</strong> {patient.blood_type}
                    </p>
                    {patient.emergency_contact_name && (
                      <div className='mt-2 p-2 bg-muted rounded'>
                        <p className='text-xs'>
                          <strong>جهة الطوارئ:</strong>{' '}
                          {patient.emergency_contact_name}
                        </p>
                        <p className='text-xs'>
                          <strong>هاتف الطوارئ:</strong>{' '}
                          {patient.emergency_contact_phone}
                        </p>
                      </div>
                    )}
                    {patient.user_info && (
                      <div className='mt-2 p-2 bg-muted rounded'>
                        <p className='text-xs'>
                          <strong>المستخدم:</strong>{' '}
                          {patient.user_info.user_name}
                        </p>
                        <p className='text-xs'>
                          <strong>الدور:</strong> {patient.user_info.user_role}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* تبويب الموظفين */}
        <TabsContent value='staff' className='space-y-4'>
          <div className='flex gap-4'>
            <Input
              placeholder='البحث في الموظفين...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='flex-1'
            />
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='الدور' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع الأدوار</SelectItem>
                <SelectItem value='admin'>مدير</SelectItem>
                <SelectItem value='manager'>مدير فرعي</SelectItem>
                <SelectItem value='agent'>وكيل</SelectItem>
                <SelectItem value='supervisor'>مشرف</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchDynamicData} variant='outline'>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredStaff.map(member => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <UserCheck className='h-5 w-5' />
                    {member.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <strong>البريد:</strong> {member.email}
                    </p>
                    <p className='text-sm'>
                      <strong>الهاتف:</strong> {member.phone}
                    </p>
                    <p className='text-sm'>
                      <strong>المنطقة الزمنية:</strong> {member.timezone}
                    </p>
                    <p className='text-sm'>
                      <strong>اللغة:</strong> {member.language}
                    </p>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={member.is_active ? 'primary' : 'secondary'}
                      >
                        {member.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                      <Badge variant='secondary'>{member.role}</Badge>
                    </div>
                    {member.last_login && (
                      <p className='text-xs text-muted-foreground'>
                        آخر دخول:{' '}
                        {new Date(member.last_login).toLocaleDateString(
                          'ar-SA'
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* تبويب الإحصائيات */}
        <TabsContent value='stats' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center'>
                  <Stethoscope className='h-8 w-8 text-blue-600' />
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      الأطباء
                    </p>
                    <p className='text-2xl font-bold'>{doctors.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center'>
                  <Users className='h-8 w-8 text-green-600' />
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      المرضى
                    </p>
                    <p className='text-2xl font-bold'>{patients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center'>
                  <UserCheck className='h-8 w-8 text-purple-600' />
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      الموظفين
                    </p>
                    <p className='text-2xl font-bold'>{staff.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center'>
                  <Phone className='h-8 w-8 text-red-600' />
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      جهات الطوارئ
                    </p>
                    <p className='text-2xl font-bold'>
                      {emergencyContacts.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
