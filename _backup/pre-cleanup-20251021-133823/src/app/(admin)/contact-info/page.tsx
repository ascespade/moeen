import { Metadata } from 'next';
import DynamicContactInfo from '@/components/dynamic-contact-info';

export const metadata: Metadata = {
  title: 'معلومات الاتصال - لوحة الإدارة - Mu3een',
  description: 'معلومات الاتصال وجهات الطوارئ للمركز الطبي - لوحة الإدارة',
};

export default function AdminContactPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>معلومات الاتصال - لوحة الإدارة</h1>
        <p className='text-muted-foreground mt-2'>
          معلومات الاتصال وجهات الطوارئ للمركز الطبي - لوحة الإدارة
        </p>
      </div>

      <DynamicContactInfo />
    </div>
  );
}
