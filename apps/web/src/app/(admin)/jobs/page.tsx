'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCleaningJobs } from '@indigo-harts/hooks';
import { useEmployees } from '@/hooks/use-employees';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { JobStatus } from '@indigo-harts/types';
import type { CleaningJobWithRelations, User } from '@indigo-harts/types';

const statusTabs = [
  { label: 'All', value: '' },
  ...Object.values(JobStatus).map((s) => ({
    label: s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value: s,
  })),
];

export default function JobsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const filters: Record<string, string> = {};
  if (statusFilter) filters.status = statusFilter;
  if (dateFilter) filters.date = dateFilter;
  if (employeeFilter) filters.employeeId = employeeFilter;

  const { data: jobs = [], isLoading } = useCleaningJobs(
    Object.keys(filters).length > 0 ? filters : undefined
  );
  const { data: employees = [] } = useEmployees();

  const columns: Column<CleaningJobWithRelations>[] = [
    {
      key: 'property',
      header: 'Property',
      render: (j) => (
        <span className="font-medium text-gray-900">
          {j.property?.name || '—'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: (j) => j.scheduled_date,
      render: (j) => j.scheduled_date,
    },
    {
      key: 'employee',
      header: 'Employee',
      render: (j) => j.assigned_employee?.name || 'Unassigned',
    },
    {
      key: 'guest',
      header: 'Guest',
      render: (j) =>
        j.stay?.guest
          ? `${j.stay.guest.first_name} ${j.stay.guest.last_name}`
          : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (j) => <StatusBadge status={j.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage cleaning jobs"
        action={
          <Button onClick={() => router.push('/jobs/new')}>New Job</Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-sage-100 text-sage-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Employees</option>
          {(employees as User[]).map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        {(dateFilter || employeeFilter) && (
          <button
            onClick={() => { setDateFilter(''); setEmployeeFilter(''); }}
            className="text-sm text-sage-600 hover:text-sage-700"
          >
            Clear filters
          </button>
        )}
      </div>

      <DataTable
        data={jobs as CleaningJobWithRelations[]}
        columns={columns}
        keyExtractor={(j) => j.id}
        loading={isLoading}
        emptyMessage="No jobs found"
        onRowClick={(j) => router.push(`/jobs/${j.id}`)}
      />
    </div>
  );
}
