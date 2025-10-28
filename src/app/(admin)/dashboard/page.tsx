// src/app/(admin)/dashboard/page.tsx
// Real-time Dashboard Page
// Displays system metrics, health status, and automation status

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Activity,
  Server,
  Users,
  MessageSquare,
  Share2,
  Workflow,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw,
  Calendar,
} from 'lucide-react';

interface DashboardMetrics {
  timestamp: string;
  system: {
    health: Array<{
      service: string;
      status: string;
      lastCheck: string;
      details: any;
    }>;
    metrics: Array<{
      service: string;
      lastUpdate: string;
      metrics: any;
    }>;
  };
  automation: {
    socialMedia: {
      totalPosts: number;
      platforms: Record<string, any>;
      engagement: {
        totalViews: number;
        totalLikes: number;
        totalComments: number;
        totalShares: number;
      };
    };
    workflows: {
      totalWorkflows: number;
      validWorkflows: number;
      invalidWorkflows: number;
      commonIssues: Record<string, number>;
    };
    chatbot: {
      activeFlows: number;
      totalNodes: number;
      totalTemplates: number;
      languages: string[];
      categories: string[];
    };
  };
  healthcare: {
    patients: {
      total: number;
      active: number;
      newThisMonth: number;
      growthRate: number;
    };
    appointments: {
      total: number;
      today: number;
      thisWeek: number;
      completed: number;
      cancelled: number;
    };
    doctors: {
      total: number;
      active: number;
      specialties: Array<{ name: string; count: number }>;
    };
    revenue: {
      thisMonth: number;
      lastMonth: number;
      growthRate: number;
      averagePerPatient: number;
    };
  };
  crm: {
    leads: {
      total: number;
      new: number;
      qualified: number;
      converted: number;
    };
    deals: {
      total: number;
      won: number;
      lost: number;
      pipeline: number;
    };
    activities: {
      total: number;
      calls: number;
      meetings: number;
      tasks: number;
    };
  };
  summary: {
    overallHealth: string;
    activeServices: number;
    totalAutomation: number;
    errorRate: number;
  };
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();
      setMetrics(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
        return 'text-red-600';
      case 'degraded':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge variant='primary' className='bg-green-100 text-green-800'>
            Healthy
          </Badge>
        );
      case 'unhealthy':
        return <Badge variant='error'>Unhealthy</Badge>;
      case 'degraded':
        return (
          <Badge variant='warning' className='bg-yellow-100 text-yellow-800'>
            Degraded
          </Badge>
        );
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  if (loading && !metrics) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4' />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <AlertTriangle className='h-8 w-8 text-red-500 mx-auto mb-4' />
          <p className='text-red-600 mb-4'>Error loading dashboard: {error}</p>
          <Button onClick={fetchMetrics}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[var(--default-surface)]'>
      <div className='container-app py-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold'>System Dashboard</h1>
            <p className='text-gray-600'>
              Real-time monitoring and automation status
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-sm text-gray-500'>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button onClick={fetchMetrics} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Overall Health
              </CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold capitalize'>
                {metrics?.summary.overallHealth}
              </div>
              <p className='text-xs text-gray-600'>
                {metrics?.summary.activeServices} active services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Social Media
              </CardTitle>
              <Share2 className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {metrics?.automation.socialMedia.totalPosts}
              </div>
              <p className='text-xs text-gray-600'>
                {metrics?.automation.socialMedia.engagement.totalViews.toLocaleString()}{' '}
                total views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Workflows</CardTitle>
              <Workflow className='h-4 w-4 text-purple-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {metrics?.automation.workflows.validWorkflows}
              </div>
              <p className='text-xs text-gray-600'>
                of {metrics?.automation.workflows.totalWorkflows} workflows
                valid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Chatbot</CardTitle>
              <MessageSquare className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {metrics?.automation.chatbot.activeFlows}
              </div>
              <p className='text-xs text-gray-600'>
                {metrics?.automation.chatbot.totalNodes} total nodes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue='system' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='system'>System Health</TabsTrigger>
            <TabsTrigger value='healthcare'>الرعاية الصحية</TabsTrigger>
            <TabsTrigger value='crm'>إدارة العملاء</TabsTrigger>
            <TabsTrigger value='automation'>Automation</TabsTrigger>
            <TabsTrigger value='social'>Social Media</TabsTrigger>
            <TabsTrigger value='workflows'>Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value='system' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Status of all system services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {metrics?.system.health.map((service, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 border rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          <Server className='h-5 w-5 text-gray-500' />
                          <div>
                            <div className='font-medium'>{service.service}</div>
                            <div className='text-sm text-gray-500'>
                              Last check:{' '}
                              {new Date(service.lastCheck).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {getHealthBadge(service.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>System Metrics</CardTitle>
                  <CardDescription>
                    Performance and resource usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {metrics?.system.metrics.map((metric, index) => (
                      <div key={index} className='p-3 border rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <div className='font-medium'>{metric.service}</div>
                          <div className='text-sm text-gray-500'>
                            {new Date(metric.lastUpdate).toLocaleString()}
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                          <div>
                            <span className='text-gray-500'>CPU:</span>{' '}
                            {metric.metrics.cpuUsage || 0}%
                          </div>
                          <div>
                            <span className='text-gray-500'>Memory:</span>{' '}
                            {metric.metrics.memoryUsage || 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='healthcare' className='space-y-6'>
            {/* Healthcare Overview */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    إجمالي المرضى
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.healthcare.patients.total || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    +{metrics?.healthcare.patients.growthRate || 0}% من الشهر
                    الماضي
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    المواعيد اليوم
                  </CardTitle>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.healthcare.appointments.today || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {metrics?.healthcare.appointments.thisWeek || 0} هذا الأسبوع
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    الأطباء النشطون
                  </CardTitle>
                  <Activity className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.healthcare.doctors.active || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    من أصل {metrics?.healthcare.doctors.total || 0} طبيب
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    الإيرادات الشهرية
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.healthcare.revenue.thisMonth?.toLocaleString() ||
                      0}{' '}
                    ريال
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    +{metrics?.healthcare.revenue.growthRate || 0}% من الشهر
                    الماضي
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Appointments Status */}
            <Card>
              <CardHeader>
                <CardTitle>حالة المواعيد</CardTitle>
                <CardDescription>
                  نظرة عامة على المواعيد والأداء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <div className='text-2xl font-bold text-green-600'>
                      {metrics?.healthcare.appointments.completed || 0}
                    </div>
                    <div className='text-sm text-green-700'>مكتملة</div>
                  </div>
                  <div className='text-center p-4 bg-yellow-50 rounded-lg'>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {(metrics?.healthcare?.appointments?.total || 0) -
                        (metrics?.healthcare?.appointments?.completed || 0) -
                        (metrics?.healthcare?.appointments?.cancelled || 0)}
                    </div>
                    <div className='text-sm text-yellow-700'>معلقة</div>
                  </div>
                  <div className='text-center p-4 bg-red-50 rounded-lg'>
                    <div className='text-2xl font-bold text-red-600'>
                      {metrics?.healthcare.appointments.cancelled || 0}
                    </div>
                    <div className='text-sm text-red-700'>ملغية</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>التخصصات الطبية</CardTitle>
                <CardDescription>توزيع الأطباء حسب التخصص</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {metrics?.healthcare.doctors.specialties?.map(
                    (specialty, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between'
                      >
                        <span className='text-sm font-medium'>
                          {specialty.name}
                        </span>
                        <Badge variant='secondary'>{specialty.count}</Badge>
                      </div>
                    )
                  ) || (
                    <div className='text-center text-gray-500 py-4'>
                      لا توجد بيانات متاحة
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='crm' className='space-y-6'>
            {/* CRM Overview */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    إجمالي العملاء المحتملين
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.crm.leads.total || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {metrics?.crm.leads.new || 0} جديد
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>الصفقات</CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.crm.deals.total || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {metrics?.crm.deals.won || 0} مكتملة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>الأنشطة</CardTitle>
                  <Activity className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.crm.activities.total || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {metrics?.crm.activities.calls || 0} مكالمات
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    معدل التحويل
                  </CardTitle>
                  <CheckCircle className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {metrics?.crm.leads.total && metrics.crm.leads.total > 0
                      ? Math.round(
                          (metrics.crm.leads.converted /
                            metrics.crm.leads.total) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    من العملاء المحتملين
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='automation' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Automation</CardTitle>
                  <CardDescription>
                    Automated social media posting and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex justify-between'>
                      <span>Total Posts</span>
                      <span className='font-bold'>
                        {metrics?.automation.socialMedia.totalPosts || 0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Total Views</span>
                      <span className='font-bold'>
                        {metrics?.automation.socialMedia.engagement.totalViews.toLocaleString() ||
                          0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Total Likes</span>
                      <span className='font-bold'>
                        {metrics?.automation.socialMedia.engagement.totalLikes.toLocaleString() ||
                          0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Total Comments</span>
                      <span className='font-bold'>
                        {metrics?.automation.socialMedia.engagement.totalComments.toLocaleString() ||
                          0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workflow Status</CardTitle>
                  <CardDescription>
                    Automation workflow health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex justify-between'>
                      <span>Total Workflows</span>
                      <span className='font-bold'>
                        {metrics?.automation.workflows.totalWorkflows || 0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Valid Workflows</span>
                      <span className='font-bold text-green-600'>
                        {metrics?.automation.workflows.validWorkflows || 0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Invalid Workflows</span>
                      <span className='font-bold text-red-600'>
                        {metrics?.automation.workflows.invalidWorkflows || 0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Success Rate</span>
                      <span className='font-bold'>
                        {metrics?.automation.workflows.totalWorkflows &&
                        metrics.automation.workflows.totalWorkflows > 0
                          ? Math.round(
                              (metrics.automation.workflows.validWorkflows /
                                metrics.automation.workflows.totalWorkflows) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='social' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Social Media Engagement</CardTitle>
                <CardDescription>
                  Detailed social media performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {metrics?.automation.socialMedia.engagement.totalViews.toLocaleString() ||
                        0}
                    </div>
                    <div className='text-sm text-blue-700'>Total Views</div>
                  </div>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <div className='text-2xl font-bold text-green-600'>
                      {metrics?.automation.socialMedia.engagement.totalLikes.toLocaleString() ||
                        0}
                    </div>
                    <div className='text-sm text-green-700'>Total Likes</div>
                  </div>
                  <div className='text-center p-4 bg-yellow-50 rounded-lg'>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {metrics?.automation.socialMedia.engagement.totalComments.toLocaleString() ||
                        0}
                    </div>
                    <div className='text-sm text-yellow-700'>
                      Total Comments
                    </div>
                  </div>
                  <div className='text-center p-4 bg-purple-50 rounded-lg'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {metrics?.automation.socialMedia.engagement.totalShares.toLocaleString() ||
                        0}
                    </div>
                    <div className='text-sm text-purple-700'>Total Shares</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='workflows' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Workflow Management</CardTitle>
                <CardDescription>
                  Workflow health, performance, and common issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center p-4 bg-green-50 rounded-lg'>
                      <div className='text-2xl font-bold text-green-600'>
                        {metrics?.automation.workflows.validWorkflows || 0}
                      </div>
                      <div className='text-sm text-green-700'>
                        Valid Workflows
                      </div>
                    </div>
                    <div className='text-center p-4 bg-red-50 rounded-lg'>
                      <div className='text-2xl font-bold text-red-600'>
                        {metrics?.automation.workflows.invalidWorkflows || 0}
                      </div>
                      <div className='text-sm text-red-700'>
                        Invalid Workflows
                      </div>
                    </div>
                    <div className='text-center p-4 bg-blue-50 rounded-lg'>
                      <div className='text-2xl font-bold text-blue-600'>
                        {metrics?.automation.workflows.totalWorkflows || 0}
                      </div>
                      <div className='text-sm text-blue-700'>
                        Total Workflows
                      </div>
                    </div>
                  </div>

                  {metrics?.automation.workflows.commonIssues &&
                    Object.keys(metrics.automation.workflows.commonIssues)
                      .length > 0 && (
                      <div>
                        <h4 className='font-medium mb-3'>Common Issues</h4>
                        <div className='space-y-2'>
                          {Object.entries(
                            metrics.automation.workflows.commonIssues
                          ).map(([issue, count]) => (
                            <div
                              key={issue}
                              className='flex justify-between items-center p-2 bg-gray-50 rounded'
                            >
                              <span className='text-sm'>{issue}</span>
                              <Badge variant='warning'>{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
