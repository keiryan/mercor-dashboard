import { TaskRecord } from './airtable';

export function formatTrendValue(value: number): string {
  return Math.abs(value).toFixed(1);
}

export function getTodaysTasks(tasks: TaskRecord[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.fields['Last Modified']);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime() && 
           task.fields['[1] Attempt Status'] === 'Done';
  });

  const yesterdayTasks = tasks.filter(task => {
    const taskDate = new Date(task.fields['Last Modified']);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === yesterday.getTime() && 
           task.fields['[1] Attempt Status'] === 'Done';
  });

  const trend = yesterdayTasks.length > 0
    ? ((todayTasks.length - yesterdayTasks.length) / yesterdayTasks.length) * 100
    : 0;

  return {
    count: todayTasks.length,
    trend,
  };
}

export function getTopAnnotator(tasks: TaskRecord[]) {
  const annotatorStats = new Map();

  tasks.forEach(task => {
    if (
      task.fields['[1] Attempt Status'] === 'Done' &&
      task.fields['[1] Assigned To']?.name &&
      typeof task.fields['Handling Time in Minutes'] === 'number'
    ) {
      const name = task.fields['[1] Assigned To'].name;
      const stats = annotatorStats.get(name) || { count: 0, totalTime: 0 };
      stats.count++;
      stats.totalTime += task.fields['Handling Time in Minutes'];
      annotatorStats.set(name, stats);
    }
  });

  let topAnnotator = {
    name: 'No data',
    count: 0,
    avgHandlingTime: 0,
    trend: 0,
  };

  if (annotatorStats.size > 0) {
    const sortedAnnotators = Array.from(annotatorStats.entries())
      .map(([name, stats]: [string, any]) => ({
        name,
        count: stats.count,
        avgHandlingTime: stats.totalTime / stats.count,
      }))
      .sort((a, b) => b.count - a.count);

    const top = sortedAnnotators[0];

    const last10Tasks = tasks
      .filter(
        t =>
          t.fields['[1] Assigned To']?.name === top.name &&
          t.fields['[1] Attempt Status'] === 'Done' &&
          typeof t.fields['Handling Time in Minutes'] === 'number'
      )
      .slice(-10);

    const avgTime = last10Tasks.reduce((sum, t) => 
      sum + (typeof t.fields['Handling Time in Minutes'] === 'number' ? t.fields['Handling Time in Minutes'] : 0), 0
    ) / (last10Tasks.length || 1);

    topAnnotator = {
      name: top.name,
      count: top.count,
      avgHandlingTime: top.avgHandlingTime,
      trend: ((avgTime - top.avgHandlingTime) / top.avgHandlingTime) * 100,
    };
  }

  return topAnnotator;
}

export function getWorstAnnotator(tasks: TaskRecord[]) {
  const annotatorStats = new Map();

  tasks.forEach(task => {
    if (
      task.fields['[1] Attempt Status'] === 'Done' &&
      task.fields['[1] Assigned To']?.name &&
      typeof task.fields['Handling Time in Minutes'] === 'number'
    ) {
      const name = task.fields['[1] Assigned To'].name;
      const stats = annotatorStats.get(name) || { count: 0, totalTime: 0 };
      stats.count++;
      stats.totalTime += task.fields['Handling Time in Minutes'];
      annotatorStats.set(name, stats);
    }
  });

  let worstAnnotator = {
    name: 'No data',
    count: 0,
    avgHandlingTime: 0,
    trend: 0,
  };

  if (annotatorStats.size > 0) {
    const sortedAnnotators = Array.from(annotatorStats.entries())
      .map(([name, stats]: [string, any]) => ({
        name,
        count: stats.count,
        avgHandlingTime: stats.totalTime / stats.count,
      }))
      .sort((a, b) => a.count - b.count);

    const worst = sortedAnnotators[0];

    const last10Tasks = tasks
      .filter(
        t =>
          t.fields['[1] Assigned To']?.name === worst.name &&
          t.fields['[1] Attempt Status'] === 'Done' &&
          typeof t.fields['Handling Time in Minutes'] === 'number'
      )
      .slice(-10);

    const avgTime = last10Tasks.reduce((sum, t) => 
      sum + (typeof t.fields['Handling Time in Minutes'] === 'number' ? t.fields['Handling Time in Minutes'] : 0), 0
    ) / (last10Tasks.length || 1);

    worstAnnotator = {
      name: worst.name,
      count: worst.count,
      avgHandlingTime: worst.avgHandlingTime,
      trend: ((avgTime - worst.avgHandlingTime) / worst.avgHandlingTime) * 100,
    };
  }

  return worstAnnotator;
}

