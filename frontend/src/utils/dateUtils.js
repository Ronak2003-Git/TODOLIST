const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const weekdayFormatter = new Intl.DateTimeFormat('en-IN', { weekday: 'long' });

export function toDateKey(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function dateAtOffset(offset, time = '17:00') {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return { dueDate: toDateKey(date), dueTime: time };
}

export function dateTimeForTask(task) {
  if (!task?.dueDate) return null;
  return new Date(`${task.dueDate}T${task.dueTime || '23:59'}:00`);
}

export function isTaskOverdue(task, now = new Date()) {
  return task?.status !== 'completed' && Boolean(dateTimeForTask(task) && dateTimeForTask(task) < now);
}

export function resolvedStatus(task, now = new Date()) {
  if (task?.status === 'completed') return 'completed';
  if (isTaskOverdue(task, now)) return 'overdue';
  return task?.status || 'todo';
}

export function formatDate(dateValue) {
  if (!dateValue) return 'No due date';
  return dateFormatter.format(new Date(`${dateValue}T12:00:00`));
}

export function formatDateTime(task) {
  const date = formatDate(task?.dueDate);
  if (!task?.dueTime) return date;
  const time = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(
    new Date(`1970-01-01T${task.dueTime}:00`),
  );
  return `${date}, ${time}`;
}

export function shortDate(dateValue) {
  if (!dateValue) return '';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(
    new Date(`${dateValue}T12:00:00`),
  );
}

export function relativeDueLabel(task) {
  const taskDate = new Date(`${task.dueDate}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const difference = Math.round((taskDate - today) / 86_400_000);
  if (difference === 0) return 'Due today';
  if (difference === 1) return 'Due tomorrow';
  if (difference === -1) return 'Due yesterday';
  if (difference < 0) return `${Math.abs(difference)} days overdue`;
  return `Due in ${difference} days`;
}

export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return { date, key: toDateKey(date), isCurrentMonth: date.getMonth() === month };
  });
}

export function monthTitle(date) {
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date);
}

export function startOfWeek(date = new Date()) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

export function datesForWeek(date = new Date()) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => {
    const item = new Date(start);
    item.setDate(start.getDate() + index);
    return item;
  });
}
