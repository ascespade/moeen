import { Metadata } from 'next';
import DynamicDataDashboard from '@/components/dynamic-data-dashboard';

export const metadata: Metadata = {
  title: 'البيانات الديناميكية - Mu3een',
  description: 'عرض وإدارة البيانات الديناميكية من قاعدة البيانات',
};

export default function DynamicDataPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">البيانات الديناميكية</h1>
        <p className="text-muted-foreground mt-2">
          عرض وإدارة البيانات الديناميكية من قاعدة البيانات - الأطباء، المرضى، الموظفين، وجهات الاتصال الطارئة
        </p>
      </div>
      
      <DynamicDataDashboard />
    </div>
  );
}

