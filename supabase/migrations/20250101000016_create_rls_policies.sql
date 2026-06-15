-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_log ENABLE ROW LEVEL SECURITY;

-- ==================== USERS ====================
CREATE POLICY "admin_full_access_users" ON public.users
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_own_user" ON public.users
  FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "employee_update_own_user" ON public.users
  FOR UPDATE USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- ==================== PROPERTIES ====================
CREATE POLICY "admin_full_access_properties" ON public.properties
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_assigned_properties" ON public.properties
  FOR SELECT USING (
    public.get_user_role() = 'employee' AND
    id IN (
      SELECT property_id FROM public.cleaning_jobs
      WHERE assigned_employee_id = public.get_user_id()
    )
  );

-- ==================== PROPERTY PHOTOS ====================
CREATE POLICY "admin_full_access_property_photos" ON public.property_photos
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_assigned_property_photos" ON public.property_photos
  FOR SELECT USING (
    public.get_user_role() = 'employee' AND
    property_id IN (
      SELECT property_id FROM public.cleaning_jobs
      WHERE assigned_employee_id = public.get_user_id()
    )
  );

-- ==================== CHECKLIST TEMPLATES ====================
CREATE POLICY "admin_full_access_checklist_templates" ON public.checklist_templates
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "admin_full_access_checklist_template_items" ON public.checklist_template_items
  FOR ALL USING (public.get_user_role() = 'admin');

-- ==================== GUESTS ====================
CREATE POLICY "admin_full_access_guests" ON public.guests
  FOR ALL USING (public.get_user_role() = 'admin');

-- ==================== STAYS ====================
CREATE POLICY "admin_full_access_stays" ON public.stays
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_assigned_stays" ON public.stays
  FOR SELECT USING (
    public.get_user_role() = 'employee' AND
    id IN (
      SELECT stay_id FROM public.cleaning_jobs
      WHERE assigned_employee_id = public.get_user_id()
        AND stay_id IS NOT NULL
    )
  );

-- ==================== SMS TEMPLATES ====================
CREATE POLICY "admin_full_access_sms_templates" ON public.sms_templates
  FOR ALL USING (public.get_user_role() = 'admin');

-- ==================== EMPLOYEE AVAILABILITY ====================
CREATE POLICY "admin_full_access_employee_availability" ON public.employee_availability
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_own_availability" ON public.employee_availability
  FOR SELECT USING (employee_id = public.get_user_id());

CREATE POLICY "employee_insert_own_availability" ON public.employee_availability
  FOR INSERT WITH CHECK (employee_id = public.get_user_id());

CREATE POLICY "employee_update_own_availability" ON public.employee_availability
  FOR UPDATE USING (employee_id = public.get_user_id())
  WITH CHECK (employee_id = public.get_user_id());

CREATE POLICY "employee_delete_own_availability" ON public.employee_availability
  FOR DELETE USING (employee_id = public.get_user_id());

-- ==================== CLEANING JOBS ====================
CREATE POLICY "admin_full_access_cleaning_jobs" ON public.cleaning_jobs
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_own_jobs" ON public.cleaning_jobs
  FOR SELECT USING (assigned_employee_id = public.get_user_id());

CREATE POLICY "employee_update_own_job_status" ON public.cleaning_jobs
  FOR UPDATE USING (assigned_employee_id = public.get_user_id())
  WITH CHECK (assigned_employee_id = public.get_user_id());

-- ==================== JOB CHECKLISTS ====================
CREATE POLICY "admin_full_access_job_checklists" ON public.job_checklists
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_assigned_job_checklists" ON public.job_checklists
  FOR SELECT USING (
    job_id IN (
      SELECT id FROM public.cleaning_jobs
      WHERE assigned_employee_id = public.get_user_id()
    )
  );

-- ==================== JOB CHECKLIST ITEMS ====================
CREATE POLICY "admin_full_access_job_checklist_items" ON public.job_checklist_items
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "employee_read_assigned_job_checklist_items" ON public.job_checklist_items
  FOR SELECT USING (
    job_checklist_id IN (
      SELECT jc.id FROM public.job_checklists jc
      JOIN public.cleaning_jobs cj ON cj.id = jc.job_id
      WHERE cj.assigned_employee_id = public.get_user_id()
    )
  );

CREATE POLICY "employee_update_assigned_job_checklist_items" ON public.job_checklist_items
  FOR UPDATE USING (
    job_checklist_id IN (
      SELECT jc.id FROM public.job_checklists jc
      JOIN public.cleaning_jobs cj ON cj.id = jc.job_id
      WHERE cj.assigned_employee_id = public.get_user_id()
    )
  );

-- ==================== SMS LOG ====================
CREATE POLICY "admin_full_access_sms_log" ON public.sms_log
  FOR ALL USING (public.get_user_role() = 'admin');

-- ==================== STORAGE ====================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-photos',
  'property-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "admin_upload_property_photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-photos' AND
    public.get_user_role() = 'admin'
  );

CREATE POLICY "admin_update_property_photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-photos' AND
    public.get_user_role() = 'admin'
  );

CREATE POLICY "admin_delete_property_photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-photos' AND
    public.get_user_role() = 'admin'
  );

CREATE POLICY "public_read_property_photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-photos');

-- ==================== REALTIME ====================
ALTER PUBLICATION supabase_realtime ADD TABLE public.cleaning_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_checklist_items;
