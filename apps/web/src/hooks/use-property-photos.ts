import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import {
  getPropertyPhotos,
  createPropertyPhoto,
  deletePropertyPhotoRecord,
  uploadPropertyPhoto,
  deletePropertyPhoto,
  getPropertyPhotoUrl,
} from '@indigo-harts/services';

const STALE_TIME = 2 * 60 * 1000;

export function usePropertyPhotos(propertyId: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['property-photos', propertyId],
    queryFn: () => getPropertyPhotos(client, propertyId),
    staleTime: STALE_TIME,
    enabled: !!propertyId,
  });
}

export function useUploadPropertyPhoto() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      propertyId,
      file,
      fileName,
      caption,
    }: {
      propertyId: string;
      file: File;
      fileName: string;
      caption?: string;
    }) => {
      // Upload to storage
      const storagePath = await uploadPropertyPhoto(client, propertyId, file, fileName);
      // Create DB record
      const photo = await createPropertyPhoto(client, {
        property_id: propertyId,
        storage_path: storagePath,
        caption: caption || null,
      });
      return photo;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['property-photos', variables.propertyId] });
    },
  });
}

export function useDeletePropertyPhoto() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      storagePath,
      propertyId,
    }: {
      id: string;
      storagePath: string;
      propertyId: string;
    }) => {
      // Delete from storage
      await deletePropertyPhoto(client, storagePath);
      // Delete DB record
      await deletePropertyPhotoRecord(client, id);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['property-photos', variables.propertyId] });
    },
  });
}

export function usePropertyPhotoUrl() {
  const { client } = useAuth();
  return (storagePath: string) => getPropertyPhotoUrl(client, storagePath);
}
