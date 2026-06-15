'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { StayStatus } from '@indigo-harts/types';
import { useStay, useUpdateStay } from '@/hooks/use-stays';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { UpdateStay } from '@indigo-harts/types';

export default function EditStayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: stay, isLoading } = useStay(id);
  const updateStay = useUpdateStay();

  const { control, handleSubmit } = useForm<UpdateStay>({
    values: stay
      ? {
          check_in_date: stay.check_in_date,
          check_out_date: stay.check_out_date,
          status: stay.status,
        }
      : undefined,
  });

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!stay) return <p className="text-gray-500">Stay not found.</p>;

  const onSubmit = async (data: UpdateStay) => {
    try {
      await updateStay.mutateAsync({ id, data });
      toast.success('Stay updated');
      router.push(`/stays/${id}`);
    } catch {
      toast.error('Failed to update stay');
    }
  };

  return (
    <div>
      <PageHeader title="Edit Stay" />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="check_in_date" label="Check-in Date" type="date" />
            <FormField control={control} name="check_out_date" label="Check-out Date" type="date" />
          </div>
          <FormField
            control={control}
            name="status"
            label="Status"
            type="select"
            options={Object.values(StayStatus).map((s) => ({
              value: s,
              label: s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            }))}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={updateStay.isPending}>
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
