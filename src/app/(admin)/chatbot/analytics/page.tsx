'use client';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';

interface AnalyticsData {
  totalMessages: number;
  totalUsers: number;
  avgResponseTime: number;
  satisfactionRate: number;
  topFlows: Array<{
    name: string;
    usage: number;
    satisfaction: number;
  }>;
  channelStats: Array<{
    channel: string;
    messages: number;
    users: number;
    growth: number;
  }>;
  hourlyStats: Array<{
    hour: string;
    messages: number;
    users: number;
  }>;
  sentimentData: Array<{
    sentiment: string;
    count: number;
    percentage: number;
  }>;
}

const mockAnalytics: AnalyticsData = {
  totalMessages: 15420,
  totalUsers: 3247,
  avgResponseTime: 2.3,
  satisfactionRate: 4.2,
  topFlows: [
    { name: 'استقبال المرضى', usage: 1247, satisfaction: 4.5 },
    { name: 'حجز المواعيد', usage: 892, satisfaction: 4.3 },
    { name: 'استفسارات عامة', usage: 756, satisfaction: 4.1 },
    { name: 'تأكيد المواعيد', usage: 634, satisfaction: 4.4 },
    { name: 'الدعم الفني', usage: 423, satisfaction: 3.9 },
  ],
  channelStats: [
    { channel: 'واتساب', messages: 8923, users: 2156, growth: 12.5 },
    { channel: 'الموقع', messages: 4567, users: 892, growth: 8.3 },
    { channel: 'تيليجرام', messages: 1234, users: 156, growth: -2.1 },
    { channel: 'فيسبوك', messages: 696, users: 43, growth: 5.7 },
  ],
  hourlyStats: [
    { hour: '00:00', messages: 45, users: 23 },
    { hour: '01:00', messages: 32, users: 18 },
    { hour: '02:00', messages: 28, users: 15 },
    { hour: '03:00', messages: 35, users: 19 },
    { hour: '04:00', messages: 42, users: 22 },
    { hour: '05:00', messages: 58, users: 31 },
    { hour: '06:00', messages: 89, users: 45 },
    { hour: '07:00', messages: 156, users: 78 },
    { hour: '08:00', messages: 234, users: 112 },
    { hour: '09:00', messages: 312, users: 145 },
    { hour: '10:00', messages: 389, users: 178 },
    { hour: '11:00', messages: 445, users: 201 },
    { hour: '12:00', messages: 512, users: 234 },
    { hour: '13:00', messages: 478, users: 198 },
    { hour: '14:00', messages: 523, users: 245 },
    { hour: '15:00', messages: 567, users: 267 },
    { hour: '16:00', messages: 589, users: 278 },
    { hour: '17:00', messages: 612, users: 289 },
    { hour: '18:00', messages: 534, users: 256 },
    { hour: '19:00', messages: 456, users: 223 },
    { hour: '20:00', messages: 378, users: 189 },
    { hour: '21:00', messages: 289, users: 145 },
    { hour: '22:00', messages: 198, users: 98 },
    { hour: '23:00', messages: 123, users: 67 },
  ],
  sentimentData: [
    { sentiment: 'إيجابي', count: 8923, percentage: 65.2 },
    { sentiment: 'محايد', count: 3124, percentage: 22.8 },
    { sentiment: 'سلبي', count: 1633, percentage: 12.0 },
  ],
};

