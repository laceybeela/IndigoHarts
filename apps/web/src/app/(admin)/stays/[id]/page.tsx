'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStay, useDeleteStay, useUpdateStay } from '@/hooks/use-stays';
import { useCleaningJobs } from '@indigo-harts/hooks';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { StayStatus } from '@indigo-harts/types';
import type { StayWithRelations, CleaningJobWithRelations } from '@indigo-harts/types';

export default function StayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: stay, isLoading } = useStay(id);
  const { data: allJobs = [] } = useCleaningJobs();
  const deleteStay = useDeleteStay();
  const updateStay = useUpdateStay();
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!stay) return <p className="text-gray-500">Stay not found.</p>;

  const s = stay as StayWithRelations;
  const linkedJobs = (allJobs as CleaningJobWithRelations[]).filter(
    (j) => j.stay_id === id
  );

  const handleDelete = async () => {
    try {
      await deleteStay.mutateAsync(id);
      toast.success('Stay deleted');
      router.push('/stays');
    } catch {
      toast.error('Failed to delete stay');
    }
  };

  const handleStatusChange = async (status: StayStatus) => {
    try {
      await updateStay.mutateAsync({ id, data: { status } });
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <PageHeader
        title={s.guest ? `${s.guest.first_name} ${s.guest.last_name}` : 'Stay'}
        description={s.property?.name || ''}
        action={
          <div className="flex gap-2">
            <Button variant="danger" onClick={() => setShowDelete(true)}>
              Delete
            </Button>
            <Button onClick={() => router.push(`/stays/${id}/edit`)}>
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Stay Details
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Check In</dt>
              <dd className="font-medium text-gray-900">{s.check_in_date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Check Out</dt>
              <dd className="font-medium text-gray-900">{s.check_out_date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd><StatusBadge status={s.status} /></dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {s.status !== StayStatus.CheckedIn && (
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => handleStatusChange(StayStatus.CheckedIn)}
              >
                Check In
              </Button>
            )}
            {s.status !== StayStatus.CheckedOut && (
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => handleStatusChange(StayStatus.CheckedOut)}
              >
                Check Out
              </Button>
            )}
            {s.status !== StayStatus.Cancelled && (
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => handleStatusChange(StayStatus.Cancelled)}
              >
                Cancel
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Linked Jobs
          </h3>
          {linkedJobs.length === 0 ? (
            <p className="text-sm text-gray-500">No jobs linked to this stay.</p>
          ) : (
            <div className="space-y-3">
              {linkedJobs.map((job) => (
                <div
                  key={job.id}
                  className="cursor-pointer rounded border border-gray-200 p-3 hover:bg-gray-50"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {job.property?.name}
                    </p>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {job.scheduled_date} — {job.assigned_employee?.name || 'Unassigned'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Stay"
        message="Are you sure you want to delete this stay?"
        confirmLabel="Delete"
        loading={deleteStay.isPending}
      />
    </div>
  );
}
