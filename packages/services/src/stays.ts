import { SupabaseClient } from '@supabase/supabase-js';
import type { UpdateStay } from '@indigo-harts/types';

export async function getStays(client: SupabaseClient) {
  const { data, error } = await client
    .from('stays')
    .select('*, property:properties(*), guest:guests(*)')
    .order('check_in_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getStayById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('stays')
    .select('*, property:properties(*), guest:guests(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getStaysByProperty(client: SupabaseClient, propertyId: string) {
  const { data, error } = await client
    .from('stays')
    .select('*, guest:guests(*)')
    .eq('property_id', propertyId)
    .order('check_in_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createStay(
  client: SupabaseClient,
  stay: { property_id: string; guest_id: string; check_in_date: string; check_out_date: string; status?: string }
) {
  const { data, error } = await client
    .from('stays')
    .insert(stay)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStay(client: SupabaseClient, id: string, updates: UpdateStay) {
  const { data, error } = await client
    .from('stays')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStay(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('stays')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
