import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
} from '@indigo-harts/services';
import type { CreateGuest, UpdateGuest } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000;

export function useGuests() {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['guests'],
    queryFn: () => getGuests(client),
    staleTime: STALE_TIME,
  });
}

export function useGuest(id: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['guests', id],
    queryFn: () => getGuestById(client, id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

export function useCreateGuest() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGuest) => createGuest(client, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['guests'] }),
  });
}

export function useUpdateGuest() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGuest }) =>
      updateGuest(client, id, data),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['guests'] });
      qc.invalidateQueries({ queryKey: ['guests', v.id] });
    },
  });
}

export function useDeleteGuest() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGuest(client, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['guests'] }),
  });
}
