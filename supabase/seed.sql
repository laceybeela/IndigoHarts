-- Seed data for Indigo Harts development
-- NOTE: Auth users must be created separately via the Supabase dashboard or Edge Function.
-- This seed creates the public.users rows directly for development.

-- ==================== Admin User ====================
INSERT INTO public.users (id, name, email, phone, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Lacey Smith',
  'admin@indigoharts.com',
  '+15551234567',
  'admin',
  true
) ON CONFLICT DO NOTHING;

-- ==================== Employee Users ====================
INSERT INTO public.users (id, name, email, phone, role, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'Maria Garcia', 'maria@indigoharts.com', '+15552345678', 'employee', true),
  ('00000000-0000-0000-0000-000000000003', 'Sarah Johnson', 'sarah@indigoharts.com', '+15553456789', 'employee', true),
  ('00000000-0000-0000-0000-000000000004', 'Emily Chen', 'emily@indigoharts.com', '+15554567890', 'employee', true)
ON CONFLICT DO NOTHING;

-- ==================== Properties ====================
INSERT INTO public.properties (id, name, address, bedrooms, bathrooms, notes, entry_code, wifi_name, wifi_password)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Sunset Beach House',
    '123 Ocean Drive, Gulf Shores, AL 36542',
    4, 3.0,
    'Oceanfront property. Check for sand in entryway.',
    '4521',
    'SunsetBeach_Guest',
    'beach2024!'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Mountain View Cabin',
    '456 Pine Ridge Rd, Gatlinburg, TN 37738',
    3, 2.0,
    'Hot tub on back deck needs cover replaced after cleaning.',
    '7890',
    'MtnView_WiFi',
    'cabin4ever'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Downtown Loft',
    '789 Main St, Apt 4B, Nashville, TN 37201',
    2, 1.5,
    'Keypad entry. No parking on premises.',
    '1234',
    'Loft4B_Guest',
    'downtown!'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Lakefront Cottage',
    '321 Lakeshore Blvd, Lake Martin, AL 35010',
    3, 2.0,
    'Boat dock access. Check life jackets in closet.',
    '5678',
    'LakeCottage',
    'lakefun23'
  )
ON CONFLICT DO NOTHING;

-- ==================== Checklist Templates ====================
-- Sunset Beach House
INSERT INTO public.checklist_templates (id, property_id, name, is_active)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Standard Turnover Clean', true),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Deep Clean', true)
ON CONFLICT DO NOTHING;

-- Standard Turnover Clean items
INSERT INTO public.checklist_template_items (template_id, task_name, display_order)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Strip all beds and start laundry', 1),
  ('20000000-0000-0000-0000-000000000001', 'Clean all bathrooms (toilets, showers, sinks, mirrors)', 2),
  ('20000000-0000-0000-0000-000000000001', 'Vacuum all carpeted areas', 3),
  ('20000000-0000-0000-0000-000000000001', 'Mop hard floors', 4),
  ('20000000-0000-0000-0000-000000000001', 'Wipe down kitchen counters and appliances', 5),
  ('20000000-0000-0000-0000-000000000001', 'Empty dishwasher and restock', 6),
  ('20000000-0000-0000-0000-000000000001', 'Clean refrigerator — remove all guest items', 7),
  ('20000000-0000-0000-0000-000000000001', 'Take out all trash and replace bags', 8),
  ('20000000-0000-0000-0000-000000000001', 'Make all beds with fresh linens', 9),
  ('20000000-0000-0000-0000-000000000001', 'Restock toiletries (soap, shampoo, TP)', 10),
  ('20000000-0000-0000-0000-000000000001', 'Sweep sand from entryway and porch', 11),
  ('20000000-0000-0000-0000-000000000001', 'Lock all doors and set thermostat to 74F', 12)
ON CONFLICT DO NOTHING;

-- Deep Clean items
INSERT INTO public.checklist_template_items (template_id, task_name, display_order)
VALUES
  ('20000000-0000-0000-0000-000000000002', 'All Standard Turnover tasks', 1),
  ('20000000-0000-0000-0000-000000000002', 'Clean inside oven and microwave', 2),
  ('20000000-0000-0000-0000-000000000002', 'Wipe down all baseboards', 3),
  ('20000000-0000-0000-0000-000000000002', 'Clean ceiling fans and light fixtures', 4),
  ('20000000-0000-0000-0000-000000000002', 'Wash windows (interior)', 5),
  ('20000000-0000-0000-0000-000000000002', 'Deep clean grout in bathrooms', 6),
  ('20000000-0000-0000-0000-000000000002', 'Flip and vacuum mattresses', 7),
  ('20000000-0000-0000-0000-000000000002', 'Clean under furniture', 8)
