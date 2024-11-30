import { DashboardHeader } from '@/components/dashboard/header';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { TaskChart } from '@/components/dashboard/task-chart';
import { TodayTaskChart } from '@/components/dashboard/today-task-chart';
import { QAStatusChart } from '@/components/dashboard/qa-status-chart';
import { CompletionTimeChart } from '@/components/dashboard/completion-time-chart';
import { QAReviewersChart } from '@/components/dashboard/qa-reviewers-chart';
import { WeeklyQAAccuracyChart } from '@/components/dashboard/weekly-qa-accuracy-chart';
import { fetchTasks } from '@/lib/airtable';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SkeletonCard } from '@/components/ui/skeleton-card';

const AIRTABLE_CONFIG = {
  apiKey: 'pataz71uLVZBKv8mr.f5b4c8c3cd3e010407ffefd1b653907522ae809091f17f8f2b15a52c840cb2d6',
  baseId: 'appYzMbPcSRiFirse',
  tableId: 'Prompts',
};

export default async function Home() {
  const tasks = await fetchTasks(AIRTABLE_CONFIG);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <StatsGrid tasks={tasks} />
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Suspense fallback={<SkeletonCard />}>
              <TodayTaskChart tasks={tasks} />
            </Suspense>
            <Suspense fallback={<SkeletonCard />}>
              <TaskChart tasks={tasks} />
            </Suspense>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Suspense fallback={<SkeletonCard />}>
              <QAStatusChart tasks={tasks} />
            </Suspense>
            <Suspense fallback={<SkeletonCard />}>
              <CompletionTimeChart tasks={tasks} />
            </Suspense>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Suspense fallback={<SkeletonCard />}>
              <WeeklyQAAccuracyChart tasks={tasks} />
            </Suspense>
            <Suspense fallback={<SkeletonCard />}>
              <QAReviewersChart tasks={tasks} />
            </Suspense>
          </div>
        </Suspense>
      </main>
    </div>
  );
}