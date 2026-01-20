import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const sanitizeDigits = (value?: string | null) =>
  value ? value.replace(/\D/g, "") : null;

type InPagoPix = {
  qrcode?: string | null;
  end2EndId?: string | null;
  endToEndId?: string | null;
  receiptUrl?: string | null;
  expirationDate?: string | null;
};

type InPagoItem = {
  title?: string;
  quantity?: number;
  tangible?: boolean;
  unitPrice?: number;
  externalRef?: string | null;
};

type InPagoCustomer = {
  name?: string;
  email?: string;
  phone?: string;
  document?: { type?: string; number?: string };
};

type InPagoTransaction = {
  id?: number | string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  status?: string;
  paidAt?: string | null;
  createdAt?: string | null;
  items?: InPagoItem[];
  customer?: InPagoCustomer;
  pix?: InPagoPix;
  metadata?: Record<string, unknown> | null;
  tracking_parameters?: Record<string, unknown> | null;
};

type RequestPayload = {
  orderId?: string;
  status?: string;
  transaction?: InPagoTransaction;
} & InPagoTransaction;

function toDateTimeString(value?: string | number | Date | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().replace("T", " ").substring(0, 19);
}

function mapStatus(status?: string | null): string {
  const normalized = (status || "").toLowerCase();
  if (normalized === "pending" || normalized === "waiting_payment") return "waiting_payment";
  if (normalized === "completed" || normalized === "paid") return "paid";
  if (normalized === "refunded") return "refunded";
  if (normalized === "chargedback" || normalized === "chargeback") return "chargedback";
  return "refused";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestPayload;
    const transaction: InPagoTransaction = body.transaction ?? body;
    const orderId = String(transaction.id ?? body.orderId ?? "");
    if (!orderId) throw new Error("orderId is required");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "https://bgwcwqwmwdqhnwfutoju.supabase.co";
    const supabaseServiceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ??
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2N3cXdtd2RxaG53ZnV0b2p1Iiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc4Njc0MSwiZXhwIjoyMDg0MzYyNzQxfQ.y51gZVkHTbb0D8K-HAvI9gQ88ld7ty8TrKWMTcZ0bJs";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const amountInCents = transaction.amount ?? 0;
    const amountValue = amountInCents > 0 ? amountInCents / 100 : 0;
    const firstItem = (transaction.items ?? [])[0];
    const customer = transaction.customer ?? {};
    const tracking = (transaction.tracking_parameters as Record<string, string | null>) ??
      (transaction.metadata as Record<string, string | null>) ?? {};

    const basePayment = {
      identifier: orderId,
      product_name: firstItem?.title ?? "Pagamento InPagamentos",
      customer_name: customer.name ?? "Cliente",
      customer_email: customer.email ?? null,
      customer_cpf: sanitizeDigits(customer.document?.number ?? "") ?? null,
      customer_phone: sanitizeDigits(customer.phone ?? "") ?? null,
      amount: amountValue,
      final_amount: amountValue,
      pix_code: transaction.pix?.qrcode ?? null,
      status: transaction.status ?? body.status ?? "waiting_payment",
      payment_method: (transaction.paymentMethod ?? "pix").toUpperCase(),
      tracking_parameters: tracking,
      created_at: transaction.createdAt ? toDateTimeString(transaction.createdAt) : toDateTimeString(new Date()),
      paid_at: toDateTimeString(transaction.paidAt),
    } as const;

    let storedPayment = basePayment as any;
    let storedPaymentError: string | null = null;

    try {
      const { data: payment, error } = await supabase
        .from("payments")
        .upsert(basePayment, { onConflict: "identifier" })
        .select("*")
        .maybeSingle();

      if (error || !payment) {
        throw error ?? new Error("Payment upsert returned empty result");
      }
      storedPayment = payment;
    } catch (upsertErr) {
      console.error("Upsert error:", upsertErr);
      storedPaymentError = upsertErr?.message ?? String(upsertErr);
    }

    const utmifyToken = Deno.env.get("UTMIFY_API_TOKEN") ?? "iNjzunXV60fZFuWkSIcXbM1T7vuAGlY7MsPw";
    if (!utmifyToken) throw new Error("UTMIFY_API_TOKEN not configured");

    const priceInCents = Math.round(Number(storedPayment.final_amount ?? storedPayment.amount ?? 0) * 100);
    const trackingParams = (storedPayment.tracking_parameters || {}) as Record<string, string | null>;

    const customerEmail = storedPayment.customer_email || "contato@programacnh2026.site";
    const customerDocument = storedPayment.customer_cpf || "00000000000";

    const utmifyPayload = {
      orderId: storedPayment.identifier,
      platform: "InPagamentos",
      paymentMethod: (storedPayment.payment_method || "pix").toLowerCase(),
      status: mapStatus(storedPayment.status),
      createdAt: toDateTimeString(storedPayment.created_at),
      approvedDate: toDateTimeString(storedPayment.paid_at),
      refundedAt: null,
      customer: {
        name: storedPayment.customer_name,
        email: customerEmail,
        phone: storedPayment.customer_phone || null,
        document: customerDocument,
        country: "BR",
      },
      products: [
        {
          id: storedPayment.identifier,
          name: storedPayment.product_name || "Pagamento",
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents,
        },
      ],
      trackingParameters: {
        src: trackingParams.src || null,
        sck: trackingParams.sck || null,
        utm_source: trackingParams.utm_source || null,
        utm_campaign: trackingParams.utm_campaign || null,
        utm_medium: trackingParams.utm_medium || null,
        utm_content: trackingParams.utm_content || null,
        utm_term: trackingParams.utm_term || null,
      },
      commission: {
        totalPriceInCents: priceInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: priceInCents,
      },
      isTest: false,
    };

    const response = await fetch("https://api.utmify.com.br/api-credentials/orders", {
      method: "POST",
      headers: {
        "x-api-token": utmifyToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(utmifyPayload),
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Utmify API error: ${response.status} - ${responseText}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sent to Utmify successfully",
        utmifyResponse: responseText,
        storedPayment,
        storedPaymentError,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});