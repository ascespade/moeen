'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Smartphone,
  Database,
  Cpu,
  Wifi,
  Shield
} from 'lucide-react'

interface SystemStats {
  activeUsers: number
  totalConversations: number
  messagesToday: number
  responseTime: number
  systemHealth: 'healthy' | 'warning' | 'critical'
  aiProvider: string
  whatsappStatus: 'connected' | 'disconnected'
  databaseStatus: 'connected' | 'disconnected'
  serverLoad: number
  memoryUsage: number
  uptime: string
}

interface LiveConversation {
  id: string
  patientName: string
  staffName: string
  lastMessage: string
  timestamp: string
  status: 'active' | 'waiting' | 'resolved'
  priority: 'low' | 'normal' | 'high' | 'urgent'
}

interface RecentActivity {
  id: string
  type: 'message' | 'appointment' | 'ai_response' | 'system'
  description: string
  timestamp: string
  user: string
}

export default function LiveMonitor() {
  const [stats, setStats] = useState<SystemStats>({
    activeUsers: 0,
    totalConversations: 0,
    messagesToday: 0,
    responseTime: 0,
    systemHealth: 'healthy',
    aiProvider: 'gemini',
    whatsappStatus: 'disconnected',
    databaseStatus: 'disconnected',
    serverLoad: 0,
    memoryUsage: 0,
    uptime: '0d 0h 0m'
  })

  const [conversations, setConversations] = useState<LiveConversation[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  // Simulate real-time data updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
        const mockStats: SystemStats = {
          activeUsers: Math.floor(Math.random() * 50) + 10,
          totalConversations: Math.floor(Math.random() * 200) + 100,
          messagesToday: Math.floor(Math.random() * 500) + 200,
          responseTime: Math.floor(Math.random() * 2000) + 500,
          systemHealth: Math.random() > 0.8 ? 'warning' : 'healthy',
          aiProvider: 'gemini',
          whatsappStatus: Math.random() > 0.1 ? 'connected' : 'disconnected',
          databaseStatus: 'connected',
          serverLoad: Math.floor(Math.random() * 80) + 10,
          memoryUsage: Math.floor(Math.random() * 70) + 20,
          uptime: '2d 14h 32m'
        }

        const mockConversations: LiveConversation[] = [
          {
            id: '1',
            patientName: 'أحمد محمد',
            staffName: 'د. سارة أحمد',
            lastMessage: 'شكراً لك، سأتابع التمارين',
            timestamp: '2 دقيقة',
            status: 'active',
            priority: 'normal'
          },
          {
            id: '2',
            patientName: 'فاطمة علي',
            staffName: 'د. خالد محمود',
            lastMessage: 'هل يمكنني حجز موعد جديد؟',
            timestamp: '5 دقائق',
            status: 'waiting',
            priority: 'high'
          },
          {
            id: '3',
            patientName: 'محمد عبدالله',
            staffName: 'مُعين (AI)',
            lastMessage: 'أهلاً بك في مركز الهمم! كيف يمكنني مساعدتك؟',
            timestamp: '1 دقيقة',
            status: 'active',
            priority: 'normal'
          }
        ]

        const mockActivities: RecentActivity[] = [
          {
            id: '1',
            type: 'ai_response',
            description: 'مُعين أجاب على استفسار من أحمد محمد',
            timestamp: '1 دقيقة',
            user: 'مُعين (AI)'
          },
          {
            id: '2',
            type: 'appointment',
            description: 'تم حجز موعد جديد لفاطمة علي',
            timestamp: '3 دقائق',
            user: 'د. خالد محمود'
          },
          {
            id: '3',
            type: 'message',
            description: 'رسالة جديدة من محمد عبدالله',
            timestamp: '5 دقائق',
            user: 'محمد عبدالله'
          }
        ]

        setStats(mockStats)
        setConversations(mockConversations)
        setActivities(mockActivities)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    if (isAutoRefresh) {
      const interval = setInterval(fetchData, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500'
      case 'disconnected': return 'text-red-500'
      case 'active': return 'text-blue-500'
      case 'waiting': return 'text-yellow-500'
      case 'resolved': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">مُعين - مراقب مباشر</h1>
              <p className="text-gray-600 mt-2">مراقبة مباشرة لنظام المساعد الذكي لمركز الهمم</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={isAutoRefresh ? "default" : "outline"}
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className="flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>{isAutoRefresh ? 'إيقاف التحديث' : 'تشغيل التحديث'}</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getHealthColor(stats.systemHealth)}`}></div>
                <span className="text-sm font-medium">النظام {stats.systemHealth === 'healthy' ? 'سليم' : 'تحذير'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمين النشطين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% من الأمس
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المحادثات النشطة</CardTitle>
              <MessageSquare className="h-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                +8% من الأمس
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الرسائل اليوم</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messagesToday}</div>
              <p className="text-xs text-muted-foreground">
                +15% من الأمس
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">وقت الاستجابة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responseTime}ms</div>
              <p className="text-xs text-muted-foreground">
                -5% من الأمس
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>حالة النظام</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">الحالة العامة</span>
                <Badge className={getHealthColor(stats.systemHealth)}>
                  {stats.systemHealth === 'healthy' ? 'سليم' : 'تحذير'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">WhatsApp</span>
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span className={`text-sm ${getStatusColor(stats.whatsappStatus)}`}>
                    {stats.whatsappStatus === 'connected' ? 'متصل' : 'غير متصل'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">قاعدة البيانات</span>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span className={`text-sm ${getStatusColor(stats.databaseStatus)}`}>
                    {stats.databaseStatus === 'connected' ? 'متصل' : 'غير متصل'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">مزود الذكاء الاصطناعي</span>
                <Badge variant="outline">{stats.aiProvider}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">حمل الخادم</span>
                <span className="text-sm">{stats.serverLoad}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">استخدام الذاكرة</span>
                <span className="text-sm">{stats.memoryUsage}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">وقت التشغيل</span>
                <span className="text-sm">{stats.uptime}</span>
              </div>
            </CardContent>
          </Card>

          {/* Live Conversations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>المحادثات المباشرة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{conversation.patientName}</span>
                        <span className="text-sm text-gray-500">مع {conversation.staffName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(conversation.priority)}>
                          {conversation.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(conversation.status)}>
                          {conversation.status === 'active' ? 'نشط' : 
                           conversation.status === 'waiting' ? 'انتظار' : 'محلول'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{conversation.timestamp}</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.status)}`}></div>
                        <span>مباشر</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>النشاط الأخير</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'ai_response' && <Cpu className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'appointment' && <Clock className="h-4 w-4 text-green-500" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                    {activity.type === 'system' && <Shield className="h-4 w-4 text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
