'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGuestSchema } from '@indigo-harts/types';
import { useGuest, useUpdateGuest } from '@/hooks/use-guests';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { CreateGuest } from '@indigo-harts/types';

export default function EditGuestPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: guest, isLoading } = useGuest(id);
  const updateGuest = useUpdateGuest();

  const { control, handleSubmit } = useForm<CreateGuest>({
    resolver: zodResolver(createGuestSchema),
    values: guest
      ? {
          first_name: guest.first_name,
          last_name: guest.last_name,
          phone: guest.phone,
          email: guest.email,
          notes: guest.notes,
        }
      : undefined,
  });

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!guest) return <p className="text-gray-500">Guest not found.</p>;

  const onSubmit = async (data: CreateGuest) => {
    try {
      await updateGuest.mutateAsync({ id, data });
      toast.success('Guest updated');
      router.push(`/guests/${id}`);
    } catch {
      toast.error('Failed to update guest');
    }
  };

  return (
    <div>
      <PageHeader title={`Edit ${guest.first_name} ${guest.last_name}`} />

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
            <Button type="submit" loading={updateGuest.isPending}>
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
