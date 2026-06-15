import { SupabaseClient } from '@supabase/supabase-js';
import type { CreateGuest, UpdateGuest } from '@indigo-harts/types';

export async function getGuests(client: SupabaseClient) {
  const { data, error } = await client
    .from('guests')
    .select('*')
    .order('last_name');
  if (error) throw error;
  return data;
}

export async function getGuestById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('guests')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createGuest(client: SupabaseClient, guest: CreateGuest) {
  const { data, error } = await client
    .from('guests')
    .insert(guest)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGuest(client: SupabaseClient, id: string, updates: UpdateGuest) {
  const { data, error } = await client
    .from('guests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGuest(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('guests')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
