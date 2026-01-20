-- Create table to store InPagamentos payments and UTMs
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL UNIQUE,
  product_name TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_cpf TEXT NOT NULL,
  customer_phone TEXT,
  amount NUMERIC(10,2) NOT NULL,
  final_amount NUMERIC(10,2),
  pix_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'PIX',
  tracking_parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payments are selectable by everyone"
ON public.payments
FOR SELECT
USING (true);

CREATE INDEX idx_payments_identifier ON public.payments(identifier);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
