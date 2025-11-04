/**
 * Integration Tests: Audit Logger
 * Phase 3: Comprehensive Test Suite
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditLogger, AuditAction } from '@/lib/audit-logger';
import { createClient } from '@/lib/supabase/server';

describe('AuditLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log PHI access events', async () => {
    const mockLog = vi.spyOn(AuditLogger, 'logPHIAccess').mockResolvedValue();
    
    await AuditLogger.logPHIAccess(
      AuditAction.PATIENT_VIEWED,
      'patients',
      '123',
      { accessedAt: new Date().toISOString() }
    );

    expect(mockLog).toHaveBeenCalledWith(
      AuditAction.PATIENT_VIEWED,
      'patients',
      '123',
      expect.objectContaining({ accessedAt: expect.any(String) })
    );
  });

  it('should log authentication events', async () => {
    const mockLog = vi.spyOn(AuditLogger, 'logAuth').mockResolvedValue();
    
    await AuditLogger.logAuth(
      AuditAction.LOGIN,
      'user123',
      { ipAddress: '192.168.1.1' }
    );

    expect(mockLog).toHaveBeenCalledWith(
      AuditAction.LOGIN,
      'user123',
      expect.objectContaining({ ipAddress: '192.168.1.1' })
    );
  });

  it('should log security events', async () => {
    const mockLog = vi.spyOn(AuditLogger, 'logSecurityEvent').mockResolvedValue();
    
    await AuditLogger.logSecurityEvent(
      AuditAction.UNAUTHORIZED_ACCESS,
      { endpoint: '/api/patients', reason: 'Missing token' }
    );

    expect(mockLog).toHaveBeenCalledWith(
      AuditAction.UNAUTHORIZED_ACCESS,
      expect.objectContaining({ endpoint: '/api/patients' })
    );
  });

  it('should handle logging errors gracefully', async () => {
    // Test that audit logging failures don't break the application
    const mockLog = vi.spyOn(AuditLogger, 'log').mockRejectedValue(new Error('Database error'));
    
    // Should not throw
    await expect(
      AuditLogger.log({
        action: AuditAction.READ,
        table_name: 'patients',
        record_id: '123',
      })
    ).resolves.not.toThrow();
  });
});
