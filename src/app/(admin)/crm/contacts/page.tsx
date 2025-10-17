"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  UserPlus,
  MessageCircle,
  Star,
  Clock,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  source: string;
  notes?: string;
  tags: string[];
  last_contact: string;
  next_follow_up: string;
  created_at: string;
  updated_at: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface ContactActivity {
  id: string;
  contact_id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  description: string;
  date: string;
  user_id: string;
  user_name: string;
}

const ContactsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activities, setActivities] = useState<ContactActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showActivities, setShowActivities] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadContacts();
  }, [isAuthenticated, router]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockContacts: Contact[] = [
        {
          id: "1",
          first_name: "أحمد",
          last_name: "المحمد",
          email: "ahmed@example.com",
          phone: "0501234567",
          company: "شركة التقنية المتقدمة",
          position: "مدير المشتريات",
          status: "customer",
          source: "موقع إلكتروني",
          notes: "عميل مهم، مهتم بخدمات التأهيل",
          tags: ["مهم", "مشتري نشط"],
          last_contact: "2024-01-15T10:00:00Z",
          next_follow_up: "2024-01-22T14:00:00Z",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          avatar: "/logo.png",
          address: {
            street: "شارع الملك فهد",
            city: "جدة",
            country: "المملكة العربية السعودية"
          },
          social_media: {
            linkedin: "ahmed-mohammed",
            twitter: "@ahmed_m"
          }
        },
        {
          id: "2",
          first_name: "فاطمة",
          last_name: "العلي",
          email: "fatima@example.com",
          phone: "0507654321",
          company: "مؤسسة الرعاية الاجتماعية",
          position: "منسقة البرامج",
          status: "prospect",
          source: "إحالة",
          notes: "مهتمة ببرامج التدريب المهني",
          tags: ["إحالة", "تدريب"],
          last_contact: "2024-01-10T15:30:00Z",
          next_follow_up: "2024-01-20T11:00:00Z",
          created_at: "2024-01-05T00:00:00Z",
          updated_at: "2024-01-10T15:30:00Z",
          avatar: "/logo.png"
        }
      ];

      const mockActivities: ContactActivity[] = [
        {
          id: "1",
          contact_id: "1",
          type: "call",
          subject: "مكالمة متابعة",
          description: "مناقشة احتياجات الشركة من خدمات التأهيل",
          date: "2024-01-15T10:00:00Z",
          user_id: "user-1",
          user_name: "سارة أحمد"
        },
        {
          id: "2",
          contact_id: "1",
          type: "meeting",
          subject: "اجتماع تقديم الخدمات",
          description: "عرض خدمات المركز وبرامج التأهيل المتاحة",
          date: "2024-01-12T14:00:00Z",
          user_id: "user-2",
          user_name: "محمد العلي"
        }
      ];

      setContacts(mockContacts);
      setActivities(mockActivities);
    } catch (error) {
      setError('فشل في تحميل جهات الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'lead': { label: 'عميل محتمل', variant: 'secondary' as const },
      'prospect': { label: 'عميل واعد', variant: 'primary' as const },
      'customer': { label: 'عميل', variant: 'primary' as const },
      'inactive': { label: 'غير نشط', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-brand-primary" />;
      case 'email':
        return <Mail className="w-4 h-4 text-brand-success" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'note':
        return <MessageCircle className="w-4 h-4 text-brand-primary" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    const matchesSource = filterSource === "all" || contact.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const contactActivities = selectedContact 
    ? activities.filter(activity => activity.contact_id === selectedContact.id)
    : [];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة جهات الاتصال</h1>
            <p className="text-gray-600 mt-2">إدارة العملاء المحتملين والعملاء الحاليين</p>
          </div>
          <Button 
            onClick={() => router.push('/crm/contacts/new')}
            className="bg-[var(--brand-primary)] hover:brightness-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة جهة اتصال
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في جهات الاتصال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع الحالات</option>
              <option value="lead">عميل محتمل</option>
              <option value="prospect">عميل واعد</option>
              <option value="customer">عميل</option>
              <option value="inactive">غير نشط</option>
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع المصادر</option>
              <option value="موقع إلكتروني">موقع إلكتروني</option>
              <option value="إحالة">إحالة</option>
              <option value="إعلان">إعلان</option>
              <option value="معرض">معرض</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي جهات الاتصال</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.filter(c => c.status === 'customer').length} عميل
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء المحتملين</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'lead').length}
            </div>
            <p className="text-xs text-muted-foreground">عميل محتمل</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأنشطة اليوم</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.filter(a => 
                new Date(a.date).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">نشاط</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتابعات المعلقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => 
                new Date(c.next_follow_up) > new Date()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">متابعة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>جهات الاتصال</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد جهات اتصال</h3>
                  <p className="text-gray-600 mb-4">ابدأ بإضافة جهة اتصال جديدة</p>
                  <Button 
                    onClick={() => router.push('/crm/contacts/new')}
                    className="bg-[var(--brand-primary)] hover:brightness-95"
                  >
                    إضافة جهة اتصال
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id 
                          ? 'border-[var(--brand-primary)] bg-surface' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Image
                            src={contact.avatar || "/logo.png"}
                            alt="Contact"
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                          <div>
                            <h3 className="text-lg font-semibold">
                              {contact.first_name} {contact.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {contact.company} - {contact.position}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600">{contact.phone}</span>
                              <Mail className="w-3 h-3 text-gray-500 mr-2" />
                              <span className="text-xs text-gray-600">{contact.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(contact.status)}
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {contact.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {contact.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>آخر اتصال: {new Date(contact.last_contact).toLocaleDateString('ar-SA')}</span>
                        <span>المصدر: {contact.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Details & Activities */}
        <div className="space-y-6">
          {selectedContact ? (
            <>
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    تفاصيل جهة الاتصال
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Image
                      src={selectedContact.avatar || "/logo.png"}
                      alt="Contact"
                      width={80}
                      height={80}
                      className="rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold">
                      {selectedContact.first_name} {selectedContact.last_name}
                    </h3>
                    <p className="text-gray-600">{selectedContact.company}</p>
                    <p className="text-sm text-gray-500">{selectedContact.position}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedContact.email}</span>
                    </div>
                    {selectedContact.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {selectedContact.address.street}, {selectedContact.address.city}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">الحالة:</span>
                      {getStatusBadge(selectedContact.status)}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">المصدر:</span>
                      <span className="text-sm">{selectedContact.source}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">المتابعة التالية:</span>
                      <span className="text-sm">
                        {new Date(selectedContact.next_follow_up).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>

                  {selectedContact.notes && (
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-2">ملاحظات:</h4>
                      <p className="text-sm text-gray-700 bg-surface p-3 rounded-lg">
                        {selectedContact.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      إرسال رسالة
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activities */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      الأنشطة
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowActivities(!showActivities)}
                    >
                      {showActivities ? 'إخفاء' : 'عرض'}
                    </Button>
                  </div>
                </CardHeader>
                {showActivities && (
                  <CardContent>
                    <div className="space-y-3">
                      {contactActivities.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          لا توجد أنشطة مسجلة
                        </p>
                      ) : (
                        contactActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 bg-surface rounded-lg">
                            <div className="p-2 bg-white rounded-full">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold">{activity.subject}</h4>
                              <p className="text-xs text-gray-600">{activity.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {activity.user_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(activity.date).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">اختر جهة اتصال</h3>
                <p className="text-gray-600">اختر جهة اتصال لعرض التفاصيل والأنشطة</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;