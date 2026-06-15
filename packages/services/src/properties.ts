import { SupabaseClient } from '@supabase/supabase-js';
import type { CreateProperty, UpdateProperty } from '@indigo-harts/types';

export async function getProperties(client: SupabaseClient, includeInactive = false) {
  let query = client.from('properties').select('*').order('name');
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPropertyById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProperty(client: SupabaseClient, property: CreateProperty) {
  const { data, error } = await client
    .from('properties')
    .insert(property)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProperty(client: SupabaseClient, id: string, updates: UpdateProperty) {
  const { data, error } = await client
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deactivateProperty(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('properties')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
