CREATE TABLE public.sms_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id uuid REFERENCES public.stays(id) ON DELETE SET NULL,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  recipient_phone text NOT NULL,
  message_body text NOT NULL,
  template_id uuid REFERENCES public.sms_templates(id) ON DELETE SET NULL,
  status public.sms_status NOT NULL DEFAULT 'pending',
  twilio_sid text,
  sent_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sms_log_stay_id ON public.sms_log(stay_id);
CREATE INDEX idx_sms_log_guest_id ON public.sms_log(guest_id);

CREATE TRIGGER set_sms_log_updated_at
  BEFORE UPDATE ON public.sms_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
