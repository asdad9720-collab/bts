import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const utmKeys = [
  "utm_source",
  "utm_campaign",
  "utm_medium",
  "utm_content",
  "utm_term",
  "src",
  "sck",
] as const;

const Presell = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const fromUrl = utmKeys.reduce((acc, key) => {
      const value = search.get(key);
      acc[key] = value;
      return acc;
    }, {} as Record<(typeof utmKeys)[number], string | null>);

    const storedRaw = sessionStorage.getItem("utm_params");
    let stored: Record<string, string | null> = {};
    if (storedRaw) {
      try {
        stored = JSON.parse(storedRaw);
      } catch {
        stored = {};
      }
    }

    const merged = { ...stored, ...fromUrl };
    sessionStorage.setItem("utm_params", JSON.stringify(merged));
  }, [location.search]);

  useEffect(() => {
    const query = location.search;
    const timer = setTimeout(() => {
      navigate(`/${query}`, { replace: true });
    }, 1200);
    return () => clearTimeout(timer);
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-xl shadow-sm p-12 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );
};

export default Presell;