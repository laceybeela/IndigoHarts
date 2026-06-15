CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms numeric(3,1) NOT NULL DEFAULT 1.0,
  notes text,
  entry_code text,
  lockbox_code text,
  wifi_name text,
  wifi_password text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
