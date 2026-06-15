'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCleaningJob, useUpdateJobStatus } from '@indigo-harts/hooks';
import { useToggleChecklistItem } from '@/hooks/use-checklists';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { JobStatus } from '@indigo-harts/types';
import type { CleaningJobWithRelations } from '@indigo-harts/types';
import { deleteCleaningJob } from '@indigo-harts/services';
import { useAuth } from '@indigo-harts/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { data: job, isLoading } = useCleaningJob(id);
  const updateStatus = useUpdateJobStatus();
  const toggleItem = useToggleChecklistItem();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!job) return <p className="text-gray-500">Job not found.</p>;

  const j = job as CleaningJobWithRelations;

  const handleStatusChange = async (status: JobStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCleaningJob(client, id);
      queryClient.invalidateQueries({ queryKey: ['cleaning-jobs'] });
      toast.success('Job deleted');
      router.push('/jobs');
    } catch {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (itemId: string, completed: boolean) => {
    try {
      await toggleItem.mutateAsync({ itemId, completed });
    } catch {
      toast.error('Failed to update item');
    }
  };

  const nextStatus: Partial<Record<JobStatus, { label: string; status: JobStatus }>> = {
    [JobStatus.Assigned]: { label: 'Accept', status: JobStatus.Accepted },
    [JobStatus.Accepted]: { label: 'Start', status: JobStatus.InProgress },
    [JobStatus.InProgress]: { label: 'Complete', status: JobStatus.Completed },
  };

  const action = nextStatus[j.status as JobStatus];

  return (
    <div>
      <PageHeader
        title={j.property?.name || 'Job'}
        description={`Scheduled: ${j.scheduled_date}`}
        action={
          <div className="flex gap-2">
            <Button variant="danger" onClick={() => setShowDelete(true)}>
              Delete
            </Button>
            <Button onClick={() => router.push(`/jobs/${id}/edit`)}>
              Edit
            </Button>
            {action && (
              <Button
                onClick={() => handleStatusChange(action.status)}
                loading={updateStatus.isPending}
              >
                {action.label}
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Job Details
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd><StatusBadge status={j.status} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Employee</dt>
              <dd className="font-medium text-gray-900">
                {j.assigned_employee?.name || 'Unassigned'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Guest</dt>
              <dd className="font-medium text-gray-900">
                {j.stay?.guest
                  ? `${j.stay.guest.first_name} ${j.stay.guest.last_name}`
                  : '—'}
              </dd>
            </div>
            {j.accepted_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Accepted</dt>
                <dd className="text-gray-700">{new Date(j.accepted_at).toLocaleString()}</dd>
              </div>
            )}
            {j.started_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Started</dt>
                <dd className="text-gray-700">{new Date(j.started_at).toLocaleString()}</dd>
              </div>
            )}
            {j.completed_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Completed</dt>
                <dd className="text-gray-700">{new Date(j.completed_at).toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </Card>

        <div className="space-y-4">
          {j.job_checklists && j.job_checklists.length > 0 ? (
            j.job_checklists.map((checklist) => (
              <Card key={checklist.id}>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  {checklist.checklist_name}
                </h3>
                <ul className="space-y-2">
                  {checklist.items
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.is_completed}
                          onChange={(e) =>
                            handleToggle(item.id, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-sage-600 focus:ring-sage-500"
                        />
                        <span
                          className={`text-sm ${
                            item.is_completed
                              ? 'text-gray-400 line-through'
                              : 'text-gray-700'
                          }`}
                        >
                          {item.task_name}
                        </span>
                      </li>
                    ))}
                </ul>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-sm text-gray-500">No checklists attached.</p>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job?"
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
