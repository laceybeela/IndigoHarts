'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPropertySchema } from '@indigo-harts/types';
import { useProperty, useUpdateProperty } from '@indigo-harts/hooks';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { CreateProperty } from '@indigo-harts/types';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);
  const updateProperty = useUpdateProperty();

  const { control, handleSubmit, reset } = useForm<CreateProperty>({
    resolver: zodResolver(createPropertySchema),
    values: property
      ? {
          name: property.name,
          address: property.address,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          notes: property.notes,
          entry_code: property.entry_code,
          lockbox_code: property.lockbox_code,
          wifi_name: property.wifi_name,
          wifi_password: property.wifi_password,
        }
      : undefined,
  });

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!property) return <p className="text-gray-500">Property not found.</p>;

  const onSubmit = async (data: CreateProperty) => {
    try {
      await updateProperty.mutateAsync({ id, data });
      toast.success('Property updated');
      router.push(`/properties/${id}`);
    } catch {
      toast.error('Failed to update property');
    }
  };

  return (
    <div>
      <PageHeader title={`Edit ${property.name}`} />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={control} name="name" label="Property Name" />
          <FormField control={control} name="address" label="Address" />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="bedrooms" label="Bedrooms" type="number" />
            <FormField control={control} name="bathrooms" label="Bathrooms" type="number" />
          </div>

          <FormField control={control} name="notes" label="Notes" type="textarea" />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="entry_code" label="Entry Code" />
            <FormField control={control} name="lockbox_code" label="Lockbox Code" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="wifi_name" label="WiFi Name" />
            <FormField control={control} name="wifi_password" label="WiFi Password" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={updateProperty.isPending}>
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
