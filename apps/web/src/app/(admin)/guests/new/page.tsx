'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGuestSchema } from '@indigo-harts/types';
import { useCreateGuest } from '@/hooks/use-guests';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import type { CreateGuest } from '@indigo-harts/types';

export default function NewGuestPage() {
  const router = useRouter();
  const createGuest = useCreateGuest();

  const { control, handleSubmit } = useForm<CreateGuest>({
    resolver: zodResolver(createGuestSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: null,
      email: null,
      notes: null,
    },
  });

  const onSubmit = async (data: CreateGuest) => {
    try {
      await createGuest.mutateAsync(data);
      toast.success('Guest created');
      router.push('/guests');
    } catch {
      toast.error('Failed to create guest');
    }
  };

  return (
    <div>
      <PageHeader title="New Guest" />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="first_name" label="First Name" />
            <FormField control={control} name="last_name" label="Last Name" />
          </div>
          <FormField control={control} name="email" label="Email" type="email" />
          <FormField control={control} name="phone" label="Phone" />
          <FormField control={control} name="notes" label="Notes" type="textarea" />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={createGuest.isPending}>
              Create Guest
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
