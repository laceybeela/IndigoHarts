'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useProperty } from '@indigo-harts/hooks';
import { useChecklistTemplates, useUpdateChecklistItems } from '@/hooks/use-checklists';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, X } from 'lucide-react';
import type { ChecklistTemplateWithItems } from '@indigo-harts/types';

interface FormValues {
  items: { task_name: string; display_order: number }[];
}

export default function EditChecklistPage() {
  const { id, templateId } = useParams<{ id: string; templateId: string }>();
  const router = useRouter();
  const { data: property } = useProperty(id);
  const { data: templates = [], isLoading } = useChecklistTemplates(id);
  const updateItems = useUpdateChecklistItems();

  const template = (templates as ChecklistTemplateWithItems[]).find(
    (t) => t.id === templateId
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    values: template
      ? {
          items: template.items
            .sort((a, b) => a.display_order - b.display_order)
            .map((item) => ({
              task_name: item.task_name,
              display_order: item.display_order,
            })),
        }
      : { items: [{ task_name: '', display_order: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!template) return <p className="text-gray-500">Template not found.</p>;

  const onSubmit = async (data: FormValues) => {
    const items = data.items.map((item, i) => ({
      task_name: item.task_name,
      display_order: i,
    }));
    try {
      await updateItems.mutateAsync({
        templateId,
        propertyId: id,
        items,
      });
      toast.success('Checklist updated');
      router.push(`/properties/${id}/checklists`);
    } catch {
      toast.error('Failed to update checklist');
    }
  };

  return (
    <div>
      <PageHeader title={`Edit: ${template.name} — ${property?.name || ''}`} />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tasks
            </label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <span className="flex h-9 w-8 items-center justify-center text-sm text-gray-400">
                    {index + 1}.
                  </span>
                  <input
                    {...register(`items.${index}.task_name`)}
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                    placeholder="Task description"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                append({ task_name: '', display_order: fields.length })
              }
              className="mt-2 inline-flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700"
            >
              <Plus className="h-4 w-4" /> Add Task
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={updateItems.isPending}>
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
