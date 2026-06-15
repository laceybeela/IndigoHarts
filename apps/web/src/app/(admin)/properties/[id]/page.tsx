'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProperty } from '@indigo-harts/hooks';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Home, Wifi, Key, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;
  if (!property) return <p className="text-gray-500">Property not found.</p>;

  return (
    <div>
      <PageHeader
        title={property.name}
        description={property.address}
        action={
          <div className="flex gap-2">
            <Link href={`/properties/${id}/checklists`}>
              <Button variant="secondary">
                <ClipboardList className="mr-2 h-4 w-4" />
                Checklists
              </Button>
            </Link>
            <Button onClick={() => router.push(`/properties/${id}/edit`)}>
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Home className="h-4 w-4" /> Property Details
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Bedrooms</dt>
              <dd className="font-medium text-gray-900">{property.bedrooms}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Bathrooms</dt>
              <dd className="font-medium text-gray-900">{property.bathrooms}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    property.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {property.is_active ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Key className="h-4 w-4" /> Access Information
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Entry Code</dt>
              <dd className="font-mono font-medium text-gray-900">
                {property.entry_code || '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Lockbox Code</dt>
              <dd className="font-mono font-medium text-gray-900">
                {property.lockbox_code || '—'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Wifi className="h-4 w-4" /> WiFi
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Network</dt>
              <dd className="font-medium text-gray-900">{property.wifi_name || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Password</dt>
              <dd className="font-mono font-medium text-gray-900">
                {property.wifi_password || '—'}
              </dd>
            </div>
          </dl>
        </Card>

        {property.notes && (
          <Card>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Notes</h3>
            <p className="whitespace-pre-wrap text-sm text-gray-600">{property.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
