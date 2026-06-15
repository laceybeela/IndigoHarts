import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@indigo-harts/hooks';
import {
  getSmsTemplates,
  createSmsTemplate,
  updateSmsTemplate,
  deleteSmsTemplate,
  getSmsLog,
  sendSms,
} from '@indigo-harts/services';
import type { CreateSmsTemplate, UpdateSmsTemplate, SendSms } from '@indigo-harts/types';

const STALE_TIME = 2 * 60 * 1000;

export function useSmsTemplates(propertyId?: string) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['sms-templates', propertyId],
    queryFn: () => getSmsTemplates(client, propertyId),
    staleTime: STALE_TIME,
  });
}

export function useCreateSmsTemplate() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSmsTemplate) => createSmsTemplate(client, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sms-templates'] }),
  });
}

export function useUpdateSmsTemplate() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSmsTemplate }) =>
      updateSmsTemplate(client, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sms-templates'] }),
  });
}

export function useDeleteSmsTemplate() {
  const { client } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSmsTemplate(client, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sms-templates'] }),
  });
}

export function useSmsLog(filters?: { stayId?: string; guestId?: string }) {
  const { client } = useAuth();
  return useQuery({
    queryKey: ['sms-log', filters],
    queryFn: () => getSmsLog(client, filters),
    staleTime: STALE_TIME,
  });
}

export function useSendSms() {
  const { client, user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SendSms) => sendSms(client, data, user!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sms-log'] }),
  });
}

export function useResolveSmsTemplate() {
  const { client } = useAuth();
  return useMutation({
    mutationFn: async ({ templateId, stayId }: { templateId: string; stayId: string }) => {
      const { data, error } = await client.functions.invoke('resolve-sms-template', {
        body: { templateId, stayId },
      });
      if (error) throw error;
      return data as { message: string; recipientPhone: string };
    },
  });
}
