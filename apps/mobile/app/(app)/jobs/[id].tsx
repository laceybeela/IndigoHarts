import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCleaningJob, useUpdateJobStatus } from '@indigo-harts/hooks';
import { JobStatus, type JobChecklistItem } from '@indigo-harts/types';
import {
  ScreenHeader,
  Card,
  Button,
  StatusBadge,
  ChecklistItem,
  LoadingSpinner,
} from '@/components/ui';
import { useToggleChecklistItem } from '@/hooks/use-toggle-checklist-item';

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View className="flex-row items-start justify-between py-1.5">
      <Text className="font-poppins-medium text-sm text-gray-500">{label}</Text>
      <Text className="ml-4 flex-1 text-right font-poppins-regular text-sm text-gray-800">
        {value}
      </Text>
    </View>
  );
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: job, isLoading } = useCleaningJob(id);
  const updateStatus = useUpdateJobStatus();
  const toggleItem = useToggleChecklistItem();

  if (isLoading || !job) return <LoadingSpinner />;

  const property = job.property;
  const checklists = (job.job_checklists ?? []) as Array<{ id: string; checklist_name: string; items: JobChecklistItem[] }>;
  const isInProgress = job.status === JobStatus.InProgress;

  const handleStatusAction = () => {
    if (job.status === JobStatus.Assigned) {
      updateStatus.mutate({ id: job.id, status: JobStatus.Accepted });
    } else if (job.status === JobStatus.Accepted) {
      updateStatus.mutate({ id: job.id, status: JobStatus.InProgress });
    } else if (job.status === JobStatus.InProgress) {
      Alert.alert(
        'Mark Complete',
        'Are you sure you want to mark this job as complete?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Complete',
            onPress: () =>
              updateStatus.mutate({ id: job.id, status: JobStatus.Completed }),
          },
        ]
      );
    }
  };

  const statusAction = {
    [JobStatus.Assigned]: { title: 'Accept Job', variant: 'primary' as const },
    [JobStatus.Accepted]: { title: 'Start Cleaning', variant: 'accent' as const },
    [JobStatus.InProgress]: { title: 'Mark Complete', variant: 'primary' as const },
    [JobStatus.Completed]: null,
  };

  const action = statusAction[job.status as JobStatus];

  return (
    <View className="flex-1 bg-warm-white">
      <ScreenHeader title="Job Details" showBack />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Status Action */}
        {action ? (
          <Button
            title={action.title}
            variant={action.variant}
            onPress={handleStatusAction}
            loading={updateStatus.isPending}
            fullWidth
          />
        ) : (
          <View className="items-center rounded-[16px] bg-green-50 px-4 py-4">
            <Text className="text-2xl">✅</Text>
            <Text className="mt-1 font-poppins-semibold text-base text-green-700">
              Job Completed
            </Text>
          </View>
        )}

        {/* Job Info */}
        <Card className="mt-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-poppins-semibold text-base text-gray-900">
              Job Info
            </Text>
            <StatusBadge status={job.status} />
          </View>
          <InfoRow label="Scheduled" value={formatDate(job.scheduled_date)} />
          {job.stay?.guest && (
            <InfoRow label="Guest" value={`${job.stay.guest.first_name} ${job.stay.guest.last_name}`} />
          )}
          <InfoRow label="Accepted" value={formatDateTime(job.accepted_at)} />
          <InfoRow label="Started" value={formatDateTime(job.started_at)} />
          <InfoRow label="Completed" value={formatDateTime(job.completed_at)} />
        </Card>

        {/* Property Info */}
        {property && (
          <Card className="mt-4">
            <Text className="mb-3 font-poppins-semibold text-base text-gray-900">
              Property
            </Text>
            <InfoRow label="Name" value={property.name} />
            <InfoRow label="Address" value={property.address} />
            <InfoRow
              label="Beds / Baths"
              value={`${property.bedrooms} bed · ${property.bathrooms} bath`}
            />
            <InfoRow label="Entry Code" value={property.entry_code} />
            <InfoRow label="Lockbox Code" value={property.lockbox_code} />
            {property.wifi_name && (
              <InfoRow
                label="WiFi"
                value={`${property.wifi_name} / ${property.wifi_password ?? ''}`}
              />
            )}
            {property.notes && (
              <View className="mt-2 rounded-[8px] bg-sage-50 p-3">
                <Text className="font-poppins-medium text-xs text-sage-700">
                  Notes
                </Text>
                <Text className="mt-1 font-poppins-regular text-sm text-gray-700">
                  {property.notes}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Checklists */}
        {checklists.map((checklist) => {
          const items = checklist.items ?? [];
          const completedCount = items.filter((i) => i.is_completed).length;

          return (
            <Card key={checklist.id} className="mt-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-poppins-semibold text-base text-gray-900">
                  {checklist.checklist_name}
                </Text>
                <Text className="font-poppins-medium text-xs text-gray-500">
                  {completedCount}/{items.length}
                </Text>
              </View>

              {/* Progress bar */}
              <View className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <View
                  className="h-full rounded-full bg-sage-500"
                  style={{
                    width: items.length
                      ? `${(completedCount / items.length) * 100}%`
                      : '0%',
                  }}
                />
              </View>

              {items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  taskName={item.task_name}
                  isCompleted={item.is_completed}
                  disabled={!isInProgress}
                  onToggle={() =>
                    toggleItem.mutate({
                      itemId: item.id,
                      completed: !item.is_completed,
                    })
                  }
                />
              ))}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
