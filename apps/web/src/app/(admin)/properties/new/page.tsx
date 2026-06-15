'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPropertySchema } from '@indigo-harts/types';
import { useCreateProperty } from '@indigo-harts/hooks';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import type { CreateProperty } from '@indigo-harts/types';

export default function NewPropertyPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();

  const { control, handleSubmit } = useForm<CreateProperty>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      name: '',
      address: '',
      bedrooms: 1,
      bathrooms: 1,
      notes: null,
      entry_code: null,
      lockbox_code: null,
      wifi_name: null,
      wifi_password: null,
    },
  });

  const onSubmit = async (data: CreateProperty) => {
    try {
      await createProperty.mutateAsync(data);
      toast.success('Property created');
      router.push('/properties');
    } catch {
      toast.error('Failed to create property');
    }
  };

  return (
    <div>
      <PageHeader title="New Property" />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={control} name="name" label="Property Name" placeholder="e.g. Sunset Beach House" />
          <FormField control={control} name="address" label="Address" placeholder="Full address" />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="bedrooms" label="Bedrooms" type="number" />
            <FormField control={control} name="bathrooms" label="Bathrooms" type="number" />
          </div>

          <FormField control={control} name="notes" label="Notes" type="textarea" placeholder="Special instructions..." />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="entry_code" label="Entry Code" placeholder="e.g. 1234" />
            <FormField control={control} name="lockbox_code" label="Lockbox Code" placeholder="e.g. 5678" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="wifi_name" label="WiFi Name" />
            <FormField control={control} name="wifi_password" label="WiFi Password" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={createProperty.isPending}>
              Create Property
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
