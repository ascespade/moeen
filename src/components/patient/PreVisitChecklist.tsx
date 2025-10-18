"use client";

import { useState, useEffect } from "react";
import { useT } from "@/hooks/useT";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Shield,
  CreditCard,
  Stethoscope,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  category: "documents" | "payment" | "health" | "appointment";
  icon: React.ReactNode;
}

interface PreVisitChecklistProps {
  appointmentId: string;
  patientId: string;
  onChecklistComplete?: () => void;
}

export default function PreVisitChecklist({
  appointmentId,
  patientId,
  onChecklistComplete,
}: PreVisitChecklistProps) {
  const { t } = useT();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await fetch(
          `/api/appointments/${appointmentId}/checklist`,
        );
        if (response.ok) {
          const data = await response.json();
          setChecklistItems(data.items);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchChecklist();
  }, [appointmentId]);

  const handleItemToggle = async (itemId: string, completed: boolean) => {
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/checklist/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed }),
        },
      );

      if (response.ok) {
        setChecklistItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, completed } : item,
          ),
        );
      }
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitChecklist = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/checklist/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        onChecklistComplete?.();
      }
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "documents":
        return <FileText className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "health":
        return <Stethoscope className="h-4 w-4" />;
      case "appointment":
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "documents":
        return "text-brand-primary bg-blue-100 dark:bg-blue-900/20";
      case "payment":
        return "text-brand-success bg-green-100 dark:bg-green-900/20";
      case "health":
        return "text-brand-error bg-red-100 dark:bg-red-900/20";
      case "appointment":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
      default:
        return "text-gray-600 bg-surface dark:bg-gray-900/20";
    }
  };

  const completedItems = checklistItems.filter((item) => item.completed).length;
  const totalItems = checklistItems.length;
  const requiredItems = checklistItems.filter((item) => item.required);
  const completedRequiredItems = requiredItems.filter(
    (item) => item.completed,
  ).length;
  const allRequiredCompleted = requiredItems.length === completedRequiredItems;

  const groupedItems = checklistItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category]!.push(item);
      return acc;
    },
    {} as Record<string, ChecklistItem[]>,
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("patient.checklist.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("patient.checklist.description")}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{t("patient.checklist.progress")}</span>
            <span>
              {completedItems}/{totalItems}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedItems / totalItems) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <span
                className={`p-2 rounded-lg mr-3 ${getCategoryColor(category)}`}
              >
                {getCategoryIcon(category)}
              </span>
              {t(`patient.checklist.categories.${category}`)}
            </h3>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start p-4 rounded-lg border ${
                    item.completed
                      ? "bg-surface dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-surface dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={(checked) =>
                      handleItemToggle(item.id, checked as boolean)
                    }
                    disabled={isSaving}
                    className="mt-1 mr-4"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {item.required && (
                          <Badge variant="outline" className="text-xs">
                            {t("common.required")}
                          </Badge>
                        )}
                        {item.completed && (
                          <CheckCircle className="h-4 w-4 text-brand-success" />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("patient.checklist.required_completed")}:{" "}
              {completedRequiredItems}/{requiredItems.length}
            </p>
            {!allRequiredCompleted && (
              <p className="text-sm text-brand-primary dark:text-orange-400 mt-1">
                {t("patient.checklist.required_warning")}
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmitChecklist}
            disabled={!allRequiredCompleted || isSaving}
            className="px-8"
          >
            {isSaving ? t("common.submitting") : t("patient.checklist.submit")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
