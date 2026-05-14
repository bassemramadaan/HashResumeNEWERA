/**
 * Payment Service
 * Handles code-based payment verification via secure server-side API.
 * SECURITY: No localStorage-based access control. All verification is server-side.
 */
export const PaymentService = {
  /**
   * Verifies a payment code via the secure server-side endpoint.
   * @param code The unlock code entered by the user.
   * @returns A promise that resolves to true if the code is valid.
   */
  async verifyCode(code: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await response.json();
      return { success: data.success === true, message: data.message };
    } catch (error) {
      console.error('Payment verification error:', error);
      return { success: false, message: 'Verification failed, please try again' };
    }
  },
};
