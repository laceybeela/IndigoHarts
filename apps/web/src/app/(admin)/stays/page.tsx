'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStays } from '@/hooks/use-stays';
import { useProperties } from '@indigo-harts/hooks';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { DataTable, type Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { StayStatus } from '@indigo-harts/types';
import type { StayWithRelations, Property } from '@indigo-harts/types';

export default function StaysPage() {
  const router = useRouter();
  const { data: stays = [], isLoading } = useStays();
  const { data: properties = [] } = useProperties();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');

  const filtered = (stays as StayWithRelations[]).filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (propertyFilter && s.property_id !== propertyFilter) return false;
    if (search) {
      const guestName = s.guest
        ? `${s.guest.first_name} ${s.guest.last_name}`.toLowerCase()
        : '';
      const propName = s.property?.name?.toLowerCase() || '';
      const q = search.toLowerCase();
      if (!guestName.includes(q) && !propName.includes(q)) return false;
    }
    return true;
  });

  const columns: Column<StayWithRelations>[] = [
    {
      key: 'guest',
      header: 'Guest',
      render: (s) => (
        <span className="font-medium text-gray-900">
          {s.guest ? `${s.guest.first_name} ${s.guest.last_name}` : '—'}
        </span>
      ),
    },
    {
      key: 'property',
      header: 'Property',
      render: (s) => s.property?.name || '—',
    },
    {
      key: 'checkin',
      header: 'Check In',
      sortable: true,
      sortValue: (s) => s.check_in_date,
      render: (s) => s.check_in_date,
    },
    {
      key: 'checkout',
      header: 'Check Out',
      render: (s) => s.check_out_date,
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <StatusBadge status={s.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stays"
        description="Manage guest stays and bookings"
        action={
          <Button onClick={() => router.push('/stays/new')}>Add Stay</Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search guest or property..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {Object.values(StayStatus).map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Properties</option>
          {(properties as Property[]).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(s) => s.id}
        loading={isLoading}
        emptyMessage="No stays found"
        onRowClick={(s) => router.push(`/stays/${s.id}`)}
      />
    </div>
  );
}
