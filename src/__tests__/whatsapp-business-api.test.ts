import { whatsappAPI } from '@/lib/whatsapp-business-api';

// Mock fetch for testing
global.fetch = jest.fn();

describe('WhatsAppBusinessAPI', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Text Messages', () => {
    test('should send text message successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            messages: [{ id: 'msg_123' }]
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.sendTextMessage(
        '+966501234567',
        'مرحبا'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg_123');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/messages'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('whatsapp')
        })
      );
    });

    test('should handle text message failure', async() => {
      const mockResponse = {
        ok: false,
        json: () =>
          Promise.resolve({
            error: { message: 'Invalid phone number' }
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.sendTextMessage(
        '+966501234567',
        'مرحبا'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid phone number');
    });
  });

  describe('Template Messages', () => {
    test('should send template message successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            messages: [{ id: 'msg_123' }]
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.sendTemplateMessage(
        '+966501234567',
        'appointment_confirmation',
        'ar',
        ['أحمد', '2024-01-20', '10:00']
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg_123');
    });

    test('should handle template message failure', async() => {
      const mockResponse = {
        ok: false,
        json: () =>
          Promise.resolve({
            error: { message: 'Template not found' }
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.sendTemplateMessage(
        '+966501234567',
        'invalid_template',
        'ar'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Template not found');
    });
  });

  describe('Media Messages', () => {
    test('should send image message successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            messages: [{ id: 'msg_123' }]
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.sendImageMessage(
        '+966501234567',
        'https://example.com/image.jpg',
        'صورة توضيحية'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg_123');
    });

    test('should send document message successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            messages: [{ id: 'msg_123' }]
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.sendDocumentMessage(
        '+966501234567',
        'https://example.com/doc.pdf',
        'document.pdf',
        'مستند مهم'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg_123');
    });
  });

  describe('Message Status', () => {
    test('should get message status successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'delivered',
            timestamp: '1640995200'
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.getMessageStatus('msg_123');

      expect(result).toEqual({
        status: 'delivered',
        timestamp: '1640995200'
      });
    });

    test('should handle message status failure', async() => {
      const mockResponse = {
        ok: false,
        json: () =>
          Promise.resolve({
            error: { message: 'Message not found' }
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.getMessageStatus('invalid_msg');

      expect(result).toBeNull();
    });
  });

  describe('Templates', () => {
    test('should get templates successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                name: 'appointment_confirmation',
                status: 'APPROVED',
                category: 'UTILITY',
                language: 'ar'
              }
            ]
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.getTemplates();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('appointment_confirmation');
    });

    test('should create template successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'template_123'
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const template = {
        name: 'test_template',
        category: 'UTILITY' as const,
        language: 'ar',
        components: [
          {
            type: 'BODY' as const,
            text: 'Hello {{1}}'
          }
        ]
      };

      const result = await whatsappAPI.createTemplate(template);

      expect(result.success).toBe(true);
      expect(result.templateId).toBe('template_123');
    });
  });

  describe('Webhook Processing', () => {
    test('should process webhook event', () => {
      const webhookEvent = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'entry_123',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '966501234567',
                    phone_number_id: 'phone_123'
                  },
                  contacts: [
                    {
                      profile: { name: 'أحمد' },
                      wa_id: '966501234567'
                    }
                  ],
                  messages: [
                    {
                      from: '966501234567',
                      id: 'msg_123',
                      timestamp: '1640995200',
                      type: 'text',
                      text: { body: 'مرحبا' }
                    }
                  ],
                  statuses: [
                    {
                      id: 'msg_123',
                      status: 'delivered',
                      timestamp: '1640995200',
                      recipient_id: '966501234567'
                    }
                  ]
                },
                field: 'messages'
              }
            ]
          }
        ]
      };

      const result = whatsappAPI.processWebhookEvent(webhookEvent);

      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].from).toBe('966501234567');
      expect(result.messages[0].messageId).toBe('msg_123');
      expect(result.messages[0].type).toBe('text');

      expect(result.statuses).toHaveLength(1);
      expect(result.statuses[0].messageId).toBe('msg_123');
      expect(result.statuses[0].status).toBe('delivered');
    });
  });

  describe('Webhook Verification', () => {
    test('should verify webhook with correct token', () => {
      process.env.WHATSAPP_VERIFY_TOKEN = 'test_token';

      const result = whatsappAPI.verifyWebhook(
        'subscribe',
        'test_token',
        'challenge_123'
      );
      expect(result).toBe(true);
    });

    test('should reject webhook with incorrect token', () => {
      process.env.WHATSAPP_VERIFY_TOKEN = 'test_token';

      const result = whatsappAPI.verifyWebhook(
        'subscribe',
        'wrong_token',
        'challenge_123'
      );
      expect(result).toBe(false);
    });
  });

  describe('Business Profile', () => {
    test('should get business profile successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'profile_123',
            about: 'مركز الهمم',
            address: 'جدة، حي الصفا'
          })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await whatsappAPI.getBusinessProfile();

      expect(result.success).toBe(true);
      expect(result.profile).toBeDefined();
    });

    test('should update business profile successfully', async() => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({})
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const profileData = {
        messaging_product: 'whatsapp',
        about: 'مركز الهمم - الحلول الرقمية المتكاملة',
        address: 'جدة، حي الصفا، شارع الأمير محمد بن عبدالعزيز'
      };

      const result = await whatsappAPI.updateBusinessProfile(profileData);

      expect(result.success).toBe(true);
    });
  });
});
