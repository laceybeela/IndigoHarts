CREATE TABLE public.property_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_property_photos_property_id ON public.property_photos(property_id);

CREATE TRIGGER set_property_photos_updated_at
  BEFORE UPDATE ON public.property_photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