ON CONFLICT DO NOTHING;

-- Mountain View Cabin template
INSERT INTO public.checklist_templates (id, property_id, name, is_active)
VALUES ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Cabin Turnover', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.checklist_template_items (template_id, task_name, display_order)
VALUES
  ('20000000-0000-0000-0000-000000000003', 'Strip beds and start laundry', 1),
  ('20000000-0000-0000-0000-000000000003', 'Clean bathrooms', 2),
  ('20000000-0000-0000-0000-000000000003', 'Vacuum and mop all floors', 3),
  ('20000000-0000-0000-0000-000000000003', 'Clean kitchen and appliances', 4),
  ('20000000-0000-0000-0000-000000000003', 'Empty trash', 5),
  ('20000000-0000-0000-0000-000000000003', 'Check hot tub — add cover, verify chemicals', 6),
  ('20000000-0000-0000-0000-000000000003', 'Restock firewood by fireplace', 7),
  ('20000000-0000-0000-0000-000000000003', 'Make beds with fresh linens', 8),
  ('20000000-0000-0000-0000-000000000003', 'Restock toiletries', 9),
  ('20000000-0000-0000-0000-000000000003', 'Lock up and set thermostat', 10)
ON CONFLICT DO NOTHING;

-- ==================== Guests ====================
INSERT INTO public.guests (id, first_name, last_name, phone, email, notes)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'John', 'Williams', '+15559876543', 'john.w@email.com', 'Returning guest — prefers extra towels'),
  ('30000000-0000-0000-0000-000000000002', 'Amy', 'Rodriguez', '+15558765432', 'amy.r@email.com', NULL),
  ('30000000-0000-0000-0000-000000000003', 'David', 'Kim', '+15557654321', 'david.k@email.com', 'Has pet — confirm pet policy'),
  ('30000000-0000-0000-0000-000000000004', 'Rachel', 'Thompson', '+15556543210', 'rachel.t@email.com', 'Early check-in requested')
ON CONFLICT DO NOTHING;

-- ==================== Stays ====================
INSERT INTO public.stays (id, property_id, guest_id, check_in_date, check_out_date, status)
VALUES
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '2025-07-01', '2025-07-05', 'upcoming'),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '2025-07-03', '2025-07-07', 'upcoming'),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '2025-07-06', '2025-07-10', 'upcoming'),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004', '2025-07-02', '2025-07-04', 'upcoming')
ON CONFLICT DO NOTHING;

-- ==================== Cleaning Jobs ====================
INSERT INTO public.cleaning_jobs (id, property_id, stay_id, assigned_employee_id, scheduled_date, status)
VALUES
  ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '2025-07-05', 'assigned'),
  ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '2025-07-07', 'assigned'),
  ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '2025-07-10', 'assigned'),
  ('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '2025-07-04', 'assigned')
ON CONFLICT DO NOTHING;

-- ==================== SMS Templates ====================
INSERT INTO public.sms_templates (id, property_id, template_name, message_body)
VALUES
  ('60000000-0000-0000-0000-000000000001', NULL, 'Check-in Welcome', 'Hi {{guest_name}}! Welcome to {{property_name}}. Your check-in is confirmed for {{check_in_date}}. WiFi: {{wifi_name}} / {{wifi_password}}. Entry code: {{entry_code}}. Enjoy your stay!'),
  ('60000000-0000-0000-0000-000000000002', NULL, 'Check-out Reminder', 'Hi {{guest_name}}, just a friendly reminder that check-out is tomorrow ({{check_out_date}}). Please leave keys on the counter. Thank you for staying with us!'),
  ('60000000-0000-0000-0000-000000000003', NULL, 'Cleaning Complete', 'Hi {{guest_name}}, your rental at {{property_name}} has been cleaned and is ready for your arrival. See you soon!')
ON CONFLICT DO NOTHING;

-- ==================== Employee Availability ====================
INSERT INTO public.employee_availability (employee_id, date, available, notes)
VALUES
  ('00000000-0000-0000-0000-000000000002', '2025-07-05', true, NULL),
  ('00000000-0000-0000-0000-000000000002', '2025-07-06', false, 'Family event'),
  ('00000000-0000-0000-0000-000000000002', '2025-07-10', true, NULL),
  ('00000000-0000-0000-0000-000000000003', '2025-07-07', true, NULL),
  ('00000000-0000-0000-0000-000000000003', '2025-07-08', true, 'Available all day'),
  ('00000000-0000-0000-0000-000000000004', '2025-07-04', true, NULL),
  ('00000000-0000-0000-0000-000000000004', '2025-07-05', true, NULL)
ON CONFLICT DO NOTHING;
