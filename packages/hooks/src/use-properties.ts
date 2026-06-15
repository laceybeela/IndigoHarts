import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth-context';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
} from '@indigo-harts/services';
import type { CreateProperty, UpdateProperty } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const GC_TIME = 10 * 60 * 1000; // 10 minutes

export function useProperties(includeInactive = false) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['properties', { includeInactive }],
    queryFn: () => getProperties(client, includeInactive),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useProperty(id: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => getPropertyById(client, id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProperty) => createProperty(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProperty }) =>
      updateProperty(client, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
    },
  });
}
