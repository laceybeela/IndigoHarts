'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCleaningJob } from '@indigo-harts/hooks';
import { useEmployees } from '@/hooks/use-employees';
import { useStays } from '@/hooks/use-stays';
import { useAuth } from '@indigo-harts/hooks';
import { updateCleaningJob } from '@indigo-harts/services';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { JobStatus } from '@indigo-harts/types';
import type { CleaningJobWithRelations, User, StayWithRelations, UpdateCleaningJob } from '@indigo-harts/types';

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { data: job, isLoading } = useCleaningJob(id);
  const { data: employees = [] } = useEmployees();
  const { data: stays = [] } = useStays();

  const j = job as CleaningJobWithRelations | undefined;

  const { control, handleSubmit } = useForm<UpdateCleaningJob>({
    values: j
      ? {
          assigned_employee_id: j.assigned_employee_id,
          scheduled_date: j.scheduled_date,
          status: j.status as JobStatus,
        }
      : undefined,
  });

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!j) return <p className="text-gray-500">Job not found.</p>;

  const onSubmit = async (data: UpdateCleaningJob) => {
    try {
      await updateCleaningJob(client, id, data);
      queryClient.invalidateQueries({ queryKey: ['cleaning-jobs'] });
      toast.success('Job updated');
      router.push(`/jobs/${id}`);
    } catch {
      toast.error('Failed to update job');
    }
  };

  return (
    <div>
      <PageHeader title={`Edit Job — ${j.property?.name || ''}`} />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="assigned_employee_id"
            label="Assigned Employee"
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
          <FormField
            control={control}
            name="status"
            label="Status"
            type="select"
            options={Object.values(JobStatus).map((s) => ({
              value: s,
              label: s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            }))}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit">
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
