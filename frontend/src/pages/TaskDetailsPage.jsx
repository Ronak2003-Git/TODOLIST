import { useState } from 'react';
import { FiArrowLeft, FiCheck, FiCheckCircle, FiEdit2, FiFileText, FiPlus, FiStar, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import { usePlanner } from '../context/PlannerContext';
import { formatDateTime } from '../utils/dateUtils';

function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, subjects, deleteTask, setTaskStatus, toggleFavorite, updateSubtasks, showToast } = usePlanner();
  const [newSubtask, setNewSubtask] = useState('');
  const task = tasks.find((item) => item.id === id);
  const subject = subjects.find((item) => item.id === task?.subjectId);

  if (!task) return <EmptyState title="Task not found" description="This task may have been deleted." action={<Link className="button button--primary" to="/tasks">Back to tasks</Link>} />;

  const subtasks = task.subtasks || [];
  const changeSubtask = (subtaskId) => updateSubtasks(task.id, subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask)));
  const addSubtask = (event) => {
    event.preventDefault();
    if (!newSubtask.trim()) return;
    updateSubtasks(task.id, [...subtasks, { id: `sub-${Date.now()}`, title: newSubtask.trim(), isCompleted: false }]);
    setNewSubtask('');
    showToast('Subtask added.');
  };
  const removeTask = () => {
    if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) {
      deleteTask(task.id);
      navigate('/tasks');
    }
  };

  return (
    <section className="task-detail-page">
      <Link className="back-navigation" to="/tasks"><FiArrowLeft /> Back to tasks</Link>
      <div className="task-detail-layout">
        <article className="task-detail-card">
          <div className="task-detail-card__top"><div><div className="detail-kicker"><span className="type-label">{task.taskType}</span><StatusBadge status={task.displayStatus} /></div><h2>{task.title}</h2><p className="detail-subject">{subject?.name || 'No subject'} · {subject?.code || 'Academic task'}</p></div><button className={`star-button star-button--large ${task.isFavorite ? 'star-button--active' : ''}`} type="button" onClick={() => toggleFavorite(task.id)} aria-label="Toggle favourite"><FiStar /></button></div>
          <p className="detail-description">{task.description || 'No description has been added for this task.'}</p>
          <dl className="detail-grid"><div><dt>Due date & time</dt><dd>{formatDateTime(task)}</dd></div><div><dt>Priority</dt><dd><PriorityBadge priority={task.priority} /></dd></div><div><dt>Reminder</dt><dd>{task.reminder}</dd></div><div><dt>Subject</dt><dd>{subject?.name || 'No subject'}</dd></div></dl>
          {task.notes && <section className="details-note"><h3>Notes</h3><p>{task.notes}</p></section>}
          {task.attachmentName && <section className="details-attachment"><FiFileText /><div><strong>{task.attachmentName}</strong><span>Attached to this task</span></div></section>}
          <div className="detail-actions"><Link className="button button--ghost" to={`/tasks/${task.id}/edit`}><FiEdit2 /> Edit task</Link><button className="button button--primary" type="button" onClick={() => setTaskStatus(task.id, task.displayStatus === 'completed' ? 'todo' : 'completed')}><FiCheckCircle /> {task.displayStatus === 'completed' ? 'Mark as to do' : 'Mark as completed'}</button><button className="button button--danger" type="button" onClick={removeTask}><FiTrash2 /> Delete</button></div>
        </article>
        <aside className="subtasks-card"><div><p className="eyebrow eyebrow--violet">BREAK IT DOWN</p><h3>Subtasks</h3></div><div className="subtask-list">{subtasks.length ? subtasks.map((subtask) => <label key={subtask.id} className={subtask.isCompleted ? 'subtask subtask--done' : 'subtask'}><input type="checkbox" checked={subtask.isCompleted} onChange={() => changeSubtask(subtask.id)} /><span><FiCheck /></span>{subtask.title}</label>) : <p className="subtasks-empty">No subtasks yet.</p>}</div><form className="subtask-add" onSubmit={addSubtask}><input value={newSubtask} onChange={(event) => setNewSubtask(event.target.value)} placeholder="Add a subtask" /><button type="submit" aria-label="Add subtask"><FiPlus /></button></form></aside>
      </div>
    </section>
  );
}

export default TaskDetailsPage;
