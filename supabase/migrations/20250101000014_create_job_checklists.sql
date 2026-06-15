CREATE TABLE public.job_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.cleaning_jobs(id) ON DELETE CASCADE,
  checklist_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_checklists_job_id ON public.job_checklists(job_id);

CREATE TRIGGER set_job_checklists_updated_at
  BEFORE UPDATE ON public.job_checklists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.job_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_checklist_id uuid NOT NULL REFERENCES public.job_checklists(id) ON DELETE CASCADE,
  task_name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  completed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_checklist_items_checklist_id ON public.job_checklist_items(job_checklist_id);

CREATE TRIGGER set_job_checklist_items_updated_at
  BEFORE UPDATE ON public.job_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to copy checklist template items into a job
CREATE OR REPLACE FUNCTION public.copy_checklist_to_job(p_job_id uuid, p_property_id uuid)
RETURNS void AS $$
DECLARE
  v_template RECORD;
  v_checklist_id uuid;
BEGIN
  FOR v_template IN
    SELECT id, name FROM public.checklist_templates
    WHERE property_id = p_property_id AND is_active = true
  LOOP
    INSERT INTO public.job_checklists (job_id, checklist_name)
    VALUES (p_job_id, v_template.name)
    RETURNING id INTO v_checklist_id;

    INSERT INTO public.job_checklist_items (job_checklist_id, task_name, display_order)
    SELECT v_checklist_id, task_name, display_order
    FROM public.checklist_template_items
    WHERE template_id = v_template.id
    ORDER BY display_order;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
