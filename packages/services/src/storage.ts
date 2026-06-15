import { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'property-photos';

export async function uploadPropertyPhoto(
  client: SupabaseClient,
  propertyId: string,
  file: File | Blob,
  fileName: string
) {
  const path = `${propertyId}/${Date.now()}-${fileName}`;
  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, { contentType: (file as File).type || 'image/jpeg' });
  if (error) throw error;
  return path;
}

export async function deletePropertyPhoto(client: SupabaseClient, storagePath: string) {
  const { error } = await client.storage
    .from(BUCKET)
    .remove([storagePath]);
  if (error) throw error;
}

export function getPropertyPhotoUrl(client: SupabaseClient, storagePath: string) {
  const { data } = client.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}
