import { TaskRecord } from './airtable';

export function getWeeklyQAAccuracy(tasks: TaskRecord[]) {
  // Find the earliest QA date
  const dates = tasks
    .filter(task => task.fields['QA Date'] || task.fields['Last Modified'])
    .map(task => new Date(task.fields['QA Date'] || task.fields['Last Modified']));
  
  const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const now = new Date();
  const weeks: { start: Date; end: Date }[] = [];
  
  // Generate week ranges from earliest date to now
  let currentStart = new Date(earliestDate);
  currentStart.setHours(0, 0, 0, 0);
  
  while (currentStart < now) {
    const end = new Date(currentStart);
    end.setDate(end.getDate() + 7);
    weeks.push({ start: new Date(currentStart), end });
    currentStart.setDate(currentStart.getDate() + 7);
  }

  // Calculate perfect ratings for each week
  const weeklyData = weeks.map(({ start, end }) => {
    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.fields['QA Date'] || task.fields['Last Modified']);
      return taskDate >= start && 
             taskDate < end && 
             task.fields['[1] Attempt Status'] === 'Done' &&
             task.fields['Reviewer Rating'] !== undefined;
    });

    const total = weekTasks.length;
    const perfect = weekTasks.filter(task => 
      task.fields['Reviewer Rating'] === 'Approved - Perfect'
    ).length;

    const perfectRate = total > 0 ? (perfect / total) * 100 : 0;

    return {
      week: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      perfectRate: Number(perfectRate.toFixed(1)),
      total,
      perfect
    };
  });

  // Filter out weeks with no data
  return weeklyData.filter(week => week.total > 0);
}