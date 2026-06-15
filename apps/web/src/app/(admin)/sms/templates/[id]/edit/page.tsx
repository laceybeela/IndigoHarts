'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSmsTemplateSchema } from '@indigo-harts/types';
import { useProperties } from '@indigo-harts/hooks';
import { useSmsTemplates, useUpdateSmsTemplate } from '@/hooks/use-sms';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { CreateSmsTemplate, Property, SmsTemplate } from '@indigo-harts/types';

export default function EditSmsTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: properties = [] } = useProperties();
  const { data: templates = [], isLoading } = useSmsTemplates();
  const updateTemplate = useUpdateSmsTemplate();

  const template = (templates as SmsTemplate[]).find((t) => t.id === id);

  const { control, handleSubmit } = useForm<CreateSmsTemplate>({
    resolver: zodResolver(createSmsTemplateSchema),
    values: template
      ? {
          template_name: template.template_name,
          message_body: template.message_body,
          property_id: template.property_id,
        }
      : undefined,
  });

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!template) return <p className="text-gray-500">Template not found.</p>;

  const onSubmit = async (data: CreateSmsTemplate) => {
    try {
      await updateTemplate.mutateAsync({ id, data });
      toast.success('Template updated');
      router.push('/sms');
    } catch {
      toast.error('Failed to update template');
    }
  };

  return (
    <div>
      <PageHeader title={`Edit: ${template.template_name}`} />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={control} name="template_name" label="Template Name" />
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
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={updateTemplate.isPending}>
              Save Changes
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
