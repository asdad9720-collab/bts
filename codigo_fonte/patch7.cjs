const fs = require('fs');
const path = 'src/components/MainContent.tsx';
let t = fs.readFileSync(path, 'utf8');
if (!t.includes('tracking_parameters')) {
  t = t.replace(
    '          customer: {\n            name: customerInfo.name,\n            email: customerInfo.email,\n            phone: sanitizeDigits(customerInfo.phone),\n            document: {\n              number: sanitizeDigits(customerInfo.document),\n              type: "cpf",\n            },\n          },\n        }),',
    '          customer: {\n            name: customerInfo.name,\n            email: customerInfo.email,\n            phone: sanitizeDigits(customerInfo.phone),\n            document: {\n              number: sanitizeDigits(customerInfo.document),\n              type: "cpf",\n            },\n          },\n          tracking_parameters: trackingParams,\n        }),'
  );
  fs.writeFileSync(path, t);
}
