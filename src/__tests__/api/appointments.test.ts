import { NextRequest } from 'next/server';
import { GET, POST, PUT } from '@/app/api/appointments/route';
import { realDB } from '@/lib/supabase-real';
import { whatsappAPI } from '@/lib/whatsapp-business-api';
// Comprehensive API Tests for Appointments

// Mock dependencies
jest.mock('@/lib/supabase-real');
jest.mock('@/lib/whatsapp-business-api');

const mockRealDB = realDB as jest.Mocked<typeof realDB>;
const mockWhatsappAPI = whatsappAPI as jest.Mocked<typeof whatsappAPI>;

describe('/api/appointments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/appointments', () => {
    it('should return appointments with filters', async () => {
      // Mock data removed - using real database
