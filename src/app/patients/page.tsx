import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function PatientsPage() {
  return (
    <main className="container-app py-8">
      <h1 className="text-2xl font-bold text-brand mb-4">المرضى</h1>
      <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">قائمة المرضى (UI فقط)</div>
        <div className="mt-3">
          <Link href={ROUTES.HEALTH.PATIENT("demo-1")} className="text-brand hover:underline">عرض ملف مريض تجريبي</Link>
        </div>
      </div>
    </main>
  );
}


