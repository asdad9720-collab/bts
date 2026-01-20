const fs = require('fs');
const path = 'src/components/MainContent.tsx';
let t = fs.readFileSync(path, 'utf8');
if (!t.includes('Captura UTMs')) {
  const hook = '  // Funções de quantidade (sem alterações)';
  const block = `  // Captura UTMs na primeira carga
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

  // Funções de quantidade (sem alterações)`;
  t = t.replace(hook, block);
  fs.writeFileSync(path, t);
}
