const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/components/payment/PaymentModal.tsx');
  console.log('Successfully reverted PaymentModal.tsx');
} catch(e) {
  console.log('Error reverting:', e.message);
}
