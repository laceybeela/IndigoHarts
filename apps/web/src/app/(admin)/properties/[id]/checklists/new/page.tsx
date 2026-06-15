'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChecklistTemplateSchema } from '@indigo-harts/types';
import { useProperty } from '@indigo-harts/hooks';
import { useCreateChecklistTemplate } from '@/hooks/use-checklists';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface FormValues {
  property_id: string;
  name: string;
  items: { task_name: string; display_order: number }[];
}

export default function NewChecklistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property } = useProperty(id);
  const createTemplate = useCreateChecklistTemplate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createChecklistTemplateSchema),
    defaultValues: {
      property_id: id,
      name: '',
      items: [{ task_name: '', display_order: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: FormValues) => {
    const withOrder = {
      ...data,
      items: data.items.map((item, i) => ({ ...item, display_order: i })),
    };
    try {
      await createTemplate.mutateAsync(withOrder);
      toast.success('Checklist template created');
      router.push(`/properties/${id}/checklists`);
    } catch {
      toast.error('Failed to create template');
    }
  };

  return (
    <div>
      <PageHeader title={`New Checklist — ${property?.name || ''}`} />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Template Name
            </label>
            <input
              {...register('name')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
              placeholder="e.g. Standard Turnover Clean"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

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
            {errors.items && (
              <p className="mt-1 text-xs text-red-600">
                {typeof errors.items.message === 'string'
                  ? errors.items.message
                  : 'Please fill in all tasks'}
              </p>
            )}
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
            <Button type="submit" loading={createTemplate.isPending}>
              Create Template
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
