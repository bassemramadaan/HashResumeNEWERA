import { describe, it, expect } from 'vitest';
import { personalInfoSchema } from '../lib/validation';

describe('Validation Schemas', () => {
  it('should validate valid personal info', () => {
    const schema = personalInfoSchema('en');
    const validData = {
      fullName: 'John Doe',
      jobTitle: 'Engineer',
      email: 'john@example.com',
      phone: '123456789',
      summary: 'A very long summary that is more than 10 characters'
    };
    
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail invalid personal info', () => {
    const schema = personalInfoSchema('en');
    const invalidData = {
      fullName: 'J', // too short
      jobTitle: '',
      email: 'invalid-email',
      phone: '123',
      summary: 'short'
    };
    
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      // @ts-ignore
      const errors = result.error?.issues || result.issues || JSON.parse(result.error?.message || '[]');
      expect(errors.length).toBeGreaterThan(0);
    }
  });

  it('should provide Arabic error messages', () => {
    const schema = personalInfoSchema('ar');
    const invalidData = {
      fullName: 'J',
      jobTitle: '',
      email: 'invalid-email',
      phone: '123',
      summary: 'short'
    };
    
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      // @ts-ignore
      const errors = result.error?.issues || result.issues || JSON.parse(result.error?.message || '[]');
      const emailError = errors.find((e: any) => e.path[0] === 'email');
      expect(emailError?.message).toBe('بريد إلكتروني غير صالح');
    }
  });
});
