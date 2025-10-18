"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes: string;
  specialNeeds: string[];
  insuranceInfo?: string;
  createdAt: string;
  updatedAt: string;

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availableSlots: string[];
  maxPatientsPerDay: number;

const AppointmentManager: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const iso = new Date().toISOString();
    const parts = iso.split("T");
    return parts[0] || "";
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "confirmed" | "completed" | "cancelled"
  >("all");

  // نموذج إضافة موعد جديد
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
    specialNeeds: [] as string[],
    insuranceInfo: "",
  });

  // تحميل البيانات الأولية
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    // محاكاة تحميل المواعيد من قاعدة البيانات
    const mockAppointments: Appointment[] = [
  {
    id: "1",
        patientName: "أحمد محمد",
        patientPhone: "+966501234567",
        patientEmail: "ahmed@example.com",
        doctorName: "د. سارة أحمد",
        date: "2024-01-15",
        time: "10:00",
        status: "scheduled",
        notes: "فحص دوري",
        specialNeeds: ["كرسي متحرك"],
        insuranceInfo: "شركة التأمين الوطنية",
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-10T09:00:00Z",
      },
        id: "2",
        patientName: "فاطمة علي",
        patientPhone: "+966502345678",
        patientEmail: "fatima@example.com",
        doctorName: "د. محمد حسن",
        date: "2024-01-15",
        time: "14:30",
        status: "confirmed",
        notes: "متابعة العلاج",
        specialNeeds: ["مترجم لغة الإشارة"],
        insuranceInfo: "شركة التأمين التعاوني",
        createdAt: "2024-01-11T10:30:00Z",
        updatedAt: "2024-01-11T10:30:00Z",
      },
    ];
    setAppointments(mockAppointments);
  };

  const loadDoctors = async () => {
    const mockDoctors: Doctor[] = [
  {
    id: "1",
        name: "د. سارة أحمد",
        specialty: "طب الأطفال",
        availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
        maxPatientsPerDay: 20,
      },
        id: "2",
        name: "د. محمد حسن",
        specialty: "العلاج الطبيعي",
        availableSlots: ["08:00", "09:30", "11:00", "13:30", "15:00"],
        maxPatientsPerDay: 15,
      },
        id: "3",
        name: "د. نورا سالم",
        specialty: "العلاج الوظيفي",
        availableSlots: ["09:00", "10:30", "12:00", "14:30", "16:00"],
        maxPatientsPerDay: 12,
      },
    ];
    setDoctors(mockDoctors);
  };

  const handleAddAppointment = async () => {
    if (
      !newAppointment.patientName ||
      !newAppointment.doctorId ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;

    const selectedDoctor = doctors.find(
      (d) => d.id === newAppointment.doctorId,
    );
    if (!selectedDoctor) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      patientEmail: newAppointment.patientEmail,
      doctorName: selectedDoctor.name,
      date: newAppointment.date,
      time: newAppointment.time,
      status: "scheduled",
      notes: newAppointment.notes,
      specialNeeds: newAppointment.specialNeeds,
      insuranceInfo: newAppointment.insuranceInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments((prev) => [...prev, appointment]);
    setNewAppointment({
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      doctorId: "",
      date: "",
      time: "",
      notes: "",
      specialNeeds: [],
      insuranceInfo: "",
    });
    setShowAddForm(false);
  };

  const handleUpdateAppointment = async (
    id: string,
    updates: Partial<Appointment>,
  ) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, ...updates, updatedAt: new Date().toISOString() }
          : apt,
      ),
    );
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الموعد؟")) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "مجدول";
      case "confirmed":
        return "مؤكد";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  const filteredAppointments = appointments.filter(
    (apt) => filter === "all" || apt.status === filter,
  );

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">إدارة المواعيد</h1>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-[var(--brand-primary)] hover:brightness-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة موعد جديد
        </Button>
      </div>

      {/* فلاتر */}
      <div className="flex gap-4 items-center">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-48">
            <span className="text-gray-400">فلترة المواعيد</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المواعيد</SelectItem>
            <SelectItem value="scheduled">مجدولة</SelectItem>
            <SelectItem value="confirmed">مؤكدة</SelectItem>
            <SelectItem value="completed">مكتملة</SelectItem>
            <SelectItem value="cancelled">ملغية</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48"
        />
      </div>

      {/* قائمة المواعيد */}
      <div className="grid gap-4">
        {filteredAppointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-lg">
                      {appointment.patientName}
                    </span>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{appointment.date}</span>
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{appointment.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{appointment.doctorName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{appointment.patientPhone}</span>
                  </div>

                  {appointment.specialNeeds.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">الاحتياجات الخاصة:</span>
                      <div className="flex gap-1">
                        {appointment.specialNeeds.map((need, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="text-gray-600">
                      <span className="font-medium">ملاحظات:</span>{" "}
                      {appointment.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAppointment(appointment)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="text-brand-error hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* نموذج إضافة موعد جديد */}
      {showAddForm && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CardContent className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>إضافة موعد جديد</CardTitle>
            </CardHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">اسم المريض *</Label>
                  <Input
                    id="patientName"
                    value={newAppointment.patientName}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        patientName: e.target.value,
                      }))
                    placeholder="أدخل اسم المريض"
                  />
                </div>

                <div>
                  <Label htmlFor="patientPhone">رقم الهاتف</Label>
                  <Input
                    id="patientPhone"
                    value={newAppointment.patientPhone}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        patientPhone: e.target.value,
                      }))
                    placeholder="+966501234567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="patientEmail">البريد الإلكتروني</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={newAppointment.patientEmail}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      patientEmail: e.target.value,
                    }))
                  placeholder="patient@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doctor">الطبيب *</Label>
                  <Select
                    value={newAppointment.doctorId}
                    onValueChange={(value) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        doctorId: value,
                      }))
                  >
                    <SelectTrigger>
                      <span className="text-gray-400">اختر الطبيب</span>
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">الوقت *</Label>
                  <Select
                    value={newAppointment.time}
                    onValueChange={(value) =>
                      setNewAppointment((prev) => ({ ...prev, time: value }))
                  >
                    <SelectTrigger>
                      <span className="text-gray-400">اختر الوقت</span>
                    </SelectTrigger>
                    <SelectContent>
                      {doctors
                        .find((d) => d.id === newAppointment.doctorId)
                        ?.availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="insuranceInfo">معلومات التأمين</Label>
                  <Input
                    id="insuranceInfo"
                    value={newAppointment.insuranceInfo}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        insuranceInfo: e.target.value,
                      }))
                    placeholder="شركة التأمين"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  placeholder="أي ملاحظات إضافية..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleAddAppointment}
                className="bg-[var(--brand-primary)] hover:brightness-95"
              >
                إضافة الموعد
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentManager;
}}}}}}
