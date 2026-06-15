'use client';

import { useState, useMemo } from 'react';
import { useEmployees } from '@/hooks/use-employees';
import { useUpsertAvailability } from '@/hooks/use-availability';
import { useAuth } from '@indigo-harts/hooks';
import { getAvailability } from '@indigo-harts/services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { User, EmployeeAvailability } from '@indigo-harts/types';

function getWeekDates(offset: number) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1 + offset * 7);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AvailabilityPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const dates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const { client } = useAuth();
  const { data: employees = [], isLoading: empsLoading } = useEmployees();
  const upsert = useUpsertAvailability();
  const queryClient = useQueryClient();

  const empList = (employees as User[]).filter((e) => e.role === 'employee' && e.is_active);

  const { data: availData = [], isLoading: availLoading } = useQuery({
    queryKey: ['availability', 'week', dates[0], dates[6]],
    queryFn: async () => {
      const results: EmployeeAvailability[] = [];
      for (const emp of empList) {
        const data = await getAvailability(client, emp.id, dates[0], dates[6]);
        results.push(...data);
      }
      return results;
    },
    enabled: empList.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  const isLoading = empsLoading || availLoading;

  const getCell = (employeeId: string, date: string) => {
    return (availData as EmployeeAvailability[]).find(
      (a) => a.employee_id === employeeId && a.date === date
    );
  };

  const handleToggle = async (employeeId: string, date: string) => {
    const existing = getCell(employeeId, date);
    const available = existing ? !existing.available : true;
    try {
      await upsert.mutateAsync({
        employeeId,
        data: { date, available, notes: existing?.notes || null },
      });
      queryClient.invalidateQueries({ queryKey: ['availability', 'week'] });
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const weekLabel = `${dates[0]} — ${dates[6]}`;

  return (
    <div>
      <PageHeader
        title="Availability"
        description="Manage employee weekly availability"
      />

      <div className="mb-4 flex items-center gap-4">
        <Button variant="ghost" onClick={() => setWeekOffset((o) => o - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-gray-700">{weekLabel}</span>
        <Button variant="ghost" onClick={() => setWeekOffset((o) => o + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        {weekOffset !== 0 && (
          <button
            onClick={() => setWeekOffset(0)}
            className="text-sm text-sage-600 hover:text-sage-700"
          >
            Today
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : empList.length === 0 ? (
        <p className="text-sm text-gray-500">No active employees.</p>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Employee
                </th>
                {dates.map((d, i) => (
                  <th
                    key={d}
                    className="px-3 py-3 text-center text-xs font-medium uppercase text-gray-500"
                  >
                    <div>{dayLabels[i]}</div>
                    <div className="font-normal text-gray-400">
                      {d.slice(5)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {empList.map((emp) => (
                <tr key={emp.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {emp.name}
                  </td>
                  {dates.map((date) => {
                    const cell = getCell(emp.id, date);
                    const available = cell?.available ?? false;
                    return (
                      <td key={date} className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleToggle(emp.id, date)}
                          className={`h-8 w-8 rounded-full border-2 transition-colors ${
                            available
                              ? 'border-sage-500 bg-sage-100 text-sage-700'
                              : 'border-gray-200 bg-gray-50 text-gray-400'
                          }`}
                          title={available ? 'Available' : 'Unavailable'}
                        >
                          {available ? 'Y' : ''}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
