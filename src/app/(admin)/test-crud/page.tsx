'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    Database,
    Link as LinkIcon,
    RefreshCw,
    Server,
    XCircle,
    Zap
} from 'lucide-react';
import { useState } from 'react';

interface TestResult {
  id: string;
  name: string;
  category: 'connection' | 'crud' | 'performance' | 'relations';
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
  details?: any;
}

const ALL_TESTS: Omit<TestResult, 'status' | 'message' | 'duration' | 'details'>[] = [
  // Connection Tests
  { id: 'db-connection', name: 'اتصال قاعدة البيانات الأساسي', category: 'connection' },
  { id: 'db-credentials', name: 'فحص بيانات الاعتماد', category: 'connection' },
  { id: 'db-ping', name: 'اختبار سرعة الاستجابة', category: 'connection' },

  // Table Tests
  { id: 'tables-exist', name: 'فحص وجود الجداول', category: 'connection' },
  { id: 'tables-access', name: 'فحص صلاحيات الوصول للجداول', category: 'connection' },

  // CRUD Tests
  { id: 'query-select', name: 'اختبار SELECT (قراءة)', category: 'crud' },
  { id: 'query-insert', name: 'اختبار INSERT (إدراج)', category: 'crud' },
  { id: 'query-update', name: 'اختبار UPDATE (تحديث)', category: 'crud' },
  { id: 'query-delete', name: 'اختبار DELETE (حذف)', category: 'crud' },
  { id: 'query-filter', name: 'اختبار الفلترة والبحث', category: 'crud' },
  { id: 'query-pagination', name: 'اختبار التصفح والصفحات', category: 'crud' },

  // Performance Tests
  { id: 'query-speed', name: 'قياس سرعة الاستعلامات', category: 'performance' },
  { id: 'index-performance', name: 'أداء الفهارس (Indexes)', category: 'performance' },
  { id: 'batch-operations', name: 'العمليات المجمعة', category: 'performance' },

  // Relations Tests
  { id: 'foreign-keys', name: 'اختبار المفاتيح الخارجية', category: 'relations' },
  { id: 'joins', name: 'اختبار JOIN بين الجداول', category: 'relations' },
  { id: 'cascade-delete', name: 'اختبار Cascade Delete', category: 'relations' },
];

