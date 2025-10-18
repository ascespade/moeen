"use client";

import { useEffect, useState } from "react";

import logger from "@/lib/monitoring/logger";

interface Slot {
  therapistId: string;
  therapistName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;

interface Props {
  sessionTypeId: string;
  selectedDate: string;
  therapistId?: string;
  onSelect: (slot: Slot) => void;
  selectedSlot?: Slot;


export default function AvailableSlotsPicker({
  sessionTypeId,
  selectedDate,
  therapistId,
  onSelect,
  selectedSlot,
}: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (sessionTypeId && selectedDate) {
      loadAvailableSlots();
    }
  }, [sessionTypeId, selectedDate, therapistId]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        sessionTypeId,
        date: selectedDate,
      });

      if (therapistId) {
        params.append("therapistId", therapistId);

      const response = await fetch(`/api/sessions/available-slots?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load slots");

      setSlots(data.slots || []);

      if (data.slots.length === 0) {
        setError("لا توجد مواعيد متاحة في هذا التاريخ");
      }
    } catch (err: any) {
      logger.error("Error loading available slots", err);
      setError(err.message || "حدث خطأ في تحميل المواعيد المتاحة");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          جاري تحميل المواعيد المتاحة...
        </p>
      </div>
    );

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-lg text-gray-700 dark:text-gray-300">{error}</p>
        <button onClick={loadAvailableSlots} className="btn btn-outline mt-4">
          إعادة المحاولة
        </button>
      </div>
    );

  if (slots.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          لا توجد مواعيد متاحة في هذا التاريخ
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          يرجى اختيار تاريخ آخر أو نوع جلسة آخر
        </p>
      </div>
    );

  // Group slots by therapist
  const slotsByTherapist = slots.reduce((acc: any, slot) => {
    if (!acc[slot.therapistId]) {
      acc[slot.therapistId] = {
        name: slot.therapistName,
        slots: [],
      };
    acc[slot.therapistId].slots.push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {slots.length} موعد متاح
      </p>

      {Object.entries(slotsByTherapist).map(([therapistId, data]: any) => (
        <div key={therapistId} className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="text-2xl ml-2">👨‍⚕️</span>
            {data.name}
          </h3>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {data.slots.map((slot: Slot, index: number) => (
              <button
                key={index}
                onClick={() => onSelect(slot)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedSlot?.startTime === slot.startTime &&
                  selectedSlot?.therapistId === slot.therapistId
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 font-bold"
                    : "border-gray-200 dark:border-gray-700 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5"
                }`}
              >
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {slot.startTime}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {slot.duration} دقيقة
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}}}}}}}}}