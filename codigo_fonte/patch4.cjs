const fs = require('fs');
const path = 'src/components/MainContent.tsx';
let t = fs.readFileSync(path, 'utf8');
if (!t.includes('Captura UTMs')) {
  const marker = '// Funções de quantidade';
  const idx = t.indexOf(marker);
  if (idx !== -1) {
    const block = `// Captura UTMs na primeira carga
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const utmEntries = [
      "utm_source",
      "utm_campaign",
      "utm_medium",
      "utm_content",
      "utm_term",
      "src",
      "sck",
    ].reduce((acc, key) => {
      const val = search.get(key);
      acc[key] = val;
      return acc;
    }, {} as Record<string, string | null>);
    setTrackingParams(utmEntries);
  }, []);

`; 
    t = t.slice(0, idx) + block + t.slice(idx);
    fs.writeFileSync(path, t);
  }
}
