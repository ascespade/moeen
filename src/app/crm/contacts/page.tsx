"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: "active" | "inactive" | "lead" | "customer";
  source: string;
  lastContact: string;
  totalDeals: number;
  totalValue: number;
  tags: string[];
  notes?: string;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "أحمد العتيبي",
    email: "ahmed@company.com",
    phone: "0501234567",
    company: "شركة التقنية المتقدمة",
    position: "مدير تقنية المعلومات",
    status: "customer",
    source: "موقع إلكتروني",
    lastContact: "2024-01-15",
    totalDeals: 3,
    totalValue: 45000,
    tags: ["VIP", "تقنية"],
    notes: "عميل مهم - يهتم بالحلول التقنية",
  },
  {
    id: "2",
    name: "فاطمة السعيد",
    email: "fatima@hospital.com",
    phone: "0507654321",
    company: "مستشفى الملك فهد",
    position: "مديرة التمريض",
    status: "lead",
    source: "إحالة",
    lastContact: "2024-01-12",
    totalDeals: 0,
    totalValue: 0,
    tags: ["صحة", "مستشفى"],
    notes: "مهتمة بحلول إدارة المرضى",
  },
  {
    id: "3",
    name: "خالد القحطاني",
    email: "khalid@clinic.com",
    phone: "0509876543",
    company: "عيادة الأسنان المتخصصة",
    position: "طبيب أسنان",
    status: "active",
    source: "معرض طبي",
    lastContact: "2024-01-10",
    totalDeals: 1,
    totalValue: 15000,
    tags: ["أسنان", "عيادة"],
  },
  {
    id: "4",
    name: "نورا السعد",
    email: "nora@pharmacy.com",
    phone: "0504567890",
    company: "صيدلية النور",
    position: "صيدلانية",
    status: "inactive",
    source: "إعلان فيسبوك",
    lastContact: "2023-12-20",
    totalDeals: 0,
    totalValue: 0,
    tags: ["صيدلية"],
  },
];

export default function CRMContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "lead":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Contact["status"]) => {
    switch (status) {
      case "active":
        return "نشط";
      case "inactive":
        return "غير نشط";
      case "lead":
        return "عميل محتمل";
      case "customer":
        return "عميل";
      default:
        return "غير محدد";
    }
  };

  const allSources = Array.from(new Set(mockContacts.map((c) => c.source)));

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || contact.status === selectedStatus;
    const matchesSource =
      selectedSource === "all" || contact.source === selectedSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId],
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpg"
                alt="مُعين"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-brand text-2xl font-bold">
                  إدارة جهات الاتصال
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  قاعدة بيانات العملاء والشركاء
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedContacts.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedContacts.length} محدد
                  </span>
                  <button className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200">
                    حذف
                  </button>
                  <button className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200">
                    تصدير
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                إضافة جهة اتصال
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {mockContacts.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي جهات الاتصال
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockContacts.filter((c) => c.status === "customer").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">عملاء</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {mockContacts.filter((c) => c.status === "lead").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              عملاء محتملين
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {mockContacts
                .reduce((sum, c) => sum + c.totalValue, 0)
                .toLocaleString()}{" "}
              ريال
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي القيمة
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو البريد أو الشركة..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الحالة
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الحالات</option>
                <option value="lead">عميل محتمل</option>
                <option value="active">نشط</option>
                <option value="customer">عميل</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                المصدر
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع المصادر</option>
                {allSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                طريقة العرض
              </label>
              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  جدول
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-2 text-sm ${viewMode === "cards" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  بطاقات
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Content */}
        {viewMode === "table" ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={
                          selectedContacts.length === filteredContacts.length &&
                          filteredContacts.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      جهة الاتصال
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الشركة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الصفقات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      آخر تواصل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => handleSelectContact(contact.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-semibold text-white">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {contact.company || "غير محدد"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.position}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${getStatusColor(contact.status)}`}
                        >
                          {getStatusText(contact.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {contact.totalDeals} صفقة
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.totalValue.toLocaleString()} ريال
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {contact.lastContact}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={ROUTES.CRM.CONTACT(contact.id)}
                            className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
                          >
                            عرض
                          </Link>
                          <button className="text-gray-600 hover:text-gray-900">
                            تعديل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="card hover:shadow-soft p-6 transition-shadow"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)] font-semibold text-white">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {contact.company}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${getStatusColor(contact.status)}`}
                  >
                    {getStatusText(contact.status)}
                  </span>
                </div>

                <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>البريد:</span>
                    <span className="font-medium">{contact.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الهاتف:</span>
                    <span className="font-medium">{contact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المنصب:</span>
                    <span className="font-medium">
                      {contact.position || "غير محدد"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الصفقات:</span>
                    <span className="font-medium">
                      {contact.totalDeals} صفقة
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>القيمة:</span>
                    <span className="font-medium">
                      {contact.totalValue.toLocaleString()} ريال
                    </span>
                  </div>
                </div>

                {contact.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={ROUTES.CRM.CONTACT(contact.id)}
                    className="btn-brand flex-1 rounded-lg py-2 text-center text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                  >
                    عرض التفاصيل
                  </Link>
                  <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    تعديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredContacts.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد جهات اتصال
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد جهات اتصال مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {/* Create Contact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">إضافة جهة اتصال جديدة</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="example@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الهاتف
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="0501234567"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الشركة
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="اسم الشركة"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    المنصب
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="المنصب الوظيفي"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الحالة
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="lead">عميل محتمل</option>
                    <option value="active">نشط</option>
                    <option value="customer">عميل</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  المصدر
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                  <option value="موقع إلكتروني">موقع إلكتروني</option>
                  <option value="إحالة">إحالة</option>
                  <option value="معرض">معرض</option>
                  <option value="إعلان فيسبوك">إعلان فيسبوك</option>
                  <option value="بحث جوجل">بحث جوجل</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="أضف ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  إضافة جهة الاتصال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
