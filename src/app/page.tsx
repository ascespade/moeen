'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  MessageSquare, 
  Users, 
  Settings,
  Monitor,
  Smartphone,
  Database,
  Cpu
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <span className="text-3xl font-bold text-white">مُعين</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            المساعد الذكي لمركز الهمم
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نظام ذكي متكامل يجمع بين التكنولوجيا المتقدمة والرعاية الإنسانية
          </p>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Live Monitor */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-6 w-6 text-blue-600" />
                <span>المراقب المباشر</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                مراقبة مباشرة لنظام المساعد الذكي مع إحصائيات حية وتتبع المحادثات
              </p>
              <Link href="/live-monitor">
                <Button className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  فتح المراقب المباشر
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Conversations */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-green-600" />
                <span>إدارة المحادثات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                إدارة وتتبع جميع المحادثات مع المستفيدين والطاقم الطبي
              </p>
              <Link href="/conversations">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  إدارة المحادثات
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Users Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span>إدارة المستخدمين</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                إدارة المستفيدين والطاقم الطبي مع صلاحيات متقدمة
              </p>
              <Link href="/users">
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  إدارة المستخدمين
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-orange-600" />
              <span>حالة النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <p className="text-sm text-green-600">متصل</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">قاعدة البيانات</h3>
                <p className="text-sm text-blue-600">متصل</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <Cpu className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">الذكاء الاصطناعي</h3>
                <p className="text-sm text-purple-600">نشط</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">النظام العام</h3>
                <p className="text-sm text-orange-600">سليم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-gray-600" />
              <span>إجراءات سريعة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/settings">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>الإعدادات</span>
                </Button>
              </Link>
              
              <Link href="/analytics">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Activity className="h-6 w-6" />
                  <span>التحليلات</span>
                </Button>
              </Link>
              
              <Link href="/help">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>المساعدة</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>مُعين - المساعد الذكي لمركز الهمم</p>
          <p className="text-sm">نظام متكامل للرعاية الذكية</p>
        </div>
      </div>
    </div>
  )
}