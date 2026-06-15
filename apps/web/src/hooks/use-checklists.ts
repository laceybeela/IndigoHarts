import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import {
  getChecklistTemplates,
  createChecklistTemplate,
  updateChecklistTemplateItems,
  deactivateChecklistTemplate,
  toggleChecklistItem,
} from '@indigo-harts/services';
import type { CreateChecklistTemplate } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000;

export function useChecklistTemplates(propertyId: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['checklist-templates', propertyId],
    queryFn: () => getChecklistTemplates(client, propertyId),
    staleTime: STALE_TIME,
    enabled: !!propertyId,
  });
}

export function useCreateChecklistTemplate() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChecklistTemplate) =>
      createChecklistTemplate(client, data),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['checklist-templates', v.property_id] });
    },
  });
}

export function useUpdateChecklistItems() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      items,
    }: {
      templateId: string;
      propertyId: string;
      items: { task_name: string; display_order: number }[];
    }) => updateChecklistTemplateItems(client, templateId, items),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['checklist-templates', v.propertyId] });
    },
  });
}

export function useDeactivateChecklistTemplate() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) =>
      deactivateChecklistTemplate(client, id),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['checklist-templates', v.propertyId] });
    },
  });
}

export function useToggleChecklistItem() {
  const { client, user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, completed }: { itemId: string; completed: boolean }) =>
      toggleChecklistItem(client, itemId, completed, user!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cleaning-jobs'] });
    },
  });
}
