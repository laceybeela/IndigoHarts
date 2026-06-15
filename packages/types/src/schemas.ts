import { z } from 'zod';
import { UserRole, StayStatus, JobStatus, SmsStatus } from './enums';

// ==================== Users ====================
export const userSchema = z.object({
  id: z.string().uuid(),
  auth_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().nullable(),
  role: z.nativeEnum(UserRole),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().nullable().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.Employee),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
});

// ==================== Properties ====================
export const propertySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  address: z.string().min(1),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  notes: z.string().nullable(),
  entry_code: z.string().nullable(),
  lockbox_code: z.string().nullable(),
  wifi_name: z.string().nullable(),
  wifi_password: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createPropertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  bedrooms: z.number().int().min(0).default(1),
  bathrooms: z.number().min(0).default(1),
  notes: z.string().nullable().optional(),
  entry_code: z.string().nullable().optional(),
  lockbox_code: z.string().nullable().optional(),
  wifi_name: z.string().nullable().optional(),
  wifi_password: z.string().nullable().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

// ==================== Property Photos ====================
export const propertyPhotoSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  storage_path: z.string(),
  display_order: z.number().int(),
  caption: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ==================== Checklist Templates ====================
export const checklistTemplateSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  name: z.string().min(1),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createChecklistTemplateSchema = z.object({
  property_id: z.string().uuid(),
  name: z.string().min(1, 'Template name is required'),
  items: z.array(z.object({
    task_name: z.string().min(1, 'Task name is required'),
    display_order: z.number().int().min(0),
  })).min(1, 'At least one task is required'),
});

export const checklistTemplateItemSchema = z.object({
  id: z.string().uuid(),
  template_id: z.string().uuid(),
  task_name: z.string(),
  display_order: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ==================== Guests ====================
export const guestSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createGuestSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const updateGuestSchema = createGuestSchema.partial();

// ==================== Stays ====================
export const staySchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  guest_id: z.string().uuid(),
  check_in_date: z.string(),
  check_out_date: z.string(),
  status: z.nativeEnum(StayStatus),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createStaySchema = z.object({
  property_id: z.string().uuid('Property is required'),
  guest_id: z.string().uuid('Guest is required'),
  check_in_date: z.string().min(1, 'Check-in date is required'),
  check_out_date: z.string().min(1, 'Check-out date is required'),
  status: z.nativeEnum(StayStatus).default(StayStatus.Upcoming),
}).refine(data => data.check_out_date > data.check_in_date, {
  message: 'Check-out date must be after check-in date',
  path: ['check_out_date'],
});

export const updateStaySchema = z.object({
  check_in_date: z.string().optional(),
  check_out_date: z.string().optional(),
  status: z.nativeEnum(StayStatus).optional(),
});

// ==================== SMS Templates ====================
export const smsTemplateSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid().nullable(),
  template_name: z.string().min(1),
  message_body: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createSmsTemplateSchema = z.object({
  property_id: z.string().uuid().nullable().optional(),
  template_name: z.string().min(1, 'Template name is required'),
  message_body: z.string().min(1, 'Message body is required'),
});

export const updateSmsTemplateSchema = createSmsTemplateSchema.partial();

// ==================== Employee Availability ====================
export const employeeAvailabilitySchema = z.object({
  id: z.string().uuid(),
  employee_id: z.string().uuid(),
  date: z.string(),
  available: z.boolean(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const upsertAvailabilitySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  available: z.boolean(),
  notes: z.string().nullable().optional(),
});

// ==================== Cleaning Jobs ====================
export const cleaningJobSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  stay_id: z.string().uuid().nullable(),
  assigned_employee_id: z.string().uuid().nullable(),
  scheduled_date: z.string(),
  status: z.nativeEnum(JobStatus),
  assigned_at: z.string().nullable(),
  accepted_at: z.string().nullable(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createCleaningJobSchema = z.object({
  property_id: z.string().uuid('Property is required'),
  stay_id: z.string().uuid().nullable().optional(),
  assigned_employee_id: z.string().uuid().nullable().optional(),
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
});

export const updateCleaningJobSchema = z.object({
  assigned_employee_id: z.string().uuid().nullable().optional(),
  scheduled_date: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
});

// ==================== Job Checklists ====================
export const jobChecklistSchema = z.object({
  id: z.string().uuid(),
  job_id: z.string().uuid(),
  checklist_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const jobChecklistItemSchema = z.object({
  id: z.string().uuid(),
  job_checklist_id: z.string().uuid(),
  task_name: z.string(),
  display_order: z.number().int(),
  is_completed: z.boolean(),
  completed_at: z.string().nullable(),
  completed_by: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ==================== SMS Log ====================
export const smsLogSchema = z.object({
  id: z.string().uuid(),
  stay_id: z.string().uuid().nullable(),
  guest_id: z.string().uuid().nullable(),
  recipient_phone: z.string(),
  message_body: z.string(),
  template_id: z.string().uuid().nullable(),
  status: z.nativeEnum(SmsStatus),
  twilio_sid: z.string().nullable(),
  sent_by: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const sendSmsSchema = z.object({
  stay_id: z.string().uuid().nullable().optional(),
  guest_id: z.string().uuid().nullable().optional(),
  recipient_phone: z.string().min(1, 'Phone number is required'),
  message_body: z.string().min(1, 'Message is required'),
  template_id: z.string().uuid().nullable().optional(),
});