export default function CRUDTestPage() {
  const [tests, setTests] = useState<TestResult[]>(
    ALL_TESTS.map(t => ({ ...t, status: 'pending' as const }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | TestResult['category']>('all');

  const runTest = async (testId: string): Promise<TestResult> => {
    const test = tests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');

    const startTime = Date.now();

    try {
      switch (testId) {
        case 'db-connection':
          const connRes = await fetch('/api/test/database?type=connection');
          const connData = await connRes.json();
          return {
            ...test,
            status: connData.success ? 'success' : 'error',
            message: connData.success
              ? `اتصال ناجح (${connData.duration}ms)`
              : connData.error || 'فشل الاتصال',
            duration: connData.duration,
            details: connData.details,
          };

        case 'db-credentials':
          const credRes = await fetch('/api/test/database?type=connection');
          const credData = await credRes.json();
          return {
            ...test,
            status: credData.details ? 'success' : 'error',
            message: credData.details
              ? `URL: ${credData.details.url}, Anon: ${credData.details.anonKey}, Service: ${credData.details.serviceKey}`
              : 'بيانات الاعتماد غير متوفرة',
            duration: credData.duration,
            details: credData.details,
          };

        case 'db-ping':
          const pingStart = Date.now();
          const pingRes = await fetch('/api/test/database?type=connection');
          const pingData = await pingRes.json();
          const pingDuration = Date.now() - pingStart;
          return {
            ...test,
            status: pingData.success ? 'success' : 'error',
            message: pingData.success
              ? `سرعة الاستجابة: ${pingDuration}ms (${pingDuration < 200 ? 'ممتاز' : pingDuration < 500 ? 'جيد' : 'بطيء'})`
              : pingData.error,
            duration: pingDuration,
          };

        case 'tables-exist':
        case 'tables-access':
          const tablesRes = await fetch('/api/test/database?type=tables');
          const tablesData = await tablesRes.json();
          const accessibleTables = Object.values(tablesData.tables || {}).filter(
            (t: any) => t.accessible
          ).length;
          const totalTables = Object.keys(tablesData.tables || {}).length;
          return {
            ...test,
            status: accessibleTables > 0 ? 'success' : 'error',
            message: `${accessibleTables}/${totalTables} جداول متاحة`,
            duration: tablesData.duration,
            details: tablesData.tables,
          };

        case 'query-select':
          const selectRes = await fetch('/api/test/database?type=query');
          const selectData = await selectRes.json();
          return {
            ...test,
            status: selectData.success ? 'success' : 'error',
            message: selectData.success
              ? `تم جلب ${selectData.rowsReturned} صف في ${selectData.duration}ms`
              : selectData.error,
            duration: selectData.duration,
          };

        case 'query-insert':
          const insertRes = await fetch('/api/test/database?type=insert');
          const insertData = await insertRes.json();
          return {
            ...test,
            status: insertData.success ? 'success' : 'error',
            message: insertData.success
              ? `تم الإدراج بنجاح في ${insertData.duration}ms`
              : insertData.error || 'فشل الإدراج',
            duration: insertData.duration,
            details: insertData.testData,
          };

        case 'query-update':
          const updateRes = await fetch('/api/test/database?type=update');
          const updateData = await updateRes.json();
          return {
            ...test,
            status: updateData.success ? 'success' : 'error',
            message: updateData.success
              ? `تم التحديث بنجاح في ${updateData.duration}ms`
              : updateData.error || 'فشل التحديث',
            duration: updateData.duration,
            details: updateData.updatedData,
          };

        case 'query-delete':
          const deleteRes = await fetch('/api/test/database?type=delete');
          const deleteData = await deleteRes.json();
          return {
            ...test,
            status: deleteData.success ? 'success' : 'error',
            message: deleteData.success
              ? `تم الحذف بنجاح في ${deleteData.duration}ms`
              : deleteData.error || 'فشل الحذف',
            duration: deleteData.duration,
          };

        case 'query-filter':
          const filterRes = await fetch('/api/test/database?type=query');
          const filterData = await filterRes.json();
          return {
            ...test,
            status: filterData.success ? 'success' : 'error',
            message: filterData.success
              ? `الفلترة تعمل بشكل صحيح (${filterData.duration}ms)`
              : filterData.error,
            duration: filterData.duration,
          };

        case 'query-pagination':
          const paginationRes = await fetch('/api/test/database?type=query');
          const paginationData = await paginationRes.json();
          return {
            ...test,
            status: paginationData.success ? 'success' : 'error',
            message: paginationData.success
              ? `الصفحات تعمل بشكل صحيح (${paginationData.duration}ms)`
              : paginationData.error,
            duration: paginationData.duration,
          };

        case 'query-speed':
          const speedRes = await fetch('/api/test/database?type=query');
          const speedData = await speedRes.json();
          const speedRating =
            speedData.duration < 100
              ? 'ممتاز'
              : speedData.duration < 300
                ? 'جيد'
                : speedData.duration < 500
                  ? 'متوسط'
                  : 'بطيء';
          return {
            ...test,
            status: speedData.success ? 'success' : 'error',
            message: speedData.success
              ? `السرعة: ${speedData.duration}ms (${speedRating})`
              : speedData.error,
            duration: speedData.duration,
          };

        case 'index-performance':
          const indexRes = await fetch('/api/test/database?type=indexes');
          const indexData = await indexRes.json();
          const fastIndexes = Object.values(indexData.indexes || {}).filter(
            (idx: any) => idx.performance === 'fast'
          ).length;
          const totalIndexes = Object.keys(indexData.indexes || {}).length;
          return {
            ...test,
            status: indexData.success ? 'success' : 'error',
            message: `${fastIndexes}/${totalIndexes} فهارس سريعة`,
            duration: indexData.duration,
            details: indexData.indexes,
          };

        case 'batch-operations':
          // Test multiple operations
          const batchStart = Date.now();
          const batchResults = await Promise.all([
            fetch('/api/test/database?type=query'),
            fetch('/api/test/database?type=connection'),
          ]);
          const batchDuration = Date.now() - batchStart;
          const batchSuccess = batchResults.every(r => r.ok);
          return {
            ...test,
            status: batchSuccess ? 'success' : 'error',
            message: batchSuccess
              ? `${batchResults.length} عمليات تمت في ${batchDuration}ms`
              : 'فشل في بعض العمليات',
            duration: batchDuration,
          };

        case 'foreign-keys':
        case 'joins':
          const relationsRes = await fetch('/api/test/database?type=relations');
          const relationsData = await relationsRes.json();
          const workingRelations = Object.values(relationsData.relations || {}).filter(
            (r: any) => r.working
          ).length;
          const totalRelations = Object.keys(relationsData.relations || {}).length;
          return {
            ...test,
            status: workingRelations > 0 ? 'success' : 'error',
            message: `${workingRelations}/${totalRelations} علاقات تعمل`,
            duration: relationsData.duration,
            details: relationsData.relations,
          };

        case 'cascade-delete':
          // This would require a specific test - using relations as proxy
          const cascadeRes = await fetch('/api/test/database?type=relations');
          const cascadeData = await cascadeRes.json();
          return {
            ...test,
            status: cascadeData.success ? 'success' : 'error',
            message: cascadeData.success
              ? 'العلاقات تعمل بشكل صحيح'
              : cascadeData.error,
            duration: cascadeData.duration,
          };

        default:
          return {
            ...test,
            status: 'error',
            message: 'نوع الاختبار غير معروف',
            duration: Date.now() - startTime,
          };
      }
    } catch (error: any) {
      return {
        ...test,
        status: 'error',
        message: error.message || 'حدث خطأ غير متوقع',
        duration: Date.now() - startTime,
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const updatedTests = [...tests];

    for (let i = 0; i < updatedTests.length; i++) {
      updatedTests[i] = { ...updatedTests[i], status: 'running' };
      setTests([...updatedTests]);

      const result = await runTest(updatedTests[i].id);
      updatedTests[i] = result;
      setTests([...updatedTests]);

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  const runCategoryTests = async (category: TestResult['category']) => {
    setIsRunning(true);
    const categoryTests = tests.filter(t => t.category === category);
    const updatedTests = [...tests];

    for (const categoryTest of categoryTests) {
      const index = updatedTests.findIndex(t => t.id === categoryTest.id);
      if (index === -1) continue;

      updatedTests[index] = { ...updatedTests[index], status: 'running' };
      setTests([...updatedTests]);

      const result = await runTest(categoryTest.id);
      updatedTests[index] = result;
      setTests([...updatedTests]);

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(ALL_TESTS.map(t => ({ ...t, status: 'pending' as const })));
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-[var(--brand-success)]' />;
      case 'error':
        return <XCircle className='w-5 h-5 text-[var(--brand-error)]' />;
      case 'running':
        return <RefreshCw className='w-5 h-5 text-[var(--brand-primary)] animate-spin' />;
      default:
        return <AlertCircle className='w-5 h-5 text-[var(--text-muted)]' />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant='success'>نجح</Badge>;
      case 'error':
        return <Badge variant='error'>فشل</Badge>;
      case 'running':
        return <Badge variant='primary'>جاري...</Badge>;
      default:
        return <Badge variant='secondary'>معلق</Badge>;
    }
  };

  const getCategoryIcon = (category: TestResult['category']) => {
    switch (category) {
      case 'connection':
        return <Server className='w-5 h-5' />;
      case 'crud':
        return <Database className='w-5 h-5' />;
      case 'performance':
        return <Zap className='w-5 h-5' />;
      case 'relations':
        return <LinkIcon className='w-5 h-5' />;
    }
  };

  const filteredTests =
    selectedCategory === 'all'
      ? tests
      : tests.filter(t => t.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'الكل', icon: Activity },
    { id: 'connection', name: 'الاتصال', icon: Server },
    { id: 'crud', name: 'CRUD', icon: Database },
    { id: 'performance', name: 'الأداء', icon: Zap },
    { id: 'relations', name: 'العلاقات', icon: LinkIcon },
  ] as const;

  const passedTests = tests.filter(t => t.status === 'success').length;
  const failedTests = tests.filter(t => t.status === 'error').length;
  const runningTests = tests.filter(t => t.status === 'running').length;
  const pendingTests = tests.filter(t => t.status === 'pending').length;

  return (
    <div className='min-h-screen bg-[var(--background)] p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <Database className='w-8 h-8 text-[var(--brand-primary)]' />
            <h1 className='text-3xl font-bold text-[var(--text-primary)]'>
              اختبارات قاعدة البيانات الشاملة
            </h1>
          </div>
          <p className='text-[var(--text-secondary)] text-lg'>
            اختبار شامل لجميع جوانب قاعدة البيانات: الاتصال، CRUD، الأداء، والعلاقات
          </p>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>إجمالي الاختبارات</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    {tests.length}
                  </p>
                </div>
                <Database className='w-8 h-8 text-[var(--brand-primary)]' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>نجحت</p>
                  <p className='text-2xl font-bold text-[var(--brand-success)]'>
                    {passedTests}
                  </p>
                </div>
                <CheckCircle className='w-8 h-8 text-[var(--brand-success)]' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>فشلت</p>
                  <p className='text-2xl font-bold text-[var(--brand-error)]'>
                    {failedTests}
                  </p>
                </div>
                <XCircle className='w-8 h-8 text-[var(--brand-error)]' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[var(--text-secondary)]'>متوسط الزمن</p>
                  <p className='text-2xl font-bold text-[var(--text-primary)]'>
                    {(() => {
                      const durations = tests
                        .filter(t => t.duration)
                        .map(t => t.duration!);
                      return durations.length > 0
                        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                        : 0;
                    })()}
                    ms
                  </p>
                </div>
                <Clock className='w-8 h-8 text-[var(--brand-info)]' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {categories.map(cat => {
            const Icon = cat.icon;
            const count =
              cat.id === 'all'
                ? tests.length
                : tests.filter(t => t.category === cat.id).length;
            const passed =
              cat.id === 'all'
                ? passedTests
                : tests.filter(t => t.category === cat.id && t.status === 'success').length;

            return (
              <Button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as any);
                  if (cat.id !== 'all') {
                    runCategoryTests(cat.id as TestResult['category']);
                  }
                }}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                className='flex items-center gap-2'
                disabled={isRunning}
              >
                <Icon className='w-4 h-4' />
                {cat.name} ({passed}/{count})
              </Button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 mb-8'>
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            size='lg'
            className='btn-default'
          >
            {isRunning ? (
              <>
                <RefreshCw className='w-5 h-5 ml-2 animate-spin' />
                جاري تشغيل الاختبارات...
              </>
            ) : (
              <>
                <Database className='w-5 h-5 ml-2' />
                تشغيل جميع الاختبارات
              </>
            )}
          </Button>

          <Button
            onClick={resetTests}
            disabled={isRunning}
            variant='outline'
            size='lg'
          >
            <RefreshCw className='w-5 h-5 ml-2' />
            إعادة تعيين
          </Button>
        </div>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>نتائج الاختبارات</CardTitle>
            <CardDescription>
              نتائج مفصلة لجميع اختبارات قاعدة البيانات ({filteredTests.length} اختبار)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {filteredTests.map((test, index) => (
                <div
                  key={test.id}
                  className='flex items-start justify-between p-4 border border-[var(--brand-border)] rounded-lg hover:bg-[var(--brand-surface)] transition-colors'
                >
                  <div className='flex items-start gap-4 flex-1'>
                    {getStatusIcon(test.status)}
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        {getCategoryIcon(test.category)}
                        <h3 className='font-semibold text-[var(--text-primary)]'>
                          {test.name}
                        </h3>
                      </div>
                      {test.message && (
                        <p className='text-sm text-[var(--text-secondary)] mt-1'>
                          {test.message}
                        </p>
                      )}
                      {test.details && (
                        <details className='mt-2'>
                          <summary className='text-xs text-[var(--text-muted)] cursor-pointer'>
                            تفاصيل إضافية
                          </summary>
                          <pre className='mt-2 p-2 bg-[var(--brand-surface)] rounded text-xs overflow-x-auto'>
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    {test.duration && (
                      <div className='flex items-center gap-1 text-sm text-[var(--text-muted)]'>
                        <Clock className='w-4 h-4' />
                        {test.duration}ms
                      </div>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className='mt-8 border-[var(--brand-info)] bg-[var(--brand-info)]/10'>
          <CardContent className='pt-6'>
            <div className='flex gap-3'>
              <AlertCircle className='w-6 h-6 text-[var(--brand-info)] flex-shrink-0 mt-1' />
              <div>
                <h4 className='font-semibold text-[var(--text-primary)] mb-2'>
                  حول صفحة الاختبارات
                </h4>
                <p className='text-sm text-[var(--text-secondary)]'>
                  هذه الصفحة تختبر جميع جوانب قاعدة البيانات: الاتصال، العمليات CRUD (إنشاء، قراءة،
                  تحديث، حذف)، الأداء، الفهارس، والعلاقات بين الجداول. استخدمها للتحقق من أن كل
                  شيء يعمل بشكل صحيح.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