export function getThisWeeksTasks(tasks: TaskRecord[]) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const thisWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.fields['Last Modified']);
    return taskDate >= startOfWeek && task.fields['[1] Attempt Status'] === 'Done';
  });

  const lastWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.fields['Last Modified']);
    return taskDate >= startOfLastWeek && taskDate < startOfWeek && 
           task.fields['[1] Attempt Status'] === 'Done';
  });

  const trend = lastWeekTasks.length > 0
    ? ((thisWeekTasks.length - lastWeekTasks.length) / lastWeekTasks.length) * 100
    : 0;

  return {
    count: thisWeekTasks.length,
    trend,
  };
}

export function getTaskProgress(tasks: TaskRecord[]) {
  const total = tasks.length;
  const claimed = tasks.filter(task => 
    task.fields['[1] Assigned To']?.name || 
    task.fields['[1] Attempt Status'] === 'Done'
  ).length;
  const completed = tasks.filter(task => 
    task.fields['[1] Attempt Status'] === 'Done'
  ).length;
  
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.fields['Last Modified']).getTime() - new Date(a.fields['Last Modified']).getTime()
  );

  const recent50 = sortedTasks.slice(0, 50);
  const previous50 = sortedTasks.slice(50, 100);

  const recentCompletionRate = recent50.length > 0
    ? (recent50.filter(t => t.fields['[1] Attempt Status'] === 'Done').length / recent50.length) * 100
    : 0;

  const previousCompletionRate = previous50.length > 0
    ? (previous50.filter(t => t.fields['[1] Attempt Status'] === 'Done').length / previous50.length) * 100
    : 0;

  const trend = previousCompletionRate > 0
    ? ((recentCompletionRate - previousCompletionRate) / previousCompletionRate) * 100
    : 0;

  return {
    total,
    claimed,
    completed,
    trend,
  };
}

export function getQAAccuracy(tasks: TaskRecord[]) {
  const completedTasks = tasks.filter(task => 
    task.fields['[1] Attempt Status'] === 'Done' && 
    task.fields['[1] Revewer #1 Outcome'] !== 'Todo'
  );

  const total = completedTasks.length;
  const passed = completedTasks.filter(task => 
    task.fields['[1] Revewer #1 Outcome'] === 'Passed'
  ).length;

  const accuracy = total > 0 ? (passed / total) * 100 : 0;

  const sortedTasks = [...completedTasks].sort((a, b) => 
    new Date(b.fields['Last Modified']).getTime() - new Date(a.fields['Last Modified']).getTime()
  );

  const recent50 = sortedTasks.slice(0, 50);
  const previous50 = sortedTasks.slice(50, 100);

  const recentAccuracy = recent50.length > 0
    ? (recent50.filter(t => t.fields['[1] Revewer #1 Outcome'] === 'Passed').length / recent50.length) * 100
    : 0;

  const previousAccuracy = previous50.length > 0
    ? (previous50.filter(t => t.fields['[1] Revewer #1 Outcome'] === 'Passed').length / previous50.length) * 100
    : 0;

  const trend = previousAccuracy > 0
    ? ((recentAccuracy - previousAccuracy) / previousAccuracy) * 100
    : 0;

  return {
    total,
    passed,
    accuracy,
    trend,
  };
}

export function getTotalTasks(tasks: TaskRecord[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => 
    task.fields['[1] Attempt Status'] === 'Done'
  ).length;
  const inProgress = tasks.filter(task => 
    task.fields['[1] Assigned To']?.name && 
    task.fields['[1] Attempt Status'] !== 'Done'
  ).length;

  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.fields['Last Modified']).getTime() - new Date(a.fields['Last Modified']).getTime()
  );

  const recent100 = sortedTasks.slice(0, 100);
  const previous100 = sortedTasks.slice(100, 200);

  const recentCompletionRate = recent100.length > 0
    ? (recent100.filter(t => t.fields['[1] Attempt Status'] === 'Done').length / recent100.length) * 100
    : 0;

  const previousCompletionRate = previous100.length > 0
    ? (previous100.filter(t => t.fields['[1] Attempt Status'] === 'Done').length / previous100.length) * 100
    : 0;

  const trend = previousCompletionRate > 0
    ? ((recentCompletionRate - previousCompletionRate) / previousCompletionRate) * 100
    : 0;

  return {
    total,
    completed,
    inProgress,
    trend
  };
}