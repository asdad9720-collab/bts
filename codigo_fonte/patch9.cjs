const fs = require('fs');
const path = 'src/components/MainContent.tsx';
const lines = fs.readFileSync(path,'utf8').split(/\r?\n/);
if (!lines.some(l=>l.includes('tracking_parameters'))) {
  const idxType = lines.findIndex(l=>l.includes('type: "cpf"'));
  const insertPos = idxType >=0 ? idxType + 2 : -1; // after closing of customer block
  if (insertPos > 0) {
    lines.splice(insertPos,0,'          tracking_parameters: trackingParams,');
    fs.writeFileSync(path, lines.join('\n'));
  }
}
