const fs = require('fs');
const path = 'src/components/MainContent.tsx';
let t = fs.readFileSync(path, 'utf8');
if (!t.includes('trackingParams')) {
  const needle = '  const [copyMessage, setCopyMessage] = useState("");';
  const insert = '  const [copyMessage, setCopyMessage] = useState("");\n  const [trackingParams, setTrackingParams] = useState<Record<string, string | null>>({});';
  t = t.replace(needle, insert);
  const hook = '  // Funções de quantidade';
  const block = '  // Captura UTMs na primeira carga\n  useEffect(() => {\n    const search = new URLSearchParams(window.location.search);\n    const utmEntries = [\n      "utm_source",\n      "utm_campaign",\n      "utm_medium",\n      "utm_content",\n      "utm_term",\n      "src",\n      "sck",\n    ].reduce((acc: Record<string, string | null>, key) => {\n      const val = search.get(key);\n      acc[key] = val;\n      return acc;\n    }, {});\n    setTrackingParams(utmEntries);\n  }, []);\n\n  // Funções de quantidade';
  t = t.replace(hook, block);
  fs.writeFileSync(path, t);
}
