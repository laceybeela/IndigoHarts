'use client';

import { useRouter } from 'next/navigation';
import { useEmployees, useToggleEmployee } from '@/hooks/use-employees';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/ui/data-table';
import { toast } from 'sonner';
import type { User } from '@indigo-harts/types';

export default function EmployeesPage() {
  const router = useRouter();
  const { data: employees = [], isLoading } = useEmployees(true);
  const toggleEmployee = useToggleEmployee();

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleEmployee.mutateAsync({ id, isActive });
      toast.success(isActive ? 'Employee activated' : 'Employee deactivated');
    } catch {
      toast.error('Failed to update employee');
    }
  };

  const empList = (employees as User[]).filter((e) => e.role === 'employee');

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      sortValue: (e) => e.name,
      render: (e) => <span className="font-medium text-gray-900">{e.name}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (e) => e.email,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (e) => e.phone || '—',
    },
    {
      key: 'status',
      header: 'Active',
      render: (e) => (
        <button
          onClick={(ev) => {
            ev.stopPropagation();
            handleToggle(e.id, !e.is_active);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            e.is_active ? 'bg-sage-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              e.is_active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage cleaning staff"
        action={
          <Button onClick={() => router.push('/employees/new')}>
            Add Employee
          </Button>
        }
      />

      <DataTable
        data={empList}
        columns={columns}
        keyExtractor={(e) => e.id}
        loading={isLoading}
        emptyMessage="No employees found"
      />
    </div>
  );
}
