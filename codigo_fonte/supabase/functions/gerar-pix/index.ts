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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

const sanitizeDigits = (value: unknown) =>
  typeof value === "string" ? value.replace(/\D/g, "") : undefined;

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
  }

  if (!PAYEVO_AUTH) {
    return jsonResponse({ error: "PAYEVO_AUTH not configured" }, 500, corsHeaders);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
  }

  const {
    items,
    amount,
    customer,
    paymentMethod = "PIX",
    pix = { expiresInDays: 30 },
  } = body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return jsonResponse({ error: "Nenhum item informado" }, 400, corsHeaders);
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return jsonResponse({ error: "Valor total inválido" }, 400, corsHeaders);
  }

  if (
    !customer?.name ||
    !customer?.email ||
    !(customer?.document || customer?.document?.number)
  ) {
    return jsonResponse({ error: "Dados do cliente incompletos" }, 400, corsHeaders);
  }

  const payevoPayload = {
    items,
    paymentMethod,
    pix,
    amount,
    customer: {
      ...customer,
      phone: sanitizeDigits(customer.phone),
      document: {
        number: sanitizeDigits(customer.document?.number ?? customer.document),
        type: customer.document?.type ?? "CPF",
      },
    },
  };

  try {
    const payevoResponse = await fetch(PAYEVO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        authorization: PAYEVO_AUTH,
      },
      body: JSON.stringify(payevoPayload),
    });

    const data = await payevoResponse.json().catch(() => null);

    if (!payevoResponse.ok) {
      return jsonResponse(
        { error: data?.message ?? "Erro ao gerar PIX", details: data },
        payevoResponse.status,
        corsHeaders,
      );
    }

    return jsonResponse(data, 200, corsHeaders);
  } catch (error) {
    console.error("Erro ao chamar PayEvo:", error);
    return jsonResponse({ error: "Falha na comunicação com PayEvo" }, 502, corsHeaders);
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/gerar-pix' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
