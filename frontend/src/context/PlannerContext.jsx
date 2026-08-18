import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  createSubject, createTask, getPlannerSnapshot, removeSubject, removeTask, saveSubject, saveTask, updateTaskStatus,
} from '../services/plannerService';
import { getApiError } from '../services/api';

const PlannerContext = createContext(null);
const emptyPlanner = { tasks: [], subjects: [], schedule: [], stats: { total: 0, completed: 0, pending: 0, overdue: 0, completionRate: 0 }, analytics: { priority: [], weekly: [], subjects: [] } };

function normaliseStats(stats = {}) {
  return {
    total: stats.total || 0, completed: stats.completed || 0, pending: stats.pending || 0,
    overdue: stats.overdue || 0, completionRate: stats.completion_rate || stats.completionRate || 0,
  };
}

export function PlannerProvider({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [planner, setPlanner] = useState(emptyPlanner);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    window.setTimeout(() => setToast((current) => (current?.id === id ? null : current)), 3500);
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) { setPlanner(emptyPlanner); return; }
    const snapshot = await getPlannerSnapshot();
    setPlanner({
      tasks: snapshot.tasks,
      subjects: snapshot.subjects,
      schedule: snapshot.schedule,
      stats: normaliseStats(snapshot.stats),
      analytics: {
        priority: snapshot.analytics.priority || [], weekly: snapshot.analytics.weekly || [],
        subjects: snapshot.analytics.subjects || [],
      },
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setPlanner(emptyPlanner); setIsLoading(false); return; }
    setIsLoading(true);
    refresh().catch((error) => showToast(getApiError(error, 'Unable to load your planner.'), 'error')).finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, refresh, showToast]);

  const runMutation = useCallback(async (action, successMessage, type = 'success') => {
    try {
      const result = await action();
      await refresh();
      if (successMessage) showToast(successMessage, type);
      return result;
    } catch (error) {
      const message = getApiError(error, 'Unable to save that change.');
      showToast(message, 'error');
      return null;
    }
  }, [refresh, showToast]);

  const addTask = useCallback((task) => runMutation(() => createTask(task), 'Task added to your planner.'), [runMutation]);
  const updateTask = useCallback((id, task) => runMutation(() => saveTask(id, task), 'Task updated successfully.'), [runMutation]);
  const deleteTask = useCallback((id) => runMutation(() => removeTask(id), 'Task deleted.', 'info'), [runMutation]);
  const setTaskStatus = useCallback((id, status) => runMutation(() => updateTaskStatus(id, status), status === 'completed' ? 'Task marked as completed.' : 'Task status updated.'), [runMutation]);
  const toggleFavorite = useCallback((id) => {
    const task = planner.tasks.find((item) => item.id === String(id));
    return task ? updateTask(id, { ...task, isFavorite: !task.isFavorite }) : Promise.resolve();
  }, [planner.tasks, updateTask]);
  const updateSubtasks = useCallback((id, subtasks) => {
    const task = planner.tasks.find((item) => item.id === String(id));
    return task ? updateTask(id, { ...task, subtasks }) : Promise.resolve();
  }, [planner.tasks, updateTask]);
  const addSubject = useCallback((subject) => runMutation(() => createSubject(subject), 'Subject added.'), [runMutation]);
  const updateSubject = useCallback((id, subject) => runMutation(() => saveSubject(id, subject), 'Subject updated.'), [runMutation]);
  const deleteSubject = useCallback((id) => runMutation(() => removeSubject(id), 'Subject removed. Linked tasks remain in your planner.', 'info'), [runMutation]);

  const value = useMemo(() => ({
    ...planner, isLoading, toast, clearToast: () => setToast(null), showToast, refresh,
    addTask, updateTask, deleteTask, setTaskStatus, toggleFavorite, updateSubtasks,
    addSubject, updateSubject, deleteSubject,
  }), [planner, isLoading, toast, showToast, refresh, addTask, updateTask, deleteTask, setTaskStatus, toggleFavorite, updateSubtasks, addSubject, updateSubject, deleteSubject]);

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within PlannerProvider');
  return context;
}
