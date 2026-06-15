import { SupabaseClient } from '@supabase/supabase-js';
import type { UpdateUser } from '@indigo-harts/types';

export async function getUsers(client: SupabaseClient, activeOnly = true) {
  let query = client.from('users').select('*').order('name');
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getEmployees(client: SupabaseClient) {
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('role', 'employee')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data;
}

export async function getUserById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getCurrentUser(client: SupabaseClient) {
  const { data: { user: authUser } } = await client.auth.getUser();
  if (!authUser) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateUser(client: SupabaseClient, id: string, updates: UpdateUser) {
  const { data, error } = await client
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
