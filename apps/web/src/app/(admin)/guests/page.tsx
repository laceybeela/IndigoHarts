'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGuests } from '@/hooks/use-guests';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { DataTable, type Column } from '@/components/ui/data-table';
import type { Guest } from '@indigo-harts/types';

export default function GuestsPage() {
  const router = useRouter();
  const { data: guests = [], isLoading } = useGuests();
  const [search, setSearch] = useState('');

  const filtered = guests.filter(
    (g: Guest) =>
      `${g.first_name} ${g.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(search.toLowerCase())) ||
      (g.phone && g.phone.includes(search))
  );

  const columns: Column<Guest>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      sortValue: (g) => `${g.last_name} ${g.first_name}`,
      render: (g) => (
        <span className="font-medium text-gray-900">
          {g.first_name} {g.last_name}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (g) => g.email || '—',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (g) => g.phone || '—',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Guests"
        description="Manage guest information"
        action={
          <Button onClick={() => router.push('/guests/new')}>Add Guest</Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search guests..."
        />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(g) => g.id}
        loading={isLoading}
        emptyMessage="No guests found"
        onRowClick={(g) => router.push(`/guests/${g.id}`)}
      />
    </div>
  );
}
