'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  User, 
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export default function CRUDTestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending' },
    { name: 'Create Operation (POST)', status: 'pending' },
    { name: 'Read Operation (GET)', status: 'pending' },
    { name: 'Update Operation (PUT)', status: 'pending' },
    { name: 'Delete Operation (DELETE)', status: 'pending' },
    { name: 'Authentication Check', status: 'pending' },
    { name: 'Role Permissions', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [testData, setTestData] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    const updatedTests: TestResult[] = [...tests];

    // Test 1: Database Connection
    try {
      const startTime = Date.now();
      const response = await fetch('/api/health', { method: 'GET' });
      const data = await response.json();
      const duration = Date.now() - startTime;
      
      updatedTests[0] = {
        name: 'Database Connection',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? `Connected (${duration}ms)` : data.error,
        duration
      };
    } catch (error: any) {
      updatedTests[0] = {
        name: 'Database Connection',
        status: 'error',
        message: error.message
      };
    }
    setTests([...updatedTests]);

    // Test 2: Create Operation (POST)
    try {
      const startTime = Date.now();
      const testPatient = {
        name: 'Test Patient',
        email: `test_${Date.now()}@test.com`,
        phone: '0500000000',
        birthDate: '2000-01-01',
        gender: 'male'
      };
      
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPatient)
      });
      const data = await response.json();
      const duration = Date.now() - startTime;
      
      if (response.ok) {
        setTestData(data.data);
        updatedTests[1] = {
          name: 'Create Operation (POST)',
          status: 'success',
          message: `Created patient ID: ${data.data?.id?.substring(0, 8)}... (${duration}ms)`,
          duration
        };
      } else {
        updatedTests[1] = {
          name: 'Create Operation (POST)',
          status: 'error',
          message: data.error || 'Failed to create patient'
        };
      }
    } catch (error: any) {
      updatedTests[1] = {
        name: 'Create Operation (POST)',
        status: 'error',
        message: error.message
      };
    }
    setTests([...updatedTests]);

    // Test 3: Read Operation (GET)
    try {
      const startTime = Date.now();
      const response = await fetch('/api/patients?limit=5', { method: 'GET' });
      const data = await response.json();
      const duration = Date.now() - startTime;
      
      updatedTests[2] = {
        name: 'Read Operation (GET)',
        status: response.ok ? 'success' : 'error',
        message: response.ok 
          ? `Retrieved ${data.data?.length || 0} patients (${duration}ms)` 
          : data.error,
        duration
      };
    } catch (error: any) {
      updatedTests[2] = {
        name: 'Read Operation (GET)',
        status: 'error',
        message: error.message
      };
    }
    setTests([...updatedTests]);

    // Test 4: Update Operation (PUT)
    if (testData?.id) {
      try {
        const startTime = Date.now();
        const response = await fetch(`/api/patients/${testData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Updated Test Patient' })
        });
        const data = await response.json();
        const duration = Date.now() - startTime;
        
        updatedTests[3] = {
          name: 'Update Operation (PUT)',
          status: response.ok ? 'success' : 'error',
          message: response.ok 
            ? `Updated patient (${duration}ms)` 
            : data.error,
          duration
        };
      } catch (error: any) {
        updatedTests[3] = {
          name: 'Update Operation (PUT)',
          status: 'error',
          message: error.message
        };
      }
    } else {
      updatedTests[3] = {
        name: 'Update Operation (PUT)',
        status: 'error',
        message: 'No test data available'
      };
    }
    setTests([...updatedTests]);

    // Test 5: Delete Operation (DELETE)
    if (testData?.id) {
      try {
        const startTime = Date.now();
        const response = await fetch(`/api/patients/${testData.id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        const duration = Date.now() - startTime;
        
        updatedTests[4] = {
          name: 'Delete Operation (DELETE)',
          status: response.ok ? 'success' : 'error',
          message: response.ok 
            ? `Deleted patient (${duration}ms)` 
            : data.error,
          duration
        };
      } catch (error: any) {
        updatedTests[4] = {
          name: 'Delete Operation (DELETE)',
          status: 'error',
          message: error.message
        };
      }
    } else {
      updatedTests[4] = {
        name: 'Delete Operation (DELETE)',
        status: 'error',
        message: 'No test data available'
      };
    }
    setTests([...updatedTests]);

    // Test 6: Authentication Check
    try {
      const startTime = Date.now();
      const response = await fetch('/api/auth/session', { method: 'GET' });
      const data = await response.json();
      const duration = Date.now() - startTime;
      
      updatedTests[5] = {
        name: 'Authentication Check',
        status: response.ok ? 'success' : 'error',
        message: response.ok 
          ? `Auth working - User: ${data.data?.email || 'Guest'} (${duration}ms)` 
          : 'Not authenticated',
        duration
      };
    } catch (error: any) {
      updatedTests[5] = {
        name: 'Authentication Check',
        status: 'error',
        message: error.message
      };
    }
    setTests([...updatedTests]);

    // Test 7: Role Permissions
    try {
      const startTime = Date.now();
      const response = await fetch('/api/auth/permissions', { method: 'GET' });
      const data = await response.json();
      const duration = Date.now() - startTime;
      
      updatedTests[6] = {
        name: 'Role Permissions',
        status: response.ok ? 'success' : 'error',
        message: response.ok 
          ? `Permissions: ${data.data?.role || 'none'} (${duration}ms)` 
          : 'No permissions',
        duration
      };
    } catch (error: any) {
      updatedTests[6] = {
        name: 'Role Permissions',
        status: 'error',
        message: error.message
      };
    }
    setTests([...updatedTests]);

    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(tests.map(t => ({ ...t, status: 'pending' as const, message: undefined, duration: undefined })));
    setTestData(null);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'error':
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const passedTests = tests.filter(t => t.status === 'success').length;
  const failedTests = tests.filter(t => t.status === 'error').length;
  const pendingTests = tests.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8 text-[var(--brand-primary)]" />
            <h1 className="text-3xl font-bold text-foreground">
              CRUD & Database Connection Test
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            اختبار شامل لجميع عمليات قاعدة البيانات والاتصالات
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold">{tests.length}</p>
                </div>
                <Database className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{passedTests}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{failedTests}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-gray-600">{pendingTests}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={runTests}
            disabled={isRunning}
            size="lg"
            className="btn-default"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Run All Tests
              </>
            )}
          </Button>

          <Button
            onClick={resetTests}
            disabled={isRunning}
            variant="outline"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset Tests
          </Button>
        </div>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              نتائج مفصلة لجميع اختبارات CRUD وقاعدة البيانات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {test.name}
                      </h3>
                      {test.message && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {test.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {test.duration && (
                      <span className="text-sm text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Data Display */}
        {testData && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Data Created</CardTitle>
              <CardDescription>
                البيانات التجريبية التي تم إنشاؤها أثناء الاختبار
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-surface p-4 rounded-lg overflow-x-auto">
                <code>{JSON.stringify(testData, null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  About This Test Page
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  This page tests all CRUD operations (Create, Read, Update, Delete) with the database. 
                  It also checks authentication and permissions systems. Use this to verify that all 
                  database connections and API endpoints are working correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
