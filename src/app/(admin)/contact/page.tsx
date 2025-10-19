import { Metadata } from 'next';
import DynamicContactInfo from '@/components/dynamic-contact-info';

export const metadata: Metadata = {
  title: 'معلومات الاتصال - Mu3een',
  description: 'معلومات الاتصال وجهات الطوارئ للمركز الطبي',
};

export default function ContactPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>معلومات الاتصال</h1>
        <p className='text-muted-foreground mt-2'>
          معلومات الاتصال وجهات الطوارئ للمركز الطبي
        </p>
      </div>

      <DynamicContactInfo />
    </div>
  );
}
