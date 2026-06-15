'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSmsTemplateSchema } from '@indigo-harts/types';
import { useProperties } from '@indigo-harts/hooks';
import { useCreateSmsTemplate } from '@/hooks/use-sms';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import type { CreateSmsTemplate, Property } from '@indigo-harts/types';

export default function NewSmsTemplatePage() {
  const router = useRouter();
  const { data: properties = [] } = useProperties();
  const createTemplate = useCreateSmsTemplate();

  const { control, handleSubmit } = useForm<CreateSmsTemplate>({
    resolver: zodResolver(createSmsTemplateSchema),
    defaultValues: {
      template_name: '',
      message_body: '',
      property_id: null,
    },
  });

  const onSubmit = async (data: CreateSmsTemplate) => {
    const payload = {
      ...data,
      property_id: data.property_id || null,
    };
    try {
      await createTemplate.mutateAsync(payload);
      toast.success('Template created');
      router.push('/sms');
    } catch {
      toast.error('Failed to create template');
    }
  };

  return (
    <div>
      <PageHeader title="New SMS Template" />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={control} name="template_name" label="Template Name" placeholder="e.g. Check-in Welcome" />
          <FormField
            control={control}
            name="property_id"
            label="Property (optional)"
            type="select"
            placeholder="All properties"
            options={(properties as Property[]).map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />
          <FormField
            control={control}
            name="message_body"
            label="Message Body"
            type="textarea"
            placeholder="Use {{guest_name}}, {{property_address}}, {{wifi_password}}, {{check_in_date}}, {{check_out_date}}"
          />
          <p className="text-xs text-gray-400">
            Available variables: {'{{guest_name}}'}, {'{{property_address}}'}, {'{{wifi_password}}'}, {'{{wifi_name}}'}, {'{{check_in_date}}'}, {'{{check_out_date}}'}
          </p>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={createTemplate.isPending}>
              Create Template
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
