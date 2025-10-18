"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Settings,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
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
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [appointmentSuggestions, setAppointmentSuggestions] = useState<
    AppointmentSuggestion[]
  >([]);
  const [learningMode, setLearningMode] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [flowOptions, setFlowOptions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // تحميل الرسائل المحفوظة
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadChatHistory();
  }, []);

  // التمرير التلقائي للرسائل الجديدة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      // جلب تاريخ المحادثة من قاعدة البيانات
      const response = await fetch(
        "/api/chatbot/messages?conversationId=current-conversation",
      );
      const data = await response.json();

      if (data.success && data.messages) {
        const dbMessages: ChatMessage[] = data.messages.map((msg: any) => ({
          id: msg.id,
          type: msg.sender_type === "user" ? "user" : "bot",
          content: msg.message_text,
          timestamp: new Date(msg.created_at),
          metadata: msg.metadata,
        }));
        setMessages(dbMessages);
      } else {
        // رسالة ترحيب افتراضية إذا لم توجد محادثة
        const welcomeMessage: ChatMessage = {
          id: "1",
          type: "bot",
          content:
            "مرحباً! أنا معين، مساعدك الذكي في مركز الهمم. كيف يمكنني مساعدتك اليوم؟",
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      // رسالة ترحيب في حالة الخطأ
      const welcomeMessage: ChatMessage = {
        id: "1",
        type: "bot",
        content:
          "مرحباً! أنا معين، مساعدك الذكي في مركز الهمم. كيف يمكنني مساعدتك اليوم؟",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // إرسال الرسالة إلى API
      const response = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          userId: "current-user", // سيتم ربطه بالمستخدم المسجل
          conversationId: "current-conversation",
          currentFlow: currentFlow,
          currentStep: currentStep,
        }),
      });

      const data = await response.json();

      if (data.message) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: data.message,
          timestamp: new Date(),
          metadata: data.metadata,
        };

        setMessages((prev) => [...prev, botMessage]);

        // تحديث حالة الـ Flow
        if (data.metadata?.flow) {
          setCurrentFlow(data.metadata.flow);
        }
        if (data.metadata?.step) {
          setCurrentStep(data.metadata.step);
        }
        if (data.metadata?.options) {
          setFlowOptions(data.metadata.options);
        }

        if (data.appointmentSuggestions) {
          setAppointmentSuggestions(data.appointmentSuggestions);
        }
      } else {
        // استجابة احتياطية
        const fallbackResponse = generateBotResponse(inputMessage);
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: fallbackResponse.content,
          timestamp: new Date(),
          metadata: fallbackResponse.metadata,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      // استجابة احتياطية في حالة الخطأ
      const fallbackResponse = generateBotResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          fallbackResponse.content ||
          "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        timestamp: new Date(),
        metadata: fallbackResponse.metadata,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    // تحليل نية المستخدم
    if (
      input.includes("موعد") ||
      input.includes("حجز") ||
      input.includes("زيارة")
    ) {
      return {
        content:
          "أفهم أنك تريد حجز موعد. دعني أساعدك في العثور على أفضل وقت متاح.",
        appointmentSuggestions: [
          {
            id: "1",
            doctorName: "د. سارة أحمد",
            specialty: "طب الأطفال",
            availableSlots: ["09:00", "10:00", "11:00", "14:00"],
            date: "2024-01-15",
          },
          {
            id: "2",
            doctorName: "د. محمد حسن",
            specialty: "العلاج الطبيعي",
            availableSlots: ["08:00", "09:30", "11:00", "13:30"],
            date: "2024-01-15",
          },
        ],
      };
    }

    if (input.includes("إلغاء") || input.includes("تغيير")) {
      return {
        content:
          "يمكنني مساعدتك في إلغاء أو تغيير موعدك. يرجى إعطائي رقم الموعد أو اسم المريض.",
        metadata: {
          appointmentId: "APT-001",
        },
      };
    }

    if (
      input.includes("ساعات") ||
      input.includes("وقت") ||
      input.includes("متى")
    ) {
      return {
        content:
          "مركز الهمم مفتوح من السبت إلى الخميس من 8:00 صباحاً إلى 6:00 مساءً. الجمعة من 2:00 مساءً إلى 6:00 مساءً.",
        metadata: {
          appointmentDate: "2024-01-15",
          appointmentTime: "09:00",
        },
      };
    }

    if (
      input.includes("عنوان") ||
      input.includes("موقع") ||
      input.includes("أين")
    ) {
      return {
        content:
          'مركز الهمم يقع في جدة، المملكة العربية السعودية. يمكنك العثور على العنوان الدقيق في صفحة "تواصل معنا".',
        metadata: {
          appointmentDate: "2024-01-15",
          appointmentTime: "09:00",
        },
      };
    }

    if (
      input.includes("تأمين") ||
      input.includes("تكلفة") ||
      input.includes("سعر")
    ) {
      return {
        content:
          "نقبل جميع شركات التأمين الرئيسية في المملكة. يرجى إحضار بطاقة التأمين معك عند الزيارة.",
        metadata: {
          appointmentDate: "2024-01-15",
          appointmentTime: "09:00",
        },
      };
    }

    // استجابة عامة مع تعلم
    return {
      content:
        "شكراً لك على سؤالك. سأقوم بتعلم هذا النوع من الاستفسارات لتحسين خدمتي في المستقبل. هل يمكنك إعطائي المزيد من التفاصيل؟",
      metadata: {
        appointmentDate: "2024-01-15",
        appointmentTime: "09:00",
      },
    };
  };

  const handleAppointmentSelect = async (
    appointment: AppointmentSuggestion,
    time: string,
  ) => {
    try {
      const response = await fetch("/api/chatbot/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: appointment.id,
          appointmentTime: time,
          patientId: "current-user", // سيتم ربطه بالمستخدم المسجل
          conversationId: "current-conversation",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const confirmationMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "bot",
          content: `تم حجز موعدك بنجاح! رقم الموعد: ${data.appointmentId}. ستحصل على رسالة تأكيد قريباً.`,
          timestamp: new Date(),
          metadata: {
            appointmentId: data.appointmentId,
            doctorName: appointment.doctorName,
            appointmentDate: appointment.date,
            appointmentTime: time,
          },
        };
        setMessages((prev) => [...prev, confirmationMessage]);
        setAppointmentSuggestions([]);
      } else {
        throw new Error(data.error || "فشل في حجز الموعد");
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "bot",
        content:
          "عذراً، لم يتم حجز الموعد. يرجى المحاولة مرة أخرى أو الاتصال بنا.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-surface" dir="rtl">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">معين - المساعد الذكي</CardTitle>
                <p className="text-sm text-gray-600">مركز الهمم</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={learningMode ? "primary" : "outline"}
                className="flex items-center gap-1"
              >
                <Brain className="w-3 h-3" />
                {learningMode ? "يتعلم" : "عادي"}
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
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-white border shadow-sm"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === "bot" && (
                    <Bot className="w-4 h-4 mt-1 text-[var(--brand-primary)]" />
                  )}
                  {message.type === "user" && (
                    <User className="w-4 h-4 mt-1 text-white" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("ar-SA")}
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
                  <Bot className="w-4 h-4 text-[var(--brand-primary)]" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
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
                      <h4 className="font-semibold">
                        {appointment.doctorName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {appointment.specialty}
                      </p>
                    </div>
                    <Badge variant="outline">{appointment.date}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {appointment.availableSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAppointmentSelect(appointment, time)
                        }
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

      {/* Flow Options */}
      {flowOptions.length > 0 && (
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-sm">اختر من الخيارات التالية:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {flowOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 justify-start"
                  onClick={() => handleSendMessage(option)}
                >
                  {option}
                </Button>
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
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-[var(--brand-primary)] hover:brightness-95"
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
