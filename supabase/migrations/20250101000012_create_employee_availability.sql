CREATE TABLE public.employee_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  available boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

CREATE INDEX idx_employee_availability_employee_id ON public.employee_availability(employee_id);
CREATE INDEX idx_employee_availability_date ON public.employee_availability(date);

CREATE TRIGGER set_employee_availability_updated_at
  BEFORE UPDATE ON public.employee_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
