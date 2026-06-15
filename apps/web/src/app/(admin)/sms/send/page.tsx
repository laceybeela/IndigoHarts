'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSmsTemplates, useResolveSmsTemplate, useSendSms } from '@/hooks/use-sms';
import { useStays } from '@/hooks/use-stays';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SmsTemplate, StayWithRelations } from '@indigo-harts/types';

interface SendFormValues {
  template_id: string;
  stay_id: string;
  recipient_phone: string;
  message_body: string;
}

export default function SendSmsPage() {
  const router = useRouter();
  const { data: templates = [] } = useSmsTemplates();
  const { data: stays = [] } = useStays();
  const resolveTemplate = useResolveSmsTemplate();
  const sendSms = useSendSms();
  const [resolved, setResolved] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<SendFormValues>({
    defaultValues: {
      template_id: '',
      stay_id: '',
      recipient_phone: '',
      message_body: '',
    },
  });

  const templateId = watch('template_id');
  const stayId = watch('stay_id');

  const handleResolve = async () => {
    if (!templateId || !stayId) {
      toast.error('Select both a template and a stay');
      return;
    }
    try {
      const result = await resolveTemplate.mutateAsync({
        templateId,
        stayId,
      });
      setValue('message_body', result.message);
      setValue('recipient_phone', result.recipientPhone);
      setResolved(true);
      toast.success('Template resolved');
    } catch {
      toast.error('Failed to resolve template');
    }
  };

  const onSubmit = async (data: SendFormValues) => {
    try {
      await sendSms.mutateAsync({
        stay_id: data.stay_id || null,
        recipient_phone: data.recipient_phone,
        message_body: data.message_body,
        template_id: data.template_id || null,
      });
      toast.success('SMS sent');
      router.push('/sms');
    } catch {
      toast.error('Failed to send SMS');
    }
  };

  const stayList = stays as StayWithRelations[];

  return (
    <div>
      <PageHeader title="Send SMS" />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              {...register('template_id')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              onChange={(e) => {
                register('template_id').onChange(e);
                setResolved(false);
              }}
            >
              <option value="">Select a template</option>
              {(templates as SmsTemplate[]).map((t) => (
                <option key={t.id} value={t.id}>{t.template_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stay
            </label>
            <select
              {...register('stay_id')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              onChange={(e) => {
                register('stay_id').onChange(e);
                setResolved(false);
              }}
            >
              <option value="">Select a stay</option>
              {stayList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.guest ? `${s.guest.first_name} ${s.guest.last_name}` : 'Guest'} — {s.property?.name} ({s.check_in_date})
                </option>
              ))}
            </select>
          </div>

          {templateId && stayId && !resolved && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleResolve}
              loading={resolveTemplate.isPending}
            >
              Preview Message
            </Button>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Recipient Phone
            </label>
            <input
              {...register('recipient_phone')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              {...register('message_body')}
              rows={5}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Message body..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={sendSms.isPending}>
              Send SMS
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
