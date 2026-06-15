import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth-context';
import {
  getCleaningJobs,
  getCleaningJobById,
  getMyJobs,
  createCleaningJob,
  updateJobStatus,
} from '@indigo-harts/services';
import type { CreateCleaningJob, JobStatus } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export function useCleaningJobs(filters?: { status?: string; date?: string; employeeId?: string }) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['cleaning-jobs', filters],
    queryFn: () => getCleaningJobs(client, filters),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCleaningJob(id: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['cleaning-jobs', id],
    queryFn: () => getCleaningJobById(client, id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id,
  });
}

export function useMyJobs() {
  const { client, user } = useAuth();
  return useQuery({
    queryKey: ['my-jobs', user?.id],
    queryFn: () => getMyJobs(client, user!.id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!user,
  });
}

export function useCreateJob() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCleaningJob) => createCleaningJob(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaning-jobs'] });
    },
  });
}

export function useUpdateJobStatus() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      updateJobStatus(client, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaning-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
}
