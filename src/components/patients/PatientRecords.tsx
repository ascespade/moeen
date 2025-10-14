'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, FileText, Plus, Edit, Trash2, Search, Filter, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationalId: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  specialNeeds: string[];
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  createdAt: string;
  lastVisit: string;
  status: 'active' | 'inactive' | 'archived';
}

interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  attachments: string[];
  followUpRequired: boolean;
  followUpDate?: string;
}

const PatientRecords: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);

  // نموذج إضافة مريض جديد
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    nationalId: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalHistory: [] as string[],
    allergies: [] as string[],
    medications: [] as string[],
    specialNeeds: [] as string[],
    insuranceInfo: {
      provider: '',
      policyNumber: '',
      expiryDate: ''
    }
  });

  // نموذج إضافة سجل طبي
  const [newRecord, setNewRecord] = useState({
    date: '',
    doctorName: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUpRequired: false,
    followUpDate: ''
  });

  useEffect(() => {
    loadPatients();
    loadMedicalRecords();
  }, []);

  const loadPatients = async () => {
    // محاكاة تحميل المرضى من قاعدة البيانات
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'أحمد محمد الأحمد',
        phone: '+966501234567',
        email: 'ahmed@example.com',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        nationalId: '1234567890',
        address: 'جدة، المملكة العربية السعودية',
        emergencyContact: {
          name: 'فاطمة الأحمد',
          phone: '+966502345678',
          relationship: 'أخت'
        },
        medicalHistory: ['سكري', 'ضغط دم'],
        allergies: ['البنسلين'],
        medications: ['ميتفورمين', 'أملوديبين'],
        specialNeeds: ['كرسي متحرك'],
        insuranceInfo: {
          provider: 'شركة التأمين الوطنية',
          policyNumber: 'INS-001',
          expiryDate: '2024-12-31'
        },
        createdAt: '2024-01-01T00:00:00Z',
        lastVisit: '2024-01-10T00:00:00Z',
        status: 'active'
      },
      {
        id: '2',
        name: 'فاطمة علي السالم',
        phone: '+966502345678',
        email: 'fatima@example.com',
        dateOfBirth: '1985-08-22',
        gender: 'female',
        nationalId: '0987654321',
        address: 'الرياض، المملكة العربية السعودية',
        emergencyContact: {
          name: 'محمد السالم',
          phone: '+966503456789',
          relationship: 'زوج'
        },
        medicalHistory: ['ربو', 'حساسية'],
        allergies: ['الغبار', 'اللقاح'],
        medications: ['فينتولين', 'كلاريتين'],
        specialNeeds: ['مترجم لغة الإشارة'],
        insuranceInfo: {
          provider: 'شركة التأمين التعاوني',
          policyNumber: 'INS-002',
          expiryDate: '2024-11-30'
        },
        createdAt: '2024-01-02T00:00:00Z',
        lastVisit: '2024-01-12T00:00:00Z',
        status: 'active'
      }
    ];
    setPatients(mockPatients);
  };

  const loadMedicalRecords = async () => {
    // محاكاة تحميل السجلات الطبية
    const mockRecords: MedicalRecord[] = [
      {
        id: '1',
        patientId: '1',
        date: '2024-01-10',
        doctorName: 'د. سارة أحمد',
        diagnosis: 'فحص دوري',
        treatment: 'فحص شامل، تحاليل دم',
        notes: 'المريض في حالة جيدة، يحتاج متابعة دورية',
        attachments: ['lab-results.pdf', 'x-ray.jpg'],
        followUpRequired: true,
        followUpDate: '2024-02-10'
      },
      {
        id: '2',
        patientId: '2',
        date: '2024-01-12',
        doctorName: 'د. محمد حسن',
        diagnosis: 'علاج طبيعي للظهر',
        treatment: 'تمارين تقوية، جلسات علاج طبيعي',
        notes: 'تحسن ملحوظ في الحركة، يحتاج استمرار العلاج',
        attachments: ['therapy-plan.pdf'],
        followUpRequired: true,
        followUpDate: '2024-01-26'
      }
    ];
    setMedicalRecords(mockRecords);
  };

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.phone) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    const patient: Patient = {
      id: Date.now().toString(),
      ...newPatient,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      status: 'active'
    };

    setPatients(prev => [...prev, patient]);
    setNewPatient({
      name: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      gender: 'male',
      nationalId: '',
      address: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      medicalHistory: [],
      allergies: [],
      medications: [],
      specialNeeds: [],
      insuranceInfo: {
        provider: '',
        policyNumber: '',
        expiryDate: ''
      }
    });
    setShowAddPatient(false);
  };

  const handleAddRecord = async () => {
    if (!selectedPatient || !newRecord.date || !newRecord.doctorName) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    const record: MedicalRecord = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      ...newRecord
    };

    setMedicalRecords(prev => [...prev, record]);
    setNewRecord({
      date: '',
      doctorName: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      followUpRequired: false,
      followUpDate: ''
    });
    setShowAddRecord(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'archived': return 'مؤرشف';
      default: return 'غير محدد';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.nationalId.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const patientRecords = selectedPatient ? 
    medicalRecords.filter(record => record.patientId === selectedPatient.id) : [];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">سجلات المرضى</h1>
        <Button onClick={() => setShowAddPatient(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          إضافة مريض جديد
        </Button>
      </div>

      {/* فلاتر البحث */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث بالاسم، الهاتف، أو الرقم الوطني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المرضى</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
            <SelectItem value="archived">مؤرشف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة المرضى */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>قائمة المرضى ({filteredPatients.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{patient.name}</h3>
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                        <p className="text-xs text-gray-500">
                          آخر زيارة: {new Date(patient.lastVisit).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(patient.status)}>
                        {getStatusText(patient.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* تفاصيل المريض والسجلات */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                <TabsTrigger value="records">السجلات الطبية</TabsTrigger>
                <TabsTrigger value="history">التاريخ الطبي</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>تفاصيل المريض</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddRecord(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة سجل طبي
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
                        <p className="text-sm text-gray-900">{selectedPatient.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                        <p className="text-sm text-gray-900">{selectedPatient.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                        <p className="text-sm text-gray-900">{selectedPatient.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                        <p className="text-sm text-gray-900">{selectedPatient.dateOfBirth}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">الجنس</label>
                        <p className="text-sm text-gray-900">{selectedPatient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">الرقم الوطني</label>
                        <p className="text-sm text-gray-900">{selectedPatient.nationalId}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">العنوان</label>
                      <p className="text-sm text-gray-900">{selectedPatient.address}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">جهة الاتصال في الطوارئ</label>
                      <p className="text-sm text-gray-900">
                        {selectedPatient.emergencyContact.name} - {selectedPatient.emergencyContact.phone} 
                        ({selectedPatient.emergencyContact.relationship})
                      </p>
                    </div>

                    {selectedPatient.specialNeeds.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">الاحتياجات الخاصة</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedPatient.specialNeeds.map((need, index) => (
                            <Badge key={index} variant="outline">{need}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPatient.allergies.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">الحساسيات</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedPatient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive">{allergy}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPatient.medications.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">الأدوية الحالية</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedPatient.medications.map((medication, index) => (
                            <Badge key={index} variant="secondary">{medication}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="records">
                <Card>
                  <CardHeader>
                    <CardTitle>السجلات الطبية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientRecords.map((record) => (
                        <div key={record.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{record.doctorName}</h4>
                              <p className="text-sm text-gray-600">{record.date}</p>
                            </div>
                            <Badge variant="outline">{record.diagnosis}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="text-sm font-medium text-gray-700">التشخيص</label>
                              <p className="text-sm text-gray-900">{record.diagnosis}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">العلاج</label>
                              <p className="text-sm text-gray-900">{record.treatment}</p>
                            </div>
                            {record.notes && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">ملاحظات</label>
                                <p className="text-sm text-gray-900">{record.notes}</p>
                              </div>
                            )}
                            {record.followUpRequired && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">موعد المتابعة</label>
                                <p className="text-sm text-gray-900">{record.followUpDate}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>التاريخ الطبي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">التاريخ الطبي</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedPatient.medicalHistory.map((condition, index) => (
                            <Badge key={index} variant="outline">{condition}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">اختر مريضاً لعرض تفاصيله</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* نموذج إضافة مريض جديد */}
      {showAddPatient && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CardContent className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>إضافة مريض جديد</CardTitle>
            </CardHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">الاسم الكامل *</label>
                  <Input
                    value={newPatient.name}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">رقم الهاتف *</label>
                  <Input
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+966501234567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="patient@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">تاريخ الميلاد</label>
                  <Input
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">الجنس</label>
                  <Select value={newPatient.gender} onValueChange={(value: any) => setNewPatient(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الرقم الوطني</label>
                  <Input
                    value={newPatient.nationalId}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, nationalId: e.target.value }))}
                    placeholder="1234567890"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">العنوان</label>
                <Input
                  value={newPatient.address}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="العنوان الكامل"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700">
                إضافة المريض
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientRecords;