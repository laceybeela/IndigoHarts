import { SupabaseClient } from '@supabase/supabase-js';
import type { UpsertAvailability } from '@indigo-harts/types';

export async function getAvailability(client: SupabaseClient, employeeId: string, startDate: string, endDate: string) {
  const { data, error } = await client
    .from('employee_availability')
    .select('*')
    .eq('employee_id', employeeId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');
  if (error) throw error;
  return data;
}

export async function getAllAvailability(client: SupabaseClient, date: string) {
  const { data, error } = await client
    .from('employee_availability')
    .select('*, employee:users(*)')
    .eq('date', date)
    .order('date');
  if (error) throw error;
  return data;
}

export async function upsertAvailability(
  client: SupabaseClient,
  employeeId: string,
  availability: UpsertAvailability
) {
  const { data, error } = await client
    .from('employee_availability')
    .upsert(
      { ...availability, employee_id: employeeId },
      { onConflict: 'employee_id,date' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAvailability(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('employee_availability')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
