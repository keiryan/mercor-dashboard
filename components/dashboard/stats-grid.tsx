'use client';

import { StatsCard } from '../stats-card';
import { TaskRecord } from '@/lib/airtable';
import { 
  getTodaysTasks, 
  getTopAnnotator,
  getWorstAnnotator,
  getThisWeeksTasks,
  getTaskProgress,
  getQAAccuracy,
  getTotalTasks
} from '@/lib/stats-utils';
import { 
  CheckCircle, 
  Trophy, 
  Calendar,
  Target,
  ListChecks
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';

interface StatsGridProps {
  tasks: TaskRecord[];
}

export function StatsGrid({ tasks }: StatsGridProps) {
  const todayStats = getTodaysTasks(tasks);
  const topAnnotator = getTopAnnotator(tasks);
  const worstAnnotator = getWorstAnnotator(tasks);
  const weekStats = getThisWeeksTasks(tasks);
  const progressStats = getTaskProgress(tasks);
  const accuracyStats = getQAAccuracy(tasks);
  const totalStats = getTotalTasks(tasks);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <AnimatedCard index={0}>
        <StatsCard
          title="Today's Tasks"
          value={todayStats.count}
          description="Tasks completed today"
          trend={todayStats.trend}
          trendLabel="vs yesterday"
          icon={CheckCircle}
        />
      </AnimatedCard>

      <AnimatedCard index={1}>
        <StatsCard
          title="Top Annotator"
          value={topAnnotator.name}
          description={`${topAnnotator.count} tasks completed with a ${topAnnotator.avgHandlingTime.toFixed(1)} min avg handling time`}
          trend={topAnnotator.trend}
          trendLabel="Handling time trend"
          icon={Trophy}
          flippable={true}
          backSide={{
            title: "Worst Annotator",
            value: worstAnnotator.name,
            description: `${worstAnnotator.count} tasks completed with a ${worstAnnotator.avgHandlingTime.toFixed(1)} min avg handling time`,
            trend: worstAnnotator.trend,
            trendLabel: "Handling time trend",
          }}
        />
      </AnimatedCard>

      <AnimatedCard index={2}>
        <StatsCard
          title="This Week's Tasks"
          value={weekStats.count}
          description="Tasks completed this week"
          trend={weekStats.trend}
          trendLabel="vs last week"
          icon={Calendar}
        />
      </AnimatedCard>

      <AnimatedCard index={3}>
        <StatsCard
          title="QA Accuracy"
          value={`${accuracyStats.accuracy.toFixed(1)}%`}
          description={`${accuracyStats.passed} of ${accuracyStats.total} tasks passed QA`}
          trend={accuracyStats.trend}
          trendLabel="accuracy trend"
          icon={Target}
        />
      </AnimatedCard>

      <AnimatedCard index={4}>
        <StatsCard
          title="Total Progress"
          value={`${((progressStats.completed / progressStats.total) * 100).toFixed(1)}%`}
          description={`${progressStats.completed} completed, ${totalStats.inProgress} in progress of ${totalStats.total} total tasks`}
          trend={totalStats.trend}
          trendLabel="completion trend"
          icon={ListChecks}
        />
      </AnimatedCard>
    </div>
  );
}