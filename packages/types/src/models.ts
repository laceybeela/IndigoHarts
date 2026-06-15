import { z } from 'zod';
import {
  userSchema,
  propertySchema,
  propertyPhotoSchema,
  checklistTemplateSchema,
  checklistTemplateItemSchema,
  guestSchema,
  staySchema,
  smsTemplateSchema,
  employeeAvailabilitySchema,
  cleaningJobSchema,
  jobChecklistSchema,
  jobChecklistItemSchema,
  smsLogSchema,
  createUserSchema,
  createPropertySchema,
  updatePropertySchema,
  createChecklistTemplateSchema,
  createGuestSchema,
  updateGuestSchema,
  createStaySchema,
  updateStaySchema,
  createSmsTemplateSchema,
  updateSmsTemplateSchema,
  upsertAvailabilitySchema,
  createCleaningJobSchema,
  updateCleaningJobSchema,
  updateUserSchema,
  sendSmsSchema,
} from './schemas';

// Inferred types from Zod schemas
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Property = z.infer<typeof propertySchema>;
export type CreateProperty = z.infer<typeof createPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;

export type PropertyPhoto = z.infer<typeof propertyPhotoSchema>;

export type ChecklistTemplate = z.infer<typeof checklistTemplateSchema>;
export type CreateChecklistTemplate = z.infer<typeof createChecklistTemplateSchema>;
export type ChecklistTemplateItem = z.infer<typeof checklistTemplateItemSchema>;

export type Guest = z.infer<typeof guestSchema>;
export type CreateGuest = z.infer<typeof createGuestSchema>;
export type UpdateGuest = z.infer<typeof updateGuestSchema>;

export type Stay = z.infer<typeof staySchema>;
export type CreateStay = z.infer<typeof createStaySchema>;
export type UpdateStay = z.infer<typeof updateStaySchema>;

export type SmsTemplate = z.infer<typeof smsTemplateSchema>;
export type CreateSmsTemplate = z.infer<typeof createSmsTemplateSchema>;
export type UpdateSmsTemplate = z.infer<typeof updateSmsTemplateSchema>;

export type EmployeeAvailability = z.infer<typeof employeeAvailabilitySchema>;
export type UpsertAvailability = z.infer<typeof upsertAvailabilitySchema>;

export type CleaningJob = z.infer<typeof cleaningJobSchema>;
export type CreateCleaningJob = z.infer<typeof createCleaningJobSchema>;
export type UpdateCleaningJob = z.infer<typeof updateCleaningJobSchema>;

export type JobChecklist = z.infer<typeof jobChecklistSchema>;
export type JobChecklistItem = z.infer<typeof jobChecklistItemSchema>;

export type SmsLog = z.infer<typeof smsLogSchema>;
export type SendSms = z.infer<typeof sendSmsSchema>;

// Joined/enriched types for UI consumption
export type CleaningJobWithRelations = CleaningJob & {
  property?: Property;
  stay?: Stay & { guest?: Guest };
  assigned_employee?: User;
  job_checklists?: (JobChecklist & { items: JobChecklistItem[] })[];
};

export type StayWithRelations = Stay & {
  property?: Property;
  guest?: Guest;
};

export type ChecklistTemplateWithItems = ChecklistTemplate & {
  items: ChecklistTemplateItem[];
};
