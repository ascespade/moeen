'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Calendar, Phone, Mail, MapPin, Clock, MessageCircle, Settings, Brain } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    appointmentId?: string;
    doctorName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
  };
}

interface AppointmentSuggestion {
  id: string;
  doctorName: string;
  specialty: string;
  availableSlots: string[];
  date: string;
}

const MoainChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [appointmentSuggestions, setAppointmentSuggestions] = useState<AppointmentSuggestion[]>([]);
  const [learningMode, setLearningMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // تحميل الرسائل المحفوظة
  useEffect(() => {
    loadChatHistory();
  }, []);

  // التمرير التلقائي للرسائل الجديدة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    // محاكاة تحميل تاريخ المحادثة
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'bot',
        content: 'مرحباً! أنا معين، مساعدك الذكي في مركز الهمم. كيف يمكنني مساعدتك اليوم؟',
        timestamp: new Date()
      }
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // محاكاة استجابة البوت
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        metadata: botResponse.metadata
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // إذا كانت الاستجابة تحتوي على اقتراحات مواعيد
      if (botResponse.appointmentSuggestions) {
        setAppointmentSuggestions(botResponse.appointmentSuggestions);
      }
    }, 1500);
  };

  const generateBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // تحليل نية المستخدم
    if (input.includes('موعد') || input.includes('حجز') || input.includes('زيارة')) {
      return {
        content: 'أفهم أنك تريد حجز موعد. دعني أساعدك في العثور على أفضل وقت متاح.',
        appointmentSuggestions: [
          {
            id: '1',
            doctorName: 'د. سارة أحمد',
            specialty: 'طب الأطفال',
            availableSlots: ['09:00', '10:00', '11:00', '14:00'],
            date: '2024-01-15'
          },
          {
            id: '2',
            doctorName: 'د. محمد حسن',
            specialty: 'العلاج الطبيعي',
            availableSlots: ['08:00', '09:30', '11:00', '13:30'],
            date: '2024-01-15'
          }
        ]
      };
    }
    
    if (input.includes('إلغاء') || input.includes('تغيير')) {
      return {
        content: 'يمكنني مساعدتك في إلغاء أو تغيير موعدك. يرجى إعطائي رقم الموعد أو اسم المريض.',
        metadata: {
          appointmentId: 'APT-001'
        }
      };
    }
    
    if (input.includes('ساعات') || input.includes('وقت') || input.includes('متى')) {
      return {
        content: 'مركز الهمم مفتوح من السبت إلى الخميس من 8:00 صباحاً إلى 6:00 مساءً. الجمعة من 2:00 مساءً إلى 6:00 مساءً.',
        metadata: {
          appointmentDate: '2024-01-15',
          appointmentTime: '09:00'
        }
      };
    }
    
    if (input.includes('عنوان') || input.includes('موقع') || input.includes('أين')) {
      return {
        content: 'مركز الهمم يقع في جدة، المملكة العربية السعودية. يمكنك العثور على العنوان الدقيق في صفحة "تواصل معنا".',
        metadata: {
          appointmentDate: '2024-01-15',
          appointmentTime: '09:00'
        }
      };
    }
    
    if (input.includes('تأمين') || input.includes('تكلفة') || input.includes('سعر')) {
      return {
        content: 'نقبل جميع شركات التأمين الرئيسية في المملكة. يرجى إحضار بطاقة التأمين معك عند الزيارة.',
        metadata: {
          appointmentDate: '2024-01-15',
          appointmentTime: '09:00'
        }
      };
    }
    
    // استجابة عامة مع تعلم
    return {
      content: 'شكراً لك على سؤالك. سأقوم بتعلم هذا النوع من الاستفسارات لتحسين خدمتي في المستقبل. هل يمكنك إعطائي المزيد من التفاصيل؟',
      metadata: {
        appointmentDate: '2024-01-15',
        appointmentTime: '09:00'
      }
    };
  };

  const handleAppointmentSelect = (appointment: AppointmentSuggestion, time: string) => {
    const confirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: `تم حجز موعدك مع ${appointment.doctorName} في ${appointment.date} الساعة ${time}. ستصلك رسالة تأكيد قريباً.`,
      timestamp: new Date(),
      metadata: {
        appointmentId: `APT-${Date.now()}`,
        doctorName: appointment.doctorName,
        appointmentDate: appointment.date,
        appointmentTime: time
      }
    };

    setMessages(prev => [...prev, confirmationMessage]);
    setAppointmentSuggestions([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">معين - المساعد الذكي</CardTitle>
                <p className="text-sm text-gray-600">مركز الهمم</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={learningMode ? "default" : "outline"} className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {learningMode ? 'يتعلم' : 'عادي'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLearningMode(!learningMode)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'bot' && (
                    <Bot className="w-4 h-4 mt-1 text-blue-600" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-4 h-4 mt-1 text-white" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Appointment Suggestions */}
      {appointmentSuggestions.length > 0 && (
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-sm">اقتراحات المواعيد المتاحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointmentSuggestions.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{appointment.doctorName}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                    <Badge variant="outline">{appointment.date}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {appointment.availableSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAppointmentSelect(appointment, time)}
                        className="text-xs"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input */}
      <Card className="rounded-none border-t">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoainChatbot;