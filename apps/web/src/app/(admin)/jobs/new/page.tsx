'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCleaningJobSchema } from '@indigo-harts/types';
import { useProperties } from '@indigo-harts/hooks';
import { useCreateJob } from '@indigo-harts/hooks';
import { useStays } from '@/hooks/use-stays';
import { useEmployees } from '@/hooks/use-employees';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import type { CreateCleaningJob, Property, User, StayWithRelations } from '@indigo-harts/types';

export default function NewJobPage() {
  const router = useRouter();
  const { data: properties = [] } = useProperties();
  const { data: stays = [] } = useStays();
  const { data: employees = [] } = useEmployees();
  const createJob = useCreateJob();

  const { control, handleSubmit, watch } = useForm<CreateCleaningJob>({
    resolver: zodResolver(createCleaningJobSchema),
    defaultValues: {
      property_id: '',
      stay_id: null,
      assigned_employee_id: null,
      scheduled_date: '',
    },
  });

  const selectedPropertyId = watch('property_id');
  const propertyStays = (stays as StayWithRelations[]).filter(
    (s) => s.property_id === selectedPropertyId
  );

  const onSubmit = async (data: CreateCleaningJob) => {
    try {
      await createJob.mutateAsync(data);
      toast.success('Job created (checklists copied from templates)');
      router.push('/jobs');
    } catch {
      toast.error('Failed to create job');
    }
  };

  return (
    <div>
      <PageHeader title="New Job" />

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
            name="stay_id"
            label="Stay (optional)"
            type="select"
            placeholder="No linked stay"
            options={propertyStays.map((s) => ({
              value: s.id,
              label: `${s.guest?.first_name || ''} ${s.guest?.last_name || ''} (${s.check_in_date})`,
            }))}
          />
          <FormField
            control={control}
            name="assigned_employee_id"
            label="Assign Employee (optional)"
            type="select"
            placeholder="Unassigned"
            options={(employees as User[]).map((e) => ({
              value: e.id,
              label: e.name,
            }))}
          />
          <FormField
            control={control}
            name="scheduled_date"
            label="Scheduled Date"
            type="date"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={createJob.isPending}>
              Create Job
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
