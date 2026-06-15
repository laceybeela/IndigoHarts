'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProperty } from '@indigo-harts/hooks';
import { useChecklistTemplates, useDeactivateChecklistTemplate } from '@/hooks/use-checklists';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { ClipboardList, Pencil, Trash2 } from 'lucide-react';
import type { ChecklistTemplateWithItems } from '@indigo-harts/types';

export default function ChecklistsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property } = useProperty(id);
  const { data: templates = [], isLoading } = useChecklistTemplates(id);
  const deactivate = useDeactivateChecklistTemplate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeactivate = async () => {
    if (!deleteId) return;
    try {
      await deactivate.mutateAsync({ id: deleteId, propertyId: id });
      toast.success('Checklist template removed');
      setDeleteId(null);
    } catch {
      toast.error('Failed to remove template');
    }
  };

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;

  return (
    <div>
      <PageHeader
        title={`Checklists — ${property?.name || ''}`}
        description="Manage checklist templates for this property"
        action={
          <Button onClick={() => router.push(`/properties/${id}/checklists/new`)}>
            Add Template
          </Button>
        }
      />

      {templates.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-12 w-12" />}
          message="No checklist templates yet"
          action={
            <Button onClick={() => router.push(`/properties/${id}/checklists/new`)}>
              Create First Template
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {(templates as ChecklistTemplateWithItems[]).map((t) => (
            <Card key={t.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t.items?.length || 0} tasks
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/properties/${id}/checklists/${t.id}/edit`)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(t.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {t.items && t.items.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {t.items
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((item, i) => (
                      <li key={item.id} className="text-sm text-gray-600">
                        {i + 1}. {item.task_name}
                      </li>
                    ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeactivate}
        title="Remove Template"
        message="This will deactivate the checklist template. It won't affect existing jobs."
        confirmLabel="Remove"
        loading={deactivate.isPending}
      />
    </div>
  );
}
