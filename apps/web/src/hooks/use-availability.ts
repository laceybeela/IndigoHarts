import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import {
  getAvailability,
  getAllAvailability,
  upsertAvailability,
} from '@indigo-harts/services';
import type { UpsertAvailability } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000;

export function useAvailability(employeeId: string, startDate: string, endDate: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['availability', employeeId, startDate, endDate],
    queryFn: () => getAvailability(client, employeeId, startDate, endDate),
    staleTime: STALE_TIME,
    enabled: !!employeeId && !!startDate && !!endDate,
  });
}

export function useAllAvailabilityForDate(date: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['availability', 'all', date],
    queryFn: () => getAllAvailability(client, date),
    staleTime: STALE_TIME,
    enabled: !!date,
  });
}

export function useUpsertAvailability() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: string; data: UpsertAvailability }) =>
      upsertAvailability(client, employeeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}
