'use client';
import { useState } from 'react';

import Image from 'next/image';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'مدير النظام',
    description: 'صلاحيات كاملة لإدارة النظام',
    permissions: ['users', 'settings', 'reports', 'analytics', 'roles'],
    userCount: 2,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'مدير الرعاية الصحية',
    description: 'إدارة وحدة الرعاية الصحية',
    permissions: ['patients', 'appointments', 'sessions', 'claims'],
    userCount: 5,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'طبيب',
    description: 'إدارة المرضى والمواعيد',
    permissions: ['patients', 'appointments', 'sessions'],
    userCount: 12,
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'ممرض',
    description: 'إدارة الجلسات والمرضى',
    permissions: ['sessions', 'patients'],
    userCount: 8,
    createdAt: '2024-01-01',
  },
];

const allPermissions = [
  { id: 'users', name: 'إدارة المستخدمين' },
  { id: 'settings', name: 'الإعدادات' },
  { id: 'reports', name: 'التقارير' },
  { id: 'analytics', name: 'التحليلات' },
  { id: 'roles', name: 'إدارة الأدوار' },
  { id: 'patients', name: 'إدارة المرضى' },
  { id: 'appointments', name: 'إدارة المواعيد' },
  { id: 'sessions', name: 'إدارة الجلسات' },
  { id: 'claims', name: 'إدارة المطالبات' },
  { id: 'contacts', name: 'إدارة جهات الاتصال' },
  { id: 'leads', name: 'إدارة العملاء المحتملين' },
  { id: 'deals', name: 'إدارة الصفقات' },
  { id: 'activities', name: 'إدارة الأنشطة' },
  { id: 'chatbot', name: 'إدارة الشات بوت' },
  { id: 'templates', name: 'إدارة القوالب' },
];

export default function RolesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  return (
    <div className='min-h-screen bg-[var(--default-surface)]'>
      <header className='border-default sticky top-0 z-10 border-b bg-white dark:bg-gray-900'>
        <div className='container-app py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Image
                src='/logo.png'
                alt='مُعين'
                width={50}
                height={50}
                className='rounded-lg'
              />
              <div>
                <h1 className='text-default text-2xl font-bold'>
                  إدارة الأدوار والصلاحيات
                </h1>
                <p className='text-gray-600 dark:text-gray-300'>
                  تحديد صلاحيات المستخدمين
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className='btn-default rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]'
            >
              إضافة دور
            </button>
          </div>
        </div>
      </header>

      <main className='container-app py-8'>
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              {mockRoles.length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي الأدوار
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-success'>
              {mockRoles.reduce((sum, r) => sum + r.userCount, 0)}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي المستخدمين
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-purple-600'>
              {allPermissions.length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              الصلاحيات المتاحة
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              4
            </div>
            <div className='text-gray-600 dark:text-gray-300'>أدوار نشطة</div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <div className='card p-6'>
              <h2 className='mb-6 text-xl font-semibold'>الأدوار</h2>
              <div className='space-y-4'>
                {mockRoles.map(role => (
                  <div
                    key={role.id}
                    className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <div>
                        <h3 className='font-semibold text-gray-900 dark:text-white'>
                          {role.name}
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          {role.description}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-500'>
                          {role.userCount} مستخدم
                        </span>
                        <button
                          onClick={() => setEditingRole(role)}
                          className='rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-surface'
                        >
                          تعديل
                        </button>
                      </div>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {role.permissions.map(permission => {
                        const perm = allPermissions.find(
                          p => p.id === permission
                        );
                        return perm ? (
                          <span
                            key={permission}
                            className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                          >
                            {perm.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='lg:col-span-1'>
            <div className='card p-6'>
              <h2 className='mb-6 text-xl font-semibold'>جميع الصلاحيات</h2>
              <div className='space-y-2'>
                {allPermissions.map(permission => (
                  <div
                    key={permission.id}
                    className='flex items-center gap-2 rounded-lg bg-surface p-2 dark:bg-gray-800'
                  >
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-[var(--default-default)] focus:ring-[var(--default-default)]'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      {permission.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold'>إضافة دور جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                ✕
              </button>
            </div>
            <form className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  اسم الدور
                </label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                  placeholder='أدخل اسم الدور'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  الوصف
                </label>
                <textarea
                  rows={3}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                  placeholder='أدخل وصف الدور'
                ></textarea>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  الصلاحيات
                </label>
                <div className='grid max-h-48 grid-cols-2 gap-2 overflow-y-auto'>
                  {allPermissions.map(permission => (
                    <div
                      key={permission.id}
                      className='flex items-center gap-2 rounded-lg border border-gray-200 p-2'
                    >
                      <input
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-[var(--default-default)] focus:ring-[var(--default-default)]'
                      />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        {permission.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowCreateModal(false)}
                  className='flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface'
                >
                  إلغاء
                </button>
                <button
                  type='submit'
                  className='btn-default flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]'
                >
                  إضافة الدور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
