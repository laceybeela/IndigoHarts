'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProperties } from '@indigo-harts/hooks';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { DataTable, type Column } from '@/components/ui/data-table';
import type { Property } from '@indigo-harts/types';

export default function PropertiesPage() {
  const router = useRouter();
  const { data: properties = [], isLoading } = useProperties(true);
  const [search, setSearch] = useState('');

  const filtered = properties.filter(
    (p: Property) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Property>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      sortValue: (p) => p.name,
      render: (p) => <span className="font-medium text-gray-900">{p.name}</span>,
    },
    {
      key: 'address',
      header: 'Address',
      render: (p) => p.address,
    },
    {
      key: 'bedrooms',
      header: 'Beds',
      sortable: true,
      sortValue: (p) => p.bedrooms,
      render: (p) => p.bedrooms,
    },
    {
      key: 'bathrooms',
      header: 'Baths',
      sortable: true,
      sortValue: (p) => p.bathrooms,
      render: (p) => p.bathrooms,
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            p.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {p.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Manage your rental properties"
        action={
          <Button onClick={() => router.push('/properties/new')}>
            Add Property
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search properties..."
        />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(p) => p.id}
        loading={isLoading}
        emptyMessage="No properties found"
        onRowClick={(p) => router.push(`/properties/${p.id}`)}
      />
    </div>
  );
}
