import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import {
  getStays,
  getStayById,
  getStaysByProperty,
  createStay,
  updateStay,
  deleteStay,
} from '@indigo-harts/services';
import type { UpdateStay } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000;

export function useStays() {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['stays'],
    queryFn: () => getStays(client),
    staleTime: STALE_TIME,
  });
}

export function useStay(id: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['stays', id],
    queryFn: () => getStayById(client, id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

export function useStaysByProperty(propertyId: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['stays', 'by-property', propertyId],
    queryFn: () => getStaysByProperty(client, propertyId),
    staleTime: STALE_TIME,
    enabled: !!propertyId,
  });
}

export function useCreateStay() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { property_id: string; guest_id: string; check_in_date: string; check_out_date: string; status?: string }) =>
      createStay(client, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stays'] });
    },
  });
}

export function useUpdateStay() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStay }) =>
      updateStay(client, id, data),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['stays'] });
      qc.invalidateQueries({ queryKey: ['stays', v.id] });
    },
  });
}

export function useDeleteStay() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStay(client, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stays'] }),
  });
}
