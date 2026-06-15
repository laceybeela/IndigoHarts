import { SupabaseClient } from '@supabase/supabase-js';
import type { CreateCleaningJob, UpdateCleaningJob, JobStatus } from '@indigo-harts/types';

export async function getCleaningJobs(client: SupabaseClient, filters?: { status?: string; date?: string; employeeId?: string }) {
  let query = client
    .from('cleaning_jobs')
    .select('*, property:properties(*), stay:stays(*, guest:guests(*)), assigned_employee:users!assigned_employee_id(*)')
    .order('scheduled_date', { ascending: true });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.date) query = query.eq('scheduled_date', filters.date);
  if (filters?.employeeId) query = query.eq('assigned_employee_id', filters.employeeId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCleaningJobById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('cleaning_jobs')
    .select('*, property:properties(*), stay:stays(*, guest:guests(*)), assigned_employee:users!assigned_employee_id(*), job_checklists(*, items:job_checklist_items(*))')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getMyJobs(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('cleaning_jobs')
    .select('*, property:properties(*), stay:stays(*, guest:guests(*)), job_checklists(*, items:job_checklist_items(*))')
    .eq('assigned_employee_id', userId)
    .in('status', ['assigned', 'accepted', 'in_progress'])
    .order('scheduled_date');
  if (error) throw error;
  return data;
}

export async function createCleaningJob(client: SupabaseClient, job: CreateCleaningJob) {
  const { data, error } = await client
    .from('cleaning_jobs')
    .insert(job)
    .select()
    .single();
  if (error) throw error;

  // Copy checklist templates to the new job
  const { error: copyError } = await client.rpc('copy_checklist_to_job', {
    p_job_id: data.id,
    p_property_id: data.property_id,
  });
  if (copyError) throw copyError;

  return data;
}

export async function updateCleaningJob(client: SupabaseClient, id: string, updates: UpdateCleaningJob) {
  const { data, error } = await client
    .from('cleaning_jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateJobStatus(client: SupabaseClient, id: string, status: JobStatus) {
  const timestampField: Record<string, string> = {
    accepted: 'accepted_at',
    in_progress: 'started_at',
    completed: 'completed_at',
  };

  const updates: Record<string, unknown> = { status };
  const field = timestampField[status];
  if (field) updates[field] = new Date().toISOString();

  const { data, error } = await client
    .from('cleaning_jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCleaningJob(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('cleaning_jobs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
