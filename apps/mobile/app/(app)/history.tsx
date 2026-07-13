import { useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useMyCompletedJobs } from '@indigo-harts/hooks';
import type { CleaningJobWithRelations } from '@indigo-harts/types';
import {
  Card,
  StatusBadge,
  LoadingSpinner,
  EmptyState,
} from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getChecklistProgress(job: CleaningJobWithRelations) {
  const checklists = job.job_checklists ?? [];
  let total = 0;
  let completed = 0;
  for (const cl of checklists) {
    for (const item of cl.items ?? []) {
      total++;
      if (item.is_completed) completed++;
    }
  }
  return { total, completed };
}

function JobCard({ job }: { job: CleaningJobWithRelations }) {
  const router = useRouter();
  const progress = getChecklistProgress(job);

  return (
    <Pressable onPress={() => router.push(`/(app)/jobs/${job.id}`)}>
      <Card className="mb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="font-poppins-semibold text-base text-gray-900">
              {job.property?.name ?? 'Unknown Property'}
            </Text>
            <Text className="mt-0.5 font-poppins-regular text-sm text-gray-500">
              {formatDate(job.scheduled_date)}
            </Text>
          </View>
          <StatusBadge status={job.status} />
        </View>

        {job.stay?.guest && (
          <Text className="mt-2 font-poppins-regular text-sm text-gray-600">
            Guest: {job.stay.guest.first_name} {job.stay.guest.last_name}
          </Text>
        )}

        {progress.total > 0 && (
          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text className="font-poppins-medium text-xs text-gray-500">
                {progress.completed}/{progress.total} tasks
              </Text>
              <Text className="font-poppins-medium text-xs text-gray-500">
                {Math.round((progress.completed / progress.total) * 100)}%
              </Text>
            </View>
            <View className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
              <View
                className="h-full rounded-full bg-sage-500"
                style={{
                  width: `${(progress.completed / progress.total) * 100}%`,
                }}
              />
            </View>
          </View>
        )}
      </Card>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const { data: jobs, isLoading, refetch, isRefetching } = useMyCompletedJobs();
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-warm-white">
      <View
        className="border-b border-gray-100 bg-white px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text className="font-poppins-bold text-xl text-gray-900">
          History
        </Text>
      </View>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          <EmptyState
            icon="✅"
            title="No Completed Jobs"
            message="Jobs you've finished will appear here."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#7D9132"
          />
        }
      />
    </View>
  );
}
