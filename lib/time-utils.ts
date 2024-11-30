import { TaskRecord } from './airtable';

export function getWeeklyCompletionTimes(tasks: TaskRecord[], numberOfWeeks: number = 12) {
  const now = new Date();
  const weeks: { start: Date; end: Date }[] = [];
  
  // Generate week ranges
  for (let i = 0; i < numberOfWeeks; i++) {
    const end = new Date(now);
    end.setDate(now.getDate() - (i * 7));
    const start = new Date(end);
    start.setDate(end.getDate() - 7);
    weeks.unshift({ start, end });
  }

  // Calculate average completion time for each week
  const weeklyData = weeks.map(({ start, end }) => {
    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.fields['Last Modified']);
      return taskDate >= start && 
             taskDate < end && 
             task.fields['[1] Attempt Status'] === 'Done' &&
             typeof task.fields['Handling Time in Minutes'] === 'number';
    });

    const avgTime = weekTasks.length > 0
      ? weekTasks.reduce((sum, task) => 
          sum + (typeof task.fields['Handling Time in Minutes'] === 'number' 
            ? task.fields['Handling Time in Minutes'] 
            : 0
          ), 0) / weekTasks.length
      : 0;

    return {
      week: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgTime: Number(avgTime.toFixed(1)),
      taskCount: weekTasks.length
    };
  });

  return weeklyData;
}