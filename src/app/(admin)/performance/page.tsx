"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: number;
}

interface SystemHealth {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_latency: number;
  database_connections: number;
  response_time: number;
  uptime: string;
}

const PerformancePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadPerformanceData();
  }, [isAuthenticated, router]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const mockMetrics: PerformanceMetric[] = [
        {
          id: "1",
          name: "استخدام المعالج",
          value: 45,
          unit: "%",
          status: "good",
          trend: "stable",
          threshold: 80
        },
        {
          id: "2",
          name: "استخدام الذاكرة",
          value: 67,
          unit: "%",
          status: "warning",
          trend: "up",
          threshold: 70
        },
        {
          id: "3",
          name: "استخدام القرص الصلب",
          value: 34,
          unit: "%",
          status: "good",
          trend: "stable",
          threshold: 85
        },
        {
          id: "4",
          name: "زمن الاستجابة",
          value: 120,
          unit: "ms",
          status: "good",
          trend: "down",
          threshold: 500
        },
        {
          id: "5",
          name: "اتصالات قاعدة البيانات",
          value: 23,
          unit: "اتصال",
          status: "good",
          trend: "stable",
          threshold: 100
        },
        {
          id: "6",
          name: "معدل الأخطاء",
          value: 0.2,
          unit: "%",
          status: "good",
          trend: "down",
          threshold: 5
        }
      ];

      const mockSystemHealth: SystemHealth = {
        cpu_usage: 45,
        memory_usage: 67,
        disk_usage: 34,
        network_latency: 12,
        database_connections: 23,
        response_time: 120,
        uptime: "15 يوم، 4 ساعات"
      };

      setMetrics(mockMetrics);
      setSystemHealth(mockSystemHealth);
    } catch (error) {
      } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مراقبة الأداء</h1>
            <p className="text-gray-600 mt-2">مراقبة أداء النظام والموارد</p>
          </div>
          <Button onClick={loadPerformanceData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المعالج</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.cpu_usage}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${systemHealth.cpu_usage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الذاكرة</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.memory_usage}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${systemHealth.memory_usage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">القرص الصلب</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.disk_usage}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${systemHealth.disk_usage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">زمن الاستجابة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.response_time}ms</div>
              <p className="text-xs text-muted-foreground">متوسط الاستجابة</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{metric.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {metric.value} {metric.unit}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>الحد الأقصى: {metric.threshold} {metric.unit}</span>
                <span className={getStatusColor(metric.status)}>
                  {metric.status === 'good' ? 'جيد' : 
                   metric.status === 'warning' ? 'تحذير' : 'حرج'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Information */}
      {systemHealth && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>معلومات النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">وقت التشغيل:</span>
                  <span className="text-sm text-gray-600">{systemHealth.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">اتصالات قاعدة البيانات:</span>
                  <span className="text-sm text-gray-600">{systemHealth.database_connections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">زمن الشبكة:</span>
                  <span className="text-sm text-gray-600">{systemHealth.network_latency}ms</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">حالة الخادم:</span>
                  <Badge variant="default">نشط</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">آخر تحديث:</span>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleString('ar-SA')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">الإصدار:</span>
                  <span className="text-sm text-gray-600">v2.1.0</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformancePage;

