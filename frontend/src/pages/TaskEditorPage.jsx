import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import TaskForm from '../components/TaskForm';
import { usePlanner } from '../context/PlannerContext';

function TaskEditorPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, subjects, addTask, updateTask } = usePlanner();
  const task = mode === 'edit' ? tasks.find((item) => item.id === id) : null;
  const [error, setError] = useState('');

  if (mode === 'edit' && !task) return <EmptyState title="Task not found" description="This task may have been deleted." action={<Link className="button button--primary" to="/tasks">Back to tasks</Link>} />;

  const handleSubmit = async (form) => {
    setError('');
    if (mode === 'edit') {
      const updated = await updateTask(task.id, form);
      if (updated) {
        navigate(`/tasks/${task.id}`);
        return updated;
      }
      setError('Unable to update this task. Please check the details and try again.');
      return null;
    }
    const createdTask = await addTask(form);
    if (createdTask) {
      navigate(`/tasks/${createdTask.id}`);
      return createdTask;
    }
    setError('Unable to save this task. Please check the details and try again.');
    return null;
  };

  return (
    <section className="editor-page">
      <Link className="back-navigation" to={mode === 'edit' ? `/tasks/${task.id}` : '/tasks'}><FiArrowLeft /> Back to {mode === 'edit' ? 'task details' : 'tasks'}</Link>
      <div className="page-title-block"><p className="eyebrow eyebrow--violet">TASK PLANNER</p><h2>{mode === 'edit' ? 'Edit task' : 'Add a new task'}</h2><p>{mode === 'edit' ? 'Update the details and keep your plan in sync.' : 'Create a new task, assignment, exam, or project.'}</p></div>
      {error && <p className="form-alert">{error}</p>}
      <TaskForm initialTask={task} subjects={subjects} onSubmit={handleSubmit} onCancel={() => navigate(mode === 'edit' ? `/tasks/${task.id}` : '/tasks')} submitLabel={mode === 'edit' ? 'Update task' : 'Save task'} />
    </section>
  );
}

export default TaskEditorPage;
