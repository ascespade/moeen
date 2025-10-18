import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

"use client";

interface SessionType {
  id: string;
  name_ar: string;
  name_en: string;
  description: string;
  duration: number;
  price: number;
  color: string;
  icon: string;

interface Props {
  onSelect: (sessionType: SessionType) => void;
  selectedId?: string;

export default function SessionTypeSelector({ onSelect, selectedId }: Props) {
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadSessionTypes();
  }, []);

  const loadSessionTypes = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("session_types")
        .select("*")
        .eq("is_active", true)
        .order("name_ar");

      if (error) throw error;
      setSessionTypes(data || []);
    } catch (error) {
      console.error("Error loading session types:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessionTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type)}
          className={`card p-6 text-right transition-all hover:shadow-lg ${
            selectedId === type.id
              ? "ring-2 ring-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
              : ""
          }`}
        >
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto"
            style={{ backgroundColor: `${type.color}20` }}
          >
            {type.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
            {type.name_ar}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center line-clamp-2">
            {type.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              ⏱️ {type.duration} دقيقة
            </span>
            <span className="font-bold text-[var(--brand-primary)]">
              {type.price} ريال
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}}}}
