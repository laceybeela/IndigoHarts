'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSmsTemplates, useSmsLog, useDeleteSmsTemplate } from '@/hooks/use-sms';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable, type Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import type { SmsTemplate, SmsLog } from '@indigo-harts/types';

type Tab = 'templates' | 'log';

export default function SmsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('templates');
  const { data: templates = [], isLoading: tplLoading } = useSmsTemplates();
  const { data: logs = [], isLoading: logLoading } = useSmsLog();
  const deleteTemplate = useDeleteSmsTemplate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTemplate.mutateAsync(deleteId);
      toast.success('Template deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const logColumns: Column<SmsLog & { guest?: { first_name: string; last_name: string } }>[] = [
    {
      key: 'recipient',
      header: 'Recipient',
      render: (l) => l.recipient_phone,
    },
    {
      key: 'guest',
      header: 'Guest',
      render: (l) =>
        l.guest ? `${l.guest.first_name} ${l.guest.last_name}` : '—',
    },
    {
      key: 'message',
      header: 'Message',
      render: (l) => (
        <span className="line-clamp-1 max-w-xs">{l.message_body}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (l) => <StatusBadge status={l.status} />,
    },
    {
      key: 'date',
      header: 'Sent',
      sortable: true,
      sortValue: (l) => l.created_at,
      render: (l) => new Date(l.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <PageHeader
        title="SMS Center"
        description="Manage templates and send messages"
        action={
          <div className="flex gap-2">
            <Button onClick={() => router.push('/sms/send')}>Send SMS</Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/sms/templates/new')}
            >
              New Template
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex gap-2">
        {(['templates', 'log'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-sage-100 text-sage-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {t === 'templates' ? 'Templates' : 'Message Log'}
          </button>
        ))}
      </div>

      {tab === 'templates' && (
        <div className="space-y-3">
          {tplLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (templates as SmsTemplate[]).length === 0 ? (
            <p className="text-sm text-gray-500">No templates yet.</p>
          ) : (
            (templates as SmsTemplate[]).map((t) => (
              <Card key={t.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t.template_name}
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                      {t.message_body}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/sms/templates/${t.id}/edit`)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'log' && (
        <DataTable
          data={logs as (SmsLog & { guest?: { first_name: string; last_name: string } })[]}
          columns={logColumns}
          keyExtractor={(l) => l.id}
          loading={logLoading}
          emptyMessage="No messages sent yet"
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Template"
        message="Are you sure you want to delete this SMS template?"
        confirmLabel="Delete"
        loading={deleteTemplate.isPending}
      />
    </div>
  );
}
