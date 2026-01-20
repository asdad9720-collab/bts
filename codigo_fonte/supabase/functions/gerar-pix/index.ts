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

  if (!INPAGO_AUTH) {
    return jsonResponse({ error: "INPAGO_AUTH not configured" }, 500, corsHeaders);
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
    paymentMethod = "pix",
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

  const inPagoPayload = {
    amount,
    currency: "BRL",
    paymentMethod,
    pix,
    items: items.map((item: any) => ({
      ...item,
      tangible: item?.tangible ?? true,
    })),
    customer: {
      ...customer,
      phone: sanitizeDigits(customer.phone),
      document: {
        number: sanitizeDigits(customer.document?.number ?? customer.document),
        type: (customer.document?.type ?? "cpf").toLowerCase(),
      },
    },
  };

  try {
    const inPagoResponse = await fetch(INPAGO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        authorization: INPAGO_AUTH,
      },
      body: JSON.stringify(inPagoPayload),
    });

    const data = await inPagoResponse.json().catch(() => null);

    if (!inPagoResponse.ok) {
      return jsonResponse(
        { error: data?.message ?? "Erro ao gerar PIX", details: data },
        inPagoResponse.status,
        corsHeaders,
      );
    }

    return jsonResponse(data, 200, corsHeaders);
  } catch (error) {
    console.error("Erro ao chamar InPagamentos:", error);
    return jsonResponse({ error: "Falha na comunicação com InPagamentos" }, 502, corsHeaders);
  }
});
