import { useMemo, useCallback } from 'react';
import { View, Text, SectionList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useMyJobs } from '@indigo-harts/hooks';
import type { CleaningJobWithRelations } from '@indigo-harts/types';
import {
  ScreenHeader,
  Card,
  StatusBadge,
  LoadingSpinner,
  EmptyState,
} from '@/components/ui';

function isToday(dateStr: string) {
  const today = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

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

export default function MyJobsScreen() {
  const { data: jobs, isLoading, refetch, isRefetching } = useMyJobs();
  const router = useRouter();

  const sections = useMemo(() => {
    if (!jobs?.length) return [];

    const todayJobs: CleaningJobWithRelations[] = [];
    const upcomingJobs: CleaningJobWithRelations[] = [];

    for (const job of jobs) {
      if (isToday(job.scheduled_date)) {
        todayJobs.push(job);
      } else {
        upcomingJobs.push(job);
      }
    }

    const result = [];
    if (todayJobs.length) result.push({ title: 'Today', data: todayJobs });
    if (upcomingJobs.length) result.push({ title: 'Upcoming', data: upcomingJobs });
    return result;
  }, [jobs]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-warm-white">
      <ScreenHeader
        title="My Jobs"
        rightAction={
          <Pressable
            onPress={() => router.push('/(app)/profile')}
            className="h-10 w-10 items-center justify-center rounded-full bg-sage-100"
          >
            <Text className="text-lg">👤</Text>
          </Pressable>
        }
      />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        renderSectionHeader={({ section }) => (
          <Text className="mb-2 mt-4 font-poppins-semibold text-sm uppercase tracking-wide text-gray-500">
            {section.title}
          </Text>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          <EmptyState
            icon="✨"
            title="No Jobs"
            message="You don't have any assigned jobs right now."
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
