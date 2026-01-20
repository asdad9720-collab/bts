const fs = require('fs');
const path = 'src/components/MainContent.tsx';
let t = fs.readFileSync(path, 'utf8');
if (!t.includes('Captura UTMs')) {
  const marker = '// Fun\u00e7\u00f5es de quantidade';
  const idx = t.indexOf(marker);
  if (idx !== -1) {
    const block = `// Captura UTMs na primeira carga\n  useEffect(() => {\n    const search = new URLSearchParams(window.location.search);\n    const utmEntries = [\n      "utm_source",\n      "utm_campaign",\n      "utm_medium",\n      "utm_content",\n      "utm_term",\n      "src",\n      "sck",\n    ].reduce((acc, key) => {\n      const val = search.get(key);\n      acc[key] = val;\n      return acc;\n    }, {} as Record<string, string | null>);\n    setTrackingParams(utmEntries);\n  }, []);\n\n`; 
    t = t.slice(0, idx) + block + t.slice(idx);
    fs.writeFileSync(path, t);
  }
}
