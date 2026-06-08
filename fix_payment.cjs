const fs = require('fs');
let code = fs.readFileSync('src/components/payment/PaymentModal.tsx', 'utf8');

// I will look for the line:
// ) : selectedMethod === "instapay" || selectedMethod === "vodafone" ? (

code = code.replace(
  ') : selectedMethod === "instapay" || selectedMethod === "vodafone" ? (',
  ') : null}\n{step === 2 && !pendingRef && (selectedMethod === "instapay" || selectedMethod === "vodafone") && ('
);

// I will look for the line:
// ) : selectedMethod === "code" ? (
code = code.replace(
  ') : selectedMethod === "code" ? (',
  ')}\n{step === 2 && !pendingRef && selectedMethod === "code" && ('
);

// I will look for the line:
// ) : null}
code = code.replace(
  ') : null}\n                  </div>',
  ')}\n                  </div>'
);

// I will look for:
// {((step === 3 && selectedMethod !== "code") || pendingRef) && (

code = code.replace(
  '{((step === 3 && selectedMethod !== "code") || pendingRef) && (',
  ''
);

fs.writeFileSync('src/components/payment/PaymentModal.tsx', code);
