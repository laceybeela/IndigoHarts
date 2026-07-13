'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProperty } from '@indigo-harts/hooks';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  usePropertyPhotos,
  useUploadPropertyPhoto,
  useDeletePropertyPhoto,
  usePropertyPhotoUrl,
} from '@/hooks/use-property-photos';
import { Home, Wifi, Key, ClipboardList, Camera, Trash2, X } from 'lucide-react';
import Link from 'next/link';

function PhotoGrid({ propertyId }: { propertyId: string }) {
  const { data: photos, isLoading } = usePropertyPhotos(propertyId);
  const uploadMutation = useUploadPropertyPhoto();
  const deleteMutation = useDeletePropertyPhoto();
  const getUrl = usePropertyPhotoUrl();
  const [showUpload, setShowUpload] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleUpload = (file: File, caption?: string) => {
    uploadMutation.mutate(
      { propertyId, file, fileName: file.name, caption },
      { onSuccess: () => setShowUpload(false) }
    );
  };

  const handleDelete = (id: string, storagePath: string) => {
    deleteMutation.mutate(
      { id, storagePath, propertyId },
      { onSuccess: () => setDeleteConfirm(null) }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Camera className="h-4 w-4" /> Photos
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-sage-600 border-t-transparent" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Camera className="h-4 w-4" /> Photos
        </h3>
        <Button
          variant={showUpload ? 'ghost' : 'secondary'}
          onClick={() => setShowUpload(!showUpload)}
          className="text-xs"
        >
          {showUpload ? (
            <>
              <X className="mr-1 h-3 w-3" /> Cancel
            </>
          ) : (
            'Upload Photo'
          )}
        </Button>
      </div>

      {showUpload && (
        <div className="mb-4">
          <ImageUpload onUpload={handleUpload} loading={uploadMutation.isPending} />
        </div>
      )}

      {!photos?.length && !showUpload ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No photos yet. Upload photos to showcase this property.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos?.map((photo) => (
            <div key={photo.id} className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={getUrl(photo.storage_path)}
                  alt={photo.caption || 'Property photo'}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition-colors group-hover:bg-black/20">
                  {deleteConfirm === photo.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(photo.id, photo.storage_path)}
                        disabled={deleteMutation.isPending}
                        className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? '...' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded bg-gray-600 px-2 py-1 text-xs font-medium text-white hover:bg-gray-700"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(photo.id)}
                      className="rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {photo.caption && (
                <p className="mt-1.5 truncate text-xs font-medium text-gray-600">
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

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
                {property.entry_code || '\u2014'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Lockbox Code</dt>
              <dd className="font-mono font-medium text-gray-900">
                {property.lockbox_code || '\u2014'}
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
              <dd className="font-medium text-gray-900">{property.wifi_name || '\u2014'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Password</dt>
              <dd className="font-mono font-medium text-gray-900">
                {property.wifi_password || '\u2014'}
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

        <PhotoGrid propertyId={id} />
      </div>
    </div>
  );
}
