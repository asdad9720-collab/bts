const fs = require('fs');
const path = 'src/components/MainContent.tsx';
const lines = fs.readFileSync(path,'utf8').split(/\r?\n/);
if (!lines.some(l=>l.includes('Falha ao enviar para UTMify'))) {
  const idx = lines.findIndex(l=>l.includes('console.log("PIX Gerado:"'));
  if (idx !== -1) {
    const block = [
'      try {',
'        await fetch("https://bgwcwqwmwdqhnwfutoju.supabase.co/functions/v1/send-to-utmify-payevo", {',
'          method: "POST",',
'          headers: {',
'            "Content-Type": "application/json",',
'            accept: "application/json",',
'            apikey: SUPABASE_ANON_KEY,',
'            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,' ,
'          },',
'          body: JSON.stringify({',
'            id: data.id,',
'            amount: data.amount,',
'            currency: data.currency ?? "BRL",',
'            paymentMethod: "pix",',
'            status: data.status,',
'            items: ticketsNoPedido,',
'            customer: {',
'              name: customerInfo.name,',
'              email: customerInfo.email,',
'              phone: sanitizeDigits(customerInfo.phone),',
'              document: {',
'                number: sanitizeDigits(customerInfo.document),',
'                type: "cpf",',
'              },',
'            },',
'            pix: data.pix,',
'            tracking_parameters: trackingParams,',
'          }),',
'        });',
'      } catch (utmError) {',
'        console.warn("Falha ao enviar para UTMify (continua):", utmError);',
'      }',
''
    ];
    lines.splice(idx+1,0,...block);
    fs.writeFileSync(path, lines.join('\n'));
  }
}
