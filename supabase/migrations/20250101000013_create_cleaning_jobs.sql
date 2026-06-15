CREATE TABLE public.cleaning_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  stay_id uuid REFERENCES public.stays(id) ON DELETE SET NULL,
  assigned_employee_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL,
  status public.job_status NOT NULL DEFAULT 'assigned',
  assigned_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cleaning_jobs_property_id ON public.cleaning_jobs(property_id);
CREATE INDEX idx_cleaning_jobs_stay_id ON public.cleaning_jobs(stay_id);
CREATE INDEX idx_cleaning_jobs_employee_id ON public.cleaning_jobs(assigned_employee_id);
CREATE INDEX idx_cleaning_jobs_scheduled_date ON public.cleaning_jobs(scheduled_date);
CREATE INDEX idx_cleaning_jobs_status ON public.cleaning_jobs(status);

CREATE TRIGGER set_cleaning_jobs_updated_at
  BEFORE UPDATE ON public.cleaning_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
