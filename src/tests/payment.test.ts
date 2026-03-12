import { describe, it, expect } from 'vitest';
import { PaymentService } from '../services/payment.service';

describe('PaymentService', () => {
  it('should create a checkout session', async () => {
    const sessionUrl = await PaymentService.createCheckoutSession('premium_plan');
    expect(sessionUrl).toContain('https://checkout.stripe.com/pay/cs_test_');
  });

  it('should verify a payment session', async () => {
    const isVerified = await PaymentService.verifyPayment('cs_test_123');
    expect(isVerified).toBe(true);
  });
});
