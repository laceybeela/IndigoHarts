'use client';

import { useRouter } from 'next/navigation';
import { useCleaningJobs } from '@indigo-harts/hooks';
import { useProperties } from '@indigo-harts/hooks';
import { useStays } from '@/hooks/use-stays';
import { useEmployees } from '@/hooks/use-employees';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Briefcase, Home, CalendarCheck, UserCog } from 'lucide-react';
import type { CleaningJobWithRelations, StayWithRelations, Property, User } from '@indigo-harts/types';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const { data: allJobs = [], isLoading: jobsLoading } = useCleaningJobs();
  const { data: properties = [], isLoading: propsLoading } = useProperties();
  const { data: stays = [], isLoading: staysLoading } = useStays();
  const { data: employees = [], isLoading: empsLoading } = useEmployees();

  const isLoading = jobsLoading || propsLoading || staysLoading || empsLoading;

  if (isLoading) return <LoadingSpinner className="min-h-[60vh]" />;

  const jobs = allJobs as CleaningJobWithRelations[];
  const stayList = stays as StayWithRelations[];
  const empList = (employees as User[]).filter((e) => e.role === 'employee');

  const todaysJobs = jobs.filter((j) => j.scheduled_date === today);
  const upcomingStays = stayList
    .filter((s) => s.status === 'upcoming' && s.check_in_date >= today)
    .slice(0, 5);
  const recentJobs = jobs.slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your operations" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Today's Jobs"
          value={todaysJobs.length}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          icon={CalendarCheck}
          label="Upcoming Stays"
          value={stayList.filter((s) => s.status === 'upcoming').length}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={Home}
          label="Properties"
          value={(properties as Property[]).length}
          color="bg-sage-100 text-sage-700"
        />
        <StatCard
          icon={UserCog}
          label="Active Employees"
          value={empList.filter((e) => e.is_active).length}
          color="bg-floral-100 text-floral-700"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Recent Jobs
          </h3>
          {recentJobs.length === 0 ? (
            <p className="text-sm text-gray-500">No jobs yet.</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex cursor-pointer items-center justify-between rounded border border-gray-200 p-3 hover:bg-gray-50"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.property?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {job.scheduled_date} — {job.assigned_employee?.name || 'Unassigned'}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Upcoming Stays
          </h3>
          {upcomingStays.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming stays.</p>
          ) : (
            <div className="space-y-3">
              {upcomingStays.map((stay) => (
                <div
                  key={stay.id}
                  className="flex cursor-pointer items-center justify-between rounded border border-gray-200 p-3 hover:bg-gray-50"
                  onClick={() => router.push(`/stays/${stay.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {stay.guest
                        ? `${stay.guest.first_name} ${stay.guest.last_name}`
                        : 'Unknown Guest'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stay.property?.name} — {stay.check_in_date}
                    </p>
                  </div>
                  <StatusBadge status={stay.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