export default function ChatbotAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'day' | 'week' | 'month' | 'year'
  >('month');
  const [selectedMetric, setSelectedMetric] = useState<
    'messages' | 'users' | 'satisfaction'
  >('messages');

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-default-success';
    if (growth < 0) return 'text-default-error';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '↗️';
    if (growth < 0) return '↘️';
    return '➡️';
  };

  return (
    <div className='min-h-screen bg-[var(--default-surface)]'>
      {/* Header */}
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
                  تحليلات الشات بوت
                </h1>
                <p className='text-gray-600 dark:text-gray-300'>
                  إحصائيات وأداء المحادثات الذكية
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <select
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value as any)}
                className='rounded-lg border border-gray-300 px-3 py-2 text-sm'
              >
                <option value='day'>اليوم</option>
                <option value='week'>هذا الأسبوع</option>
                <option value='month'>هذا الشهر</option>
                <option value='year'>هذا العام</option>
              </select>
              <buttonclassName='btn-default rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]' aria-label="تصدير التقرير">
                تصدير التقرير
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='container-app py-8'>
        {/* Key Metrics */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              {mockAnalytics.totalMessages.toLocaleString()}
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              إجمالي الرسائل
            </div>
            <div className='text-sm text-default-success'>
              +12.5% من الشهر الماضي
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-success'>
              {mockAnalytics.totalUsers.toLocaleString()}
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              إجمالي المستخدمين
            </div>
            <div className='text-sm text-default-success'>
              +8.3% من الشهر الماضي
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-purple-600'>
              {mockAnalytics.avgResponseTime}ث
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              متوسط وقت الاستجابة
            </div>
            <div className='text-sm text-default-success'>
              -0.5ث من الشهر الماضي
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              {mockAnalytics.satisfactionRate}/5
            </div>
            <div className='mb-2 text-gray-600 dark:text-gray-300'>
              معدل الرضا
            </div>
            <div className='text-sm text-default-success'>
              +0.2 من الشهر الماضي
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className='mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Messages Chart */}
          <div className='card p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>الرسائل حسب الساعة</h3>
              <div className='flex gap-2'>
                <buttononClick={() = aria-label="Button"> { setSelectedMetric('messages')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="Button"> { setSelectedMetric('messages') } }}
                  className={`rounded-lg px-3 py-1 text-sm ${
                    selectedMetric === 'messages'
                      ? 'bg-[var(--default-default)] text-white'
                      : 'bg-surface text-gray-600'
                  }`}
                >
                  الرسائل
                </button>
                <buttononClick={() = aria-label="Button"> { setSelectedMetric('users')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="Button"> { setSelectedMetric('users') } }}
                  className={`rounded-lg px-3 py-1 text-sm ${
                    selectedMetric === 'users'
                      ? 'bg-[var(--default-default)] text-white'
                      : 'bg-surface text-gray-600'
                  }`}
                >
                  المستخدمين
                </button>
              </div>
            </div>
            <div className='flex h-64 items-end justify-between gap-1'>
              {mockAnalytics.hourlyStats.map((stat, index) => (
                <div key={index} className='flex flex-col items-center'>
                  <div
                    className='mb-2 w-4 rounded-t bg-[var(--default-default)]'
                    style={{
                      height: `${(selectedMetric === 'messages' ? stat.messages : stat.users) / 20}px`,
                    }}
                  ></div>
                  <span className='origin-left -rotate-45 transform text-xs text-gray-500'>
                    {stat.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className='card p-6'>
            <h3 className='mb-6 text-lg font-semibold'>تحليل المشاعر</h3>
            <div className='space-y-4'>
              {mockAnalytics.sentimentData.map((sentiment, index) => (
                <div key={index}>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='font-medium'>{sentiment.sentiment}</span>
                    <span className='text-sm text-gray-600'>
                      {sentiment.count.toLocaleString()} ({sentiment.percentage}
                      %)
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className={`h-2 rounded-full ${
                        sentiment.sentiment === 'إيجابي'
                          ? 'bg-default-success'
                          : sentiment.sentiment === 'محايد'
                            ? 'bg-default-warning'
                            : 'bg-default-error'
                      }`}
                      style={{ width: `${sentiment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Flows */}
        <div className='card mb-8 p-6'>
          <h3 className='mb-6 text-lg font-semibold'>
            أكثر التدفقات استخداماً
          </h3>
          <div className='space-y-4'>
            {mockAnalytics.topFlows.map((flow, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-surface p-4 dark:bg-gray-800'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[var(--default-default)] text-sm font-semibold text-white'>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className='font-medium'>{flow.name}</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                      {flow.usage} استخدام
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium'>
                    {flow.satisfaction}/5
                  </div>
                  <div className='text-xs text-gray-500'>معدل الرضا</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Statistics */}
        <div className='card p-6'>
          <h3 className='mb-6 text-lg font-semibold'>إحصائيات القنوات</h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300'>
                    القناة
                  </th>
                  <th className='px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300'>
                    الرسائل
                  </th>
                  <th className='px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300'>
                    المستخدمين
                  </th>
                  <th className='px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300'>
                    النمو
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAnalytics.channelStats.map((channel, index) => (
                  <tr
                    key={index}
                    className='border-b border-gray-100 dark:border-gray-800'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>
                          {channel.channel === 'واتساب'
                            ? '📱'
                            : channel.channel === 'الموقع'
                              ? '🌐'
                              : channel.channel === 'تيليجرام'
                                ? '✈️'
                                : '💬'}
                        </span>
                        <span className='font-medium'>{channel.channel}</span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-gray-600 dark:text-gray-300'>
                      {channel.messages.toLocaleString()}
                    </td>
                    <td className='px-4 py-3 text-gray-600 dark:text-gray-300'>
                      {channel.users.toLocaleString()}
                    </td>
                    <td className='px-4 py-3'>
                      <div
                        className={`flex items-center gap-1 ${getGrowthColor(channel.growth)}`}
                      >
                        <span>{getGrowthIcon(channel.growth)}</span>
                        <span className='font-medium'>
                          {Math.abs(channel.growth)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
