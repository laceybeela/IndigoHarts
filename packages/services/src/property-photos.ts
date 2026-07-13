import { SupabaseClient } from '@supabase/supabase-js';

export async function getPropertyPhotos(client: SupabaseClient, propertyId: string) {
  const { data, error } = await client
    .from('property_photos')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order')
    .order('created_at');
  if (error) throw error;
  return data;
}

export async function createPropertyPhoto(
  client: SupabaseClient,
  data: { property_id: string; storage_path: string; display_order?: number; caption?: string | null }
) {
  const { data: photo, error } = await client
    .from('property_photos')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return photo;
}

export async function deletePropertyPhotoRecord(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('property_photos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
