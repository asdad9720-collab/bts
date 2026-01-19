// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const PAYEVO_ENDPOINT =
  Deno.env.get("PAYEVO_ENDPOINT") ??
  "https://apiv2.payevo.com.br/functions/v1/transactions";
const PAYEVO_AUTH = Deno.env.get("PAYEVO_AUTH") ?? "";
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

  if (!PAYEVO_AUTH) {
    return jsonResponse({ error: "PAYEVO_AUTH not configured" }, 500, corsHeaders);
  }

  const url = new URL(req.url);
  const queryId = url.searchParams.get("id");
  // permite /consultar-transacao/{id}
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
    const payevoResponse = await fetch(`${PAYEVO_ENDPOINT}/${transactionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        authorization: PAYEVO_AUTH,
      },
    });

    const data = await payevoResponse.json().catch(() => null);

    if (!payevoResponse.ok) {
      return jsonResponse(
        { error: data?.message ?? "Erro ao consultar transação", details: data },
        payevoResponse.status,
        corsHeaders,
      );
    }

    return jsonResponse(data, 200, corsHeaders);
  } catch (error) {
    console.error("Erro ao consultar PayEvo:", error);
    return jsonResponse(
      { error: "Falha na comunicação com PayEvo" },
      502,
      corsHeaders,
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/consultar-transacao' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
