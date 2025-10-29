'use client';

import logger from '@/lib/monitoring/logger';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MoeenChatbotProps {
  position?: 'bottom-right' | 'bottom-left';
}

export default function MoeenChatbot({
  position = 'bottom-right',
}: MoeenChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'أهلاً بك في مركز الهمم 👋\n\nأنا معين، مساعدك الرقمي. نحن هنا لتقديم الدعم لكل فرد.\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick actions
  const quickActions = [
    { id: 1, text: 'احجز موعد', action: 'book_appointment' },
    { id: 2, text: 'الخدمات المتوفرة', action: 'services' },
    { id: 3, text: '📞 طلب مكالمة عاجلة', action: 'request_call' },
    { id: 4, text: 'أسئلة شائعة', action: 'faq' },
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle quick action
  const handleQuickAction = async (action: string) => {
    if (action === 'request_call') {
      await handleCallRequest();
      return;
    }

    const actionMessages: Record<string, string> = {
      book_appointment: 'أريد حجز موعد',
      services: 'ما هي الخدمات المتوفرة؟',
      contact_specialist: 'أريد التواصل مع أخصائي',
      faq: 'عندي أسئلة',
    };

    const userMessage = actionMessages[action];
    if (userMessage) {
      await handleSendMessage(userMessage);
    }
  };

  // Handle call request (طلب مكالمة عاجلة)
  const handleCallRequest = async () => {
    setIsLoading(true);

    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: 'أريد طلب مكالمة عاجلة من المشرف',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Create call request
      const response = await fetch('/api/supervisor/call-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'طلب من الشاتبوت',
          priority: 'high',
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.success
          ? '✅ تم إرسال طلبك للمشرف!\n\nسيتواصل معك خلال دقائق.\n\nفي حالة عدم الرد، سنحول الطلب للمدير تلقائياً.\n\nشكراً لصبرك 🙏'
          : '❌ عذراً، حدث خطأ في إرسال الطلب.\n\nيرجى الاتصال مباشرة:\n📞 +966126173693\n📱 +966555381558',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      logger.error('Call request error', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'حدث خطأ. يرجى الاتصال مباشرة:\n📞 +966126173693',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call chatbot API
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      logger.error('Chatbot error', error);

      // Fallback response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'عذراً، يبدو أن هناك مشكلة في الاتصال. يرجى التواصل معنا عبر الواتساب: +966555381558',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionClasses =
    position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${positionClasses} z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-lg border-2 border-white transition-all hover:scale-110 hover:shadow-xl ${
          isOpen ? 'rotate-90' : ''
        }`}
        aria-label='فتح مساعد معين'
      >
        {isOpen ? (
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        ) : (
          <div className='text-center'>
            <div className='text-2xl mb-0.5'>🤖</div>
            <div className='text-[10px] font-bold leading-tight'>معين</div>
          </div>
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && messages.length > 1 && (
        <div
          className={`fixed ${positionClasses} z-40 translate-x-10 -translate-y-2`}
        >
          <div className='h-5 w-5 rounded-full bg-[var(--brand-error)] flex items-center justify-center text-[10px] font-bold text-white animate-pulse shadow-md'>
            {messages.filter(m => m.role === 'assistant').length - 1}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed ${positionClasses} z-40 mb-16 h-[500px] w-[360px] overflow-hidden rounded-xl bg-[var(--panel)] shadow-2xl border border-[var(--brand-border)] flex flex-col`}
        >
          {/* Header */}
          <div className='bg-[var(--brand-primary)] p-3 text-white'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-xl backdrop-blur'>
                  🤖
                </div>
                <div>
                  <h3 className='text-lg font-bold'>معين</h3>
                  <p className='text-xs text-white/80'>مساعدك الرقمي</p>
                </div>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='h-2 w-2 rounded-full bg-[var(--brand-success)] animate-pulse'></div>
                <span className='text-xs'>متصل</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-3 space-y-3 bg-[var(--background)]'>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[var(--panel)] text-[var(--text-primary)] border border-[var(--brand-border)] shadow-sm'
                  }`}
                >
                  <p className='whitespace-pre-wrap leading-relaxed text-sm'>
                    {message.content}
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      message.role === 'user'
                        ? 'text-white/70'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-[var(--panel)] rounded-lg px-3 py-2 border border-[var(--brand-border)]'>
                  <div className='flex gap-1.5'>
                    <div className='h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)] animate-bounce'></div>
                    <div
                      className='h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)] animate-bounce'
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className='h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)] animate-bounce'
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className='border-t border-[var(--brand-border)] p-3 bg-[var(--panel)]'>
              <p className='text-xs text-[var(--text-secondary)] mb-2'>
                اختصارات سريعة:
              </p>
              <div className='grid grid-cols-2 gap-2'>
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.action)}
                    className='rounded-md bg-[var(--brand-surface)] px-2 py-1.5 text-xs text-[var(--text-primary)] transition-all hover:bg-[var(--brand-primary)] hover:text-white border border-[var(--brand-border)]'
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className='border-t border-[var(--brand-border)] p-3 bg-[var(--panel)]'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='اكتب رسالتك...'
                className='flex-1 rounded-md border border-[var(--brand-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20'
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className='rounded-md bg-[var(--brand-primary)] px-3 py-2 text-white transition-all hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label='إرسال'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
