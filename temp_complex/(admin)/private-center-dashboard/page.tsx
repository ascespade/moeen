"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Award,
  Activity
} from "lucide-react";

interface CenterCompliance {
  compliant: boolean;
  violations: string[];
  recommendations: string[];
  score: number;
}

interface CenterAnalytics {
  totalPatients: number;
  newPatients: number;
  completedSessions: number;
  revenue: number;
  qualityMetrics: {
    patientSatisfaction: number;
    treatmentOutcomes: number;
    safetyIncidents: number;
  };
  complianceScore: number;
}

export default function PrivateCenterDashboard() {
  const [compliance, setCompliance] = useState<CenterCompliance | null>(null);
  const [analytics, setAnalytics] = useState<CenterAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchComplianceData();
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchComplianceData = async () => {
    try {
      const response = await fetch('/api/private-center/compliance');
      const data = await response.json();
      
      if (data.success) {
        setCompliance(data.data.compliance);
      }
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/private-center/analytics?period=${selectedPeriod}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات المركز...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المركز</h1>
                <p className="text-lg text-gray-600">مركز الهمم - إدارة شاملة</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="monthly">شهري</option>
                <option value="quarterly">ربعي</option>
                <option value="annual">سنوي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Compliance Status */}
        {compliance && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">حالة الامتثال</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                compliance.compliant 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {compliance.compliant ? 'متوافق' : 'غير متوافق'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">درجة الامتثال</h4>
                <p className="text-2xl font-bold text-blue-600">{compliance.score}%</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">المخالفات</h4>
                <p className="text-2xl font-bold text-green-600">{compliance.violations.length}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">التوصيات</h4>
                <p className="text-2xl font-bold text-orange-600">{compliance.recommendations.length}</p>
              </div>
            </div>

            {compliance.violations.length > 0 && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
                <h4 className="font-semibold text-red-900 mb-2">المخالفات:</h4>
                <ul className="text-red-700 space-y-1">
                  {compliance.violations.map((violation, index) => (
                    <li key={index}>• {violation}</li>
                  ))}
                </ul>
              </div>
            )}

            {compliance.recommendations.length > 0 && (
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900 mb-2">التوصيات:</h4>
                <ul className="text-blue-700 space-y-1">
                  {compliance.recommendations.map((recommendation, index) => (
                    <li key={index}>• {recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Analytics Overview */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المرضى</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalPatients}</p>
                    <p className="text-sm text-green-600">+{analytics.newPatients} جديد</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الجلسات المكتملة</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.completedSessions}</p>
                    <p className="text-sm text-green-600">هذا الشهر</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الإيرادات</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.revenue.toLocaleString()} ريال</p>
                    <p className="text-sm text-green-600">هذا الشهر</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">درجة الامتثال</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.complianceScore}%</p>
                    <p className="text-sm text-green-600">ممتاز</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">مؤشرات الجودة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">رضا المرضى</h4>
                  <p className="text-2xl font-bold text-green-600">{analytics.qualityMetrics.patientSatisfaction}/5</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">نتائج العلاج</h4>
                  <p className="text-2xl font-bold text-blue-600">{analytics.qualityMetrics.treatmentOutcomes}/5</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">الحوادث الأمنية</h4>
                  <p className="text-2xl font-bold text-red-600">{analytics.qualityMetrics.safetyIncidents}</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">نمو المرضى</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">رسم بياني لنمو المرضى</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">توزيع الخدمات</h3>
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">رسم بياني لتوزيع الخدمات</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}