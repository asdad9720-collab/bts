import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const INPAGO_ENDPOINT =
  Deno.env.get("INPAGO_ENDPOINT") ??
  "https://api.inpagamentos.com/v1/transactions";
const INPAGO_AUTH = Deno.env.get("INPAGO_AUTH") ?? "";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const buildCorsHeaders = (origin: string | null) => {
  const allowAll = ALLOWED_ORIGINS.includes("*");
  const isAllowed =
    allowAll || (origin ? ALLOWED_ORIGINS.includes(origin) : false);

  return {
    "Access-Control-Allow-Origin": allowAll
      ? "*"
      : isAllowed && origin
        ? origin
        : ALLOWED_ORIGINS[0] ?? "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    Vary: "Origin",
  };
};

const jsonResponse = (
  body: unknown,
  status: number,
  corsHeaders: Record<string, string>,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
  }

  if (!INPAGO_AUTH) {
    return jsonResponse({ error: "INPAGO_AUTH not configured" }, 500, corsHeaders);
  }

  const url = new URL(req.url);
  const queryId = url.searchParams.get("id");
  const pathId = (() => {
    const parts = url.pathname.split("/consultar-transacao/");
    if (parts.length > 1 && parts[1]) return parts[1].replace(/^\//, "");
    return null;
  })();

  const transactionId = queryId || pathId;

  if (!transactionId) {
    return jsonResponse({ error: "Parâmetro 'id' obrigatório" }, 400, corsHeaders);
  }

  try {
    const inPagoResponse = await fetch(`${INPAGO_ENDPOINT}/${transactionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        authorization: INPAGO_AUTH,
      },
    });

    const data = await inPagoResponse.json().catch(() => null);

    if (!inPagoResponse.ok) {
      return jsonResponse(
        { error: data?.message ?? "Erro ao consultar transação", details: data },
        inPagoResponse.status,
        corsHeaders,
      );
    }

    return jsonResponse(data, 200, corsHeaders);
  } catch (error) {
    console.error("Erro ao consultar InPagamentos:", error);
    return jsonResponse(
      { error: "Falha na comunicação com InPagamentos" },
      502,
      corsHeaders,
    );
  }
});
