import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import SessionTypeSelector from "@/components/booking/SessionTypeSelector";
import AvailableSlotsPicker from "@/components/booking/AvailableSlotsPicker";
import logger from "@/lib/monitoring/logger";

("use client");

interface SessionType {
  id: string;
  name_ar: string;
  name_en: string;
  description: string;
  duration: number;
  price: number;
  color: string;
  icon: string;
}

interface Slot {
  therapistId: string;
  therapistName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export default function BookSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Session Type, 2: Date, 3: Time, 4: Confirm
  const [selectedSessionType, setSelectedSessionType] =
    useState<SessionType | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [patientName, setPatientName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectSessionType = (type: SessionType) => {
    setSelectedSessionType(type);
    setStep(2);
  };

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setStep(4); // Go to confirmation
  };

  const handleBookSession = async () => {
    if (!selectedSessionType || !selectedSlot || !patientName.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }

      // Get or create patient
      let patientId;
      const { data: existingPatients } = await supabase
        .from("patients")
        .select("id")
        .eq("first_name", patientName)
        .limit(1);

      if (existingPatients && existingPatients.length > 0) {
        patientId = existingPatients[0].id;
      } else {
        // Create new patient
        const { data: newPatient, error: patientError } = await supabase
          .from("patients")
          .insert({
            first_name: patientName,
            last_name: "",
            date_of_birth: null,
          })
          .select()
          .single();

        if (patientError) throw patientError;
        patientId = newPatient.id;
      }

      // Create appointment
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: patientId,
          doctor_id: selectedSlot.therapistId,
          session_type_id: selectedSessionType.id,
          appointment_date: selectedSlot.date,
          appointment_time: selectedSlot.startTime,
          duration: selectedSessionType.duration,
          status: "scheduled",
          notes: notes || null,
        });

      if (appointmentError) throw appointmentError;

      logger.info("Session booked successfully", {
        sessionTypeId: selectedSessionType.id,
        therapistId: selectedSlot.therapistId,
        date: selectedSlot.date,
        time: selectedSlot.startTime,
      });

      // Success!
      alert("تم حجز الجلسة بنجاح! ✅\n\nسنرسل لك تذكيراً قبل موعد الجلسة.");
      router.push("/health/appointments");
    } catch (err: any) {
      logger.error("Error booking session", err);
      setError(err.message || "حدث خطأ أثناء حجز الجلسة");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="container-app py-8">
      {/* Progress Steps */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "نوع الجلسة" },
            { num: 2, label: "التاريخ" },
            { num: 3, label: "الوقت" },
            { num: 4, label: "التأكيد" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= s.num
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {s.num}
              </div>
              <span
                className={`mr-2 text-sm ${
                  step >= s.num
                    ? "text-gray-900 dark:text-white font-semibold"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
              {i < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded ${
                    step > s.num
                      ? "bg-[var(--brand-primary)]"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Session Type */}
      {step === 1 && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            اختر نوع الجلسة
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            اختر نوع الجلسة التي تريد حجزها
          </p>

          <SessionTypeSelector
            onSelect={handleSelectSessionType}
            selectedId={selectedSessionType?.id}
          />
        </div>
      )}

      {/* Step 2: Select Date */}
      {step === 2 && selectedSessionType && (
        <div>
          <button onClick={() => setStep(1)} className="btn btn-outline mb-6">
            ← العودة
          </button>

          <div className="card p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${selectedSessionType.color}20` }}
              >
                {selectedSessionType.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedSessionType.name_ar}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedSessionType.duration} دقيقة •{" "}
                  {selectedSessionType.price} ريال
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            اختر التاريخ
          </h2>

          <div className="card p-8">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (e.target.value) {
                  setStep(3);
                }
              }}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--brand-primary)] text-lg"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              ساعات العمل: الأحد - الخميس، 7 صباحاً - 7 مساءً
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Select Time Slot */}
      {step === 3 && selectedSessionType && selectedDate && (
        <div>
          <button onClick={() => setStep(2)} className="btn btn-outline mb-6">
            ← العودة
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            اختر الوقت المناسب
          </h2>

          <AvailableSlotsPicker
            sessionTypeId={selectedSessionType.id}
            selectedDate={selectedDate}
            onSelect={handleSelectSlot}
            selectedSlot={selectedSlot || undefined}
          />
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && selectedSessionType && selectedSlot && (
        <div>
          <button onClick={() => setStep(3)} className="btn btn-outline mb-6">
            ← العودة
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            تأكيد الحجز
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                ملخص الحجز
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{selectedSessionType.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedSessionType.name_ar}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedSessionType.duration} دقيقة
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">👨‍⚕️</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedSlot.therapistName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      الأخصائي
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedSlot.date).toLocaleDateString("ar-SA", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      التاريخ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedSlot.startTime}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      الوقت
                    </p>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      التكلفة
                    </span>
                    <span className="text-2xl font-bold text-[var(--brand-primary)]">
                      {selectedSessionType.price} ريال
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                معلومات الحجز
              </h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    اسم الطفل *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="أدخل اسم الطفل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleBookSession}
                  disabled={loading || !patientName.trim()}
                  className="btn btn-brand w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      جاري الحجز...
                    </span>
                  ) : (
                    "تأكيد الحجز"
                  )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  سنرسل لك تذكيراً عبر الواتساب قبل موعد الجلسة بـ 24 ساعة
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
