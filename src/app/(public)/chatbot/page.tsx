import React from "react";

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Calendar, Phone, Mail, MapPin, Clock, MessageCircle, Settings, Brain, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
}

const HealthcareChatbot: React.FC = () => {
  const user, isAuthenticated = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [appointmentSuggestions, setAppointmentSuggestions] = useState<AppointmentSuggestion[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
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

  const loadChatHistory = async() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'bot',
        content: 'مرحباً! أنا معين، مساعدك الذكي في مركز الهمم للرعاية الصحية. كيف يمكنني مساعدتك اليوم؟',
        timestamp: new Date()
      }
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = async() => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // إرسال الرسالة إلى API
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: user?.id,
          conversationId: 'current-conversation'
        })
      });

      const data = await response.json();

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.message || 'عذراً، حدث خطأ في المعالجة',
        timestamp: new Date(),
        metadata: data.metadata
      };

      setMessages((prev) => [...prev, botResponse]);

      if (data.appointmentSuggestions) {
        setAppointmentSuggestions(data.appointmentSuggestions);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const handleAppointmentBooking = async(suggestion: AppointmentSuggestion, slot: string) => {
    try {
      const response = await fetch('/api/chatbot/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: suggestion.id,
          appointmentTime: slot,
          patientId: user?.id,
          conversationId: 'current-conversation'
        })
      });

      const data = await response.json();

      if (data.success) {
        const confirmationMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'bot',
          content: `تم حجز موعدك بنجاح! رقم الموعد: ${data.appointmentId}. ستحصل على رسالة تأكيد قريباً.`
          timestamp: new Date(),
          metadata: {
            appointmentId: data.appointmentId,
            doctorName: suggestion.doctorName,
            appointmentDate: new Date().toISOString().split('T')[0],
            appointmentTime: slot
          }
        };
        setMessages((prev) => [...prev, confirmationMessage]);
        setAppointmentSuggestions([]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'عذراً، لم يتم حجز الموعد. يرجى المحاولة مرة أخرى أو الاتصال بنا.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const quickActions = [
    { text: 'حجز موعد', icon: Calendar, action: 'أريد حجز موعد' },
    { text: 'استعلام عن موعد', icon: Clock, action: 'أريد الاستعلام عن موعدي' },
    { text: 'إلغاء موعد', icon: X, action: 'أريد إلغاء موعدي' },
    { text: 'معلومات المركز', icon: MapPin, action: 'أريد معلومات عن المركز' }
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-lg hover:shadow-xl"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="معين"
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="font-semibold">معين - المساعد الذكي</h3>
              <p className="text-sm opacity-90">مركز الهمم للرعاية الصحية</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 h-[400px]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`
            >
              <div
                className={`
                  message.type === 'user'
                    ? 'bg-[var(--brand-primary)] text-white'
                    : 'bg-surface text-gray-900'
                }`
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Appointment Suggestions */}
      {appointmentSuggestions.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold mb-2">المواعيد المتاحة:</h4>
          <div className="space-y-2">
            {appointmentSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-sm">{suggestion.doctorName}</h5>
                    <p className="text-xs text-gray-600">{suggestion.specialty}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {suggestion.availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleAppointmentBooking(suggestion, slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthcareChatbot;
