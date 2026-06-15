'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@indigo-harts/types';
import { useCreateEmployee } from '@/hooks/use-employees';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';

interface EmployeeFormValues {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export default function NewEmployeePage() {
  const router = useRouter();
  const createEmployee = useCreateEmployee();

  const { control, handleSubmit } = useForm<EmployeeFormValues>({
    resolver: zodResolver(
      createUserSchema.pick({ name: true, email: true, phone: true, password: true })
    ),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      await createEmployee.mutateAsync(data);
      toast.success('Employee created');
      router.push('/employees');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create employee');
    }
  };

  return (
    <div>
      <PageHeader
        title="New Employee"
        description="Create an employee account via Edge Function"
      />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={control} name="name" label="Full Name" />
          <FormField control={control} name="email" label="Email" type="email" />
          <FormField control={control} name="phone" label="Phone (optional)" />
          <FormField
            control={control}
            name="password"
            label="Temporary Password"
            type="password"
            placeholder="Min 8 characters"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={createEmployee.isPending}>
              Create Employee
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
