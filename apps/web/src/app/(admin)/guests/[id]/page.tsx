'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGuest, useDeleteGuest } from '@/hooks/use-guests';
import { useStays } from '@/hooks/use-stays';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import type { StayWithRelations } from '@indigo-harts/types';

export default function GuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: guest, isLoading } = useGuest(id);
  const { data: allStays = [] } = useStays();
  const deleteGuest = useDeleteGuest();
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!guest) return <p className="text-gray-500">Guest not found.</p>;

  const guestStays = (allStays as StayWithRelations[]).filter(
    (s) => s.guest_id === id
  );

  const handleDelete = async () => {
    try {
      await deleteGuest.mutateAsync(id);
      toast.success('Guest deleted');
      router.push('/guests');
    } catch {
      toast.error('Failed to delete guest');
    }
  };

  return (
    <div>
      <PageHeader
        title={`${guest.first_name} ${guest.last_name}`}
        action={
          <div className="flex gap-2">
            <Button variant="danger" onClick={() => setShowDelete(true)}>
              Delete
            </Button>
            <Button onClick={() => router.push(`/guests/${id}/edit`)}>
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Contact Information
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{guest.email || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium text-gray-900">{guest.phone || '—'}</dd>
            </div>
          </dl>
          {guest.notes && (
            <>
              <h3 className="mb-2 mt-6 text-sm font-semibold text-gray-900">
                Notes
              </h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">
                {guest.notes}
              </p>
            </>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Stay History
          </h3>
          {guestStays.length === 0 ? (
            <p className="text-sm text-gray-500">No stays recorded.</p>
          ) : (
            <div className="space-y-3">
              {guestStays.map((stay) => (
                <div
                  key={stay.id}
                  className="cursor-pointer rounded border border-gray-200 p-3 hover:bg-gray-50"
                  onClick={() => router.push(`/stays/${stay.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {stay.property?.name || 'Unknown Property'}
                    </p>
                    <StatusBadge status={stay.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {stay.check_in_date} — {stay.check_out_date}
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
        title="Delete Guest"
        message="Are you sure you want to delete this guest? This cannot be undone."
        confirmLabel="Delete"
        loading={deleteGuest.isPending}
      />
    </div>
  );
}
