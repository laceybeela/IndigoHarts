import { useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMyAvailability, useUpsertMyAvailability } from '@/hooks/use-availability';
import { Card, LoadingSpinner } from '@/components/ui';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDates(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) dates.push(d);

  return dates;
}

function formatDate(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function getMonthLabel(year: number, month: number) {
  return new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default function AvailabilityScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const startDate = formatDate(year, month, 1);
  const endDate = formatDate(year, month, new Date(year, month + 1, 0).getDate());

  const { data: availability, isLoading, refetch, isRefetching } = useMyAvailability(startDate, endDate);
  const upsertMutation = useUpsertMyAvailability();

  const availabilityMap = useMemo(() => {
    const map: Record<string, { available: boolean; id: string }> = {};
    if (availability) {
      for (const entry of availability) {
        map[entry.date] = { available: entry.available, id: entry.id };
      }
    }
    return map;
  }, [availability]);

  const dates = useMemo(() => getMonthDates(year, month), [year, month]);

  const goToPrev = useCallback(() => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  }, [month]);

  const goToNext = useCallback(() => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  }, [month]);

  const toggleDay = useCallback((day: number) => {
    const dateStr = formatDate(year, month, day);
    const existing = availabilityMap[dateStr];
    const newAvailable = existing ? !existing.available : true;

    upsertMutation.mutate({ date: dateStr, available: newAvailable });
  }, [year, month, availabilityMap, upsertMutation]);

  const isPast = useCallback((day: number) => {
    const date = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  }, [year, month, today]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-warm-white">
      <View
        className="border-b border-gray-100 bg-white px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text className="font-poppins-bold text-xl text-gray-900">
          Availability
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#7D9132"
          />
        }
      >
        {/* Month Navigation */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={goToPrev}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            >
              <Text className="text-xl text-sage-700">{'<'}</Text>
            </Pressable>
            <Text className="font-poppins-semibold text-lg text-gray-900">
              {getMonthLabel(year, month)}
            </Text>
            <Pressable
              onPress={goToNext}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            >
              <Text className="text-xl text-sage-700">{'>'}</Text>
            </Pressable>
          </View>
        </Card>

        {/* Calendar Grid */}
        <Card>
          {/* Day headers */}
          <View className="mb-2 flex-row">
            {DAYS.map((day) => (
              <View key={day} className="flex-1 items-center">
                <Text className="font-poppins-medium text-xs text-gray-500">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Date grid */}
          <View className="flex-row flex-wrap">
            {dates.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={{ width: '14.28%' }} className="aspect-square p-0.5" />;
              }

              const dateStr = formatDate(year, month, day);
              const entry = availabilityMap[dateStr];
              const isAvailable = entry?.available === true;
              const isUnavailable = entry?.available === false;
              const past = isPast(day);
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <View key={day} style={{ width: '14.28%' }} className="aspect-square p-0.5">
                  <Pressable
                    onPress={() => !past && toggleDay(day)}
                    disabled={past || upsertMutation.isPending}
                    className={`flex-1 items-center justify-center rounded-[10px] ${
                      isAvailable
                        ? 'bg-sage-200 border-2 border-sage-500'
                        : isUnavailable
                        ? 'bg-red-50 border-2 border-red-300'
                        : 'bg-gray-50'
                    } ${past ? 'opacity-40' : ''} ${isToday ? 'border-2 border-sage-700' : ''}`}
                  >
                    <Text
                      className={`font-poppins-medium text-sm ${
                        isAvailable
                          ? 'text-sage-800'
                          : isUnavailable
                          ? 'text-red-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </Text>
                    {isAvailable && (
                      <Text className="text-[10px] text-sage-600">avail</Text>
                    )}
                    {isUnavailable && (
                      <Text className="text-[10px] text-red-400">off</Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Legend */}
        <View className="mt-4 flex-row justify-center gap-6">
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-4 rounded border-2 border-sage-500 bg-sage-200" />
            <Text className="font-poppins-regular text-xs text-gray-600">Available</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-4 rounded border-2 border-red-300 bg-red-50" />
            <Text className="font-poppins-regular text-xs text-gray-600">Unavailable</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-4 rounded bg-gray-50" />
            <Text className="font-poppins-regular text-xs text-gray-600">Not Set</Text>
          </View>
        </View>

        <Text className="mt-4 text-center font-poppins-regular text-xs text-gray-400">
          Tap a day to toggle your availability
        </Text>
      </ScrollView>
    </View>
  );
}
