'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStaySchema, StayStatus } from '@indigo-harts/types';
import { useProperties } from '@indigo-harts/hooks';
import { useGuests } from '@/hooks/use-guests';
import { useCreateStay } from '@/hooks/use-stays';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import type { Property, Guest } from '@indigo-harts/types';

interface StayFormValues {
  property_id: string;
  guest_id: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

export default function NewStayPage() {
  const router = useRouter();
  const { data: properties = [] } = useProperties();
  const { data: guests = [] } = useGuests();
  const createStay = useCreateStay();

  const { control, handleSubmit } = useForm<StayFormValues>({
    resolver: zodResolver(createStaySchema),
    defaultValues: {
      property_id: '',
      guest_id: '',
      check_in_date: '',
      check_out_date: '',
      status: StayStatus.Upcoming,
    },
  });

  const onSubmit = async (data: StayFormValues) => {
    try {
      await createStay.mutateAsync(data);
      toast.success('Stay created');
      router.push('/stays');
    } catch {
      toast.error('Failed to create stay');
    }
  };

  return (
    <div>
      <PageHeader title="New Stay" />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="property_id"
            label="Property"
            type="select"
            placeholder="Select a property"
            options={(properties as Property[]).map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />
          <FormField
            control={control}
            name="guest_id"
            label="Guest"
            type="select"
            placeholder="Select a guest"
            options={(guests as Guest[]).map((g) => ({
              value: g.id,
              label: `${g.first_name} ${g.last_name}`,
            }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="check_in_date" label="Check-in Date" type="date" />
            <FormField control={control} name="check_out_date" label="Check-out Date" type="date" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={createStay.isPending}>
              Create Stay
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
