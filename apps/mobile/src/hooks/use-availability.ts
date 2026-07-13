import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import { getAvailability, upsertAvailability } from '@indigo-harts/services';
import type { UpsertAvailability } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000;

export function useMyAvailability(startDate: string, endDate: string) {
  const { client, user } = useAuth();
  return useQuery({
    queryKey: ['my-availability', startDate, endDate],
    queryFn: () => getAvailability(client, user!.id, startDate, endDate),
    staleTime: STALE_TIME,
    enabled: !!user && !!startDate && !!endDate,
  });
}

export function useUpsertMyAvailability() {
  const { client, user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertAvailability) =>
      upsertAvailability(client, user!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-availability'] });
    },
  });
}
