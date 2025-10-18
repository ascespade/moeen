"use client";


import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import logger from "@/lib/monitoring/logger";

interface Invoice {
  id: string;
  patient_name: string;
  session_type: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;

export default function InvoicesPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          *,
          patient:patients(first_name, last_name)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      logger.error("Error loading payments", error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = (payment: any) => {
    // TODO: Implement PDF generation
    alert("سيتم تنفيذ توليد PDF قريباً");
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto"></div>
          <p className="mt-4">جاري التحميل...</p>
        </div>
      </div>
    );

    return (
      <div className="container-app py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              الفواتير والمدفوعات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة الفواتير والإيصالات
            </p>
          </div>
          <button className="btn btn-brand">+ فاتورة جديدة</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              إجمالي المدفوعات
            </p>
            <p className="text-2xl font-bold text-green-600">
              {payments.filter((p) => p.status === "completed").length}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              المعلقة
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {payments.filter((p) => p.status === "pending").length}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              المبلغ الإجمالي
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {payments
                .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                .toLocaleString()}{" "}
              ريال
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    المريض
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    المبلغ
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    الطريقة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    التاريخ
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {payment.patient?.first_name} {payment.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {parseFloat(payment.amount).toLocaleString()} ريال
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {payment.payment_method === "cash"
                        ? "نقدي"
                        : payment.payment_method === "credit_card"
                          ? "بطاقة"
                          : payment.payment_method === "insurance"
                            ? "تأمين"
                            : payment.payment_method}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status === "completed"
                          ? "✅ مدفوع"
                          : payment.status === "pending"
                            ? "⏳ معلق"
                            : payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleDateString(
                            "ar-SA",
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => generateInvoicePDF(payment)}
                        className="text-sm text-[var(--brand-primary)] hover:underline"
                      >
                        📄 فاتورة
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
