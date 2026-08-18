import api from './api';

const normaliseDate = (value) => value || '';
const normaliseTime = (value) => value ? value.slice(0, 5) : '';

export function normaliseSubject(subject) {
  return {
    id: String(subject.id), name: subject.name, code: subject.code || 'COURSE',
    lecturerName: subject.lecturer_name || 'Not added yet', description: subject.description || '',
    color: subject.color || '#6C4DF6', taskCount: subject.task_count || 0, progress: subject.progress || 0,
  };
}

export function normaliseTask(task) {
  return {
    id: String(task.id), subjectId: task.subject_id ? String(task.subject_id) : '', subjectName: task.subject_name || '',
    title: task.title, description: task.description || '', taskType: task.task_type,
    priority: task.priority, status: task.status, displayStatus: task.display_status || task.status,
    dueDate: normaliseDate(task.due_date), dueTime: normaliseTime(task.due_time), reminder: task.reminder || '',
    notes: task.notes || '', attachmentName: task.attachment_name || '', attachmentUrl: task.attachment_url || '',
    isFavorite: task.is_favorite, createdAt: task.created_at, updatedAt: task.updated_at, completedAt: task.completed_at,
    subtasks: (task.subtasks || []).map((subtask) => ({ id: String(subtask.id), title: subtask.title, isCompleted: subtask.is_completed, position: subtask.position })),
  };
}

function taskPayload(task) {
  const form = new FormData();
  const fields = {
    title: task.title, subject_id: task.subjectId || '', task_type: task.taskType, description: task.description || '',
    due_date: task.dueDate, due_time: task.dueTime || '', priority: task.priority, reminder: task.reminder || '',
    notes: task.notes || '', status: task.status || 'todo', is_favorite: String(Boolean(task.isFavorite)),
    subtasks: JSON.stringify((task.subtasks || []).map((subtask, index) => ({ title: subtask.title, is_completed: subtask.isCompleted, position: subtask.position ?? index }))),
  };
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  if (task.attachmentFile) form.append('attachment', task.attachmentFile);
  return form;
}

export async function getPlannerSnapshot() {
  const [tasksResponse, subjectsResponse, dashboardResponse, analyticsResponse] = await Promise.all([
    api.get('/tasks/'), api.get('/subjects/'), api.get('/dashboard/'), api.get('/statistics/'),
  ]);
  return {
    tasks: tasksResponse.data.map(normaliseTask),
    subjects: subjectsResponse.data.map(normaliseSubject),
    schedule: dashboardResponse.data.today_schedule || [],
    stats: dashboardResponse.data.stats,
    analytics: analyticsResponse.data,
  };
}

export async function createTask(task) {
  const response = await api.post('/tasks/', taskPayload(task));
  return normaliseTask(response.data);
}

export async function saveTask(id, task) {
  const response = await api.put(`/tasks/${id}/`, taskPayload(task));
  return normaliseTask(response.data);
}

export async function removeTask(id) { await api.delete(`/tasks/${id}/`); }

export async function updateTaskStatus(id, status) {
  const response = await api.patch(`/tasks/${id}/status/`, { status });
  return normaliseTask(response.data);
}

export async function createSubject(subject) {
  const response = await api.post('/subjects/', {
    name: subject.name, code: subject.code, lecturer_name: subject.lecturerName,
    description: subject.description || '', color: subject.color,
  });
  return normaliseSubject(response.data);
}

export async function saveSubject(id, subject) {
  const response = await api.put(`/subjects/${id}/`, {
    name: subject.name, code: subject.code, lecturer_name: subject.lecturerName,
    description: subject.description || '', color: subject.color,
  });
  return normaliseSubject(response.data);
}

export async function removeSubject(id) { await api.delete(`/subjects/${id}/`); }
