import { Metadata } from 'next';
import DynamicDoctorsList from '@/components/dynamic-doctors-list';

export const metadata: Metadata = {
  title: 'الأطباء - Mu3een',
  description: 'قائمة الأطباء المتاحين في المركز الطبي',
};

export default function DoctorsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">الأطباء</h1>
        <p className="text-muted-foreground mt-2">
          قائمة الأطباء المتاحين في المركز الطبي مع معلوماتهم التفصيلية
        </p>
      </div>
      
      <DynamicDoctorsList showFilters={true} />
    </div>
  );
}

