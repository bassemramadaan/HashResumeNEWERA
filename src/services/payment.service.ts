/**
 * Payment Service
 * Handles interactions with payment gateways (e.g., Stripe).
 * Note: In this pure frontend version, we simulate the payment process
 * and store the premium status in localStorage.
 */
export const PaymentService = {
  /**
   * Initiates a checkout session for a premium resume download.
   * @param planId The ID of the plan the user is purchasing.
   * @returns A promise that resolves with a mock checkout session URL.
   */
  async createCheckoutSession(planId: string): Promise<string> {
    try {
      console.log(`Creating mock checkout session for plan: ${planId}`);
      
      // Simulate an API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a mock URL that the app can handle
      return `#/payment-success?session_id=mock_session_${Date.now()}`;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error("Failed to initiate payment.", { cause: error });
    }
  },

  /**
   * Verifies the status of a payment session.
   * @param sessionId The ID of the checkout session to verify.
   * @returns A promise that resolves to true if the payment was successful.
   */
  async verifyPayment(sessionId: string): Promise<boolean> {
    try {
      console.log(`Verifying mock payment session: ${sessionId}`);
      
      // In this mock, we always succeed
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mark as premium in localStorage for persistence across reloads
          localStorage.setItem('is_premium', 'true');
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      return false;
    }
  },

  /**
   * Checks if the user is currently premium.
   */
  isPremium(): boolean {
    return localStorage.getItem('is_premium') === 'true';
  }
};
