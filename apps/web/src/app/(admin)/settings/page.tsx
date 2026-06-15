'use client';

import { useAuth } from '@indigo-harts/hooks';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Settings" description="Account and preferences" />

      <Card className="max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={user?.name || 'User'} className="h-16 w-16 text-lg" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="mb-4 text-sm font-semibold text-gray-900">
            Change Password
          </h4>
          <p className="text-sm text-gray-500">
            Use the &ldquo;Forgot Password&rdquo; flow from the login page to reset your password via email.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="mb-2 text-sm font-semibold text-gray-900">
            Account Details
          </h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium text-gray-900">{user?.phone || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Member since</dt>
              <dd className="font-medium text-gray-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  );
}
