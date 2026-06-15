import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import { getUsers, getEmployees, updateUser } from '@indigo-harts/services';

const STALE_TIME = 2 * 60 * 1000;

export function useEmployees(includeInactive = false) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['employees', { includeInactive }],
    queryFn: () =>
      includeInactive ? getUsers(client, false) : getEmployees(client),
    staleTime: STALE_TIME,
  });
}

export function useAllUsers(activeOnly = true) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['users', { activeOnly }],
    queryFn: () => getUsers(client, activeOnly),
    staleTime: STALE_TIME,
  });
}

export function useCreateEmployee() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; phone?: string; password: string }) => {
      const { data: result, error } = await client.functions.invoke('create-employee', {
        body: data,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useToggleEmployee() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUser(client, id, { is_active: isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
