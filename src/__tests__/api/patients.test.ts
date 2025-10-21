import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/patients/route';
import { realDB } from '@/lib/supabase-real';
import { whatsappAPI } from '@/lib/whatsapp-business-api';
// Comprehensive API Tests for Patients

// Mock dependencies
jest.mock('@/lib/supabase-real');
jest.mock('@/lib/whatsapp-business-api');

const mockRealDB = realDB as jest.Mocked<typeof realDB>;
const mockWhatsappAPI = whatsappAPI as jest.Mocked<typeof whatsappAPI>;

describe('/api/patients', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/patients', () => {
    it('should return patients with pagination', async () => {
      // Mock data removed - using real database
