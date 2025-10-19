import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, Users, Stethoscope, AlertTriangle } from 'lucide-react';

interface DynamicContactInfoProps {
  className?: string;
}

interface CenterInfo {
  name: string;
  name_en: string;
  description: string;
  phone: string;
  email: string;
  emergency_phone: string;
  admin_phone: string;
  city: string;
  address: string;
  working_hours: any;
  social_media: any;
}

interface EmergencyContact {
  name: string;
  phone: string;
  type: string;
  priority: number;
  is_available_24_7: boolean;
  notes: string;
}

export default function DynamicContactInfo({ className }: DynamicContactInfoProps) {
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب معلومات المركز وجهات الاتصال الطارئة
      const response = await fetch('/api/dynamic-data?type=center');
      const data = await response.json();

      if (data.center_info) {
        setCenterInfo(data.center_info);
      }

      if (data.emergency_contacts) {
        setEmergencyContacts(data.emergency_contacts);
      }

    } catch (err) {
      setError('فشل في تحميل معلومات الاتصال');
      console.error('Error fetching contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">جاري تحميل معلومات الاتصال...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchContactInfo} className="mt-2">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* معلومات المركز */}
      {centerInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {centerInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* معلومات الاتصال الأساسية */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">الهاتف الرئيسي</p>
                    <p className="text-sm text-muted-foreground">{centerInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">{centerInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">المدينة</p>
                    <p className="text-sm text-muted-foreground">{centerInfo.city}</p>
                  </div>
                </div>

                {centerInfo.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">العنوان</p>
                      <p className="text-sm text-muted-foreground">{centerInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* معلومات الطوارئ والإدارة */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">الطوارئ الطبية</p>
                    <p className="text-sm text-red-600 font-semibold">{centerInfo.emergency_phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">الإدارة</p>
                    <p className="text-sm text-muted-foreground">{centerInfo.admin_phone}</p>
                  </div>
                </div>

                {centerInfo.working_hours && Object.keys(centerInfo.working_hours).length > 0 && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">ساعات العمل</p>
                      <div className="text-sm text-muted-foreground">
                        {Object.entries(centerInfo.working_hours).map(([day, hours]) => (
                          <p key={day}>{day}: {hours as string}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* وصف المركز */}
            {centerInfo.description && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm">{centerInfo.description}</p>
              </div>
            )}

            {/* الخدمات والتخصصات */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {centerInfo.services && centerInfo.services.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">الخدمات</h4>
                  <div className="flex flex-wrap gap-2">
                    {centerInfo.services.map((service, index) => (
                      <Badge key={index} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {centerInfo.specialties && centerInfo.specialties.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">التخصصات</h4>
                  <div className="flex flex-wrap gap-2">
                    {centerInfo.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* جهات الاتصال الطارئة */}
      {emergencyContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              جهات الاتصال الطارئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts
                .sort((a, b) => a.priority - b.priority)
                .map((contact) => (
                  <div key={contact.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{contact.name}</h4>
                      <div className="flex gap-1">
                        <Badge 
                          variant={contact.type === 'medical' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {contact.type}
                        </Badge>
                        {contact.is_available_24_7 && (
                          <Badge variant="outline" className="text-xs">24/7</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${contact.phone}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                      
                      {contact.notes && (
                        <p className="text-xs text-muted-foreground">{contact.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* رسالة في حالة عدم وجود بيانات */}
      {!centerInfo && emergencyContacts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد بيانات متاحة</h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على معلومات الاتصال في قاعدة البيانات
            </p>
            <Button onClick={fetchContactInfo}>
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

