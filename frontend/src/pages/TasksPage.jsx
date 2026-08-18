import { useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiEye, FiPlus, FiSearch, FiStar, FiTrash2 } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import TaskCard from '../components/TaskCard';
import { usePlanner } from '../context/PlannerContext';
import { formatDateTime, toDateKey } from '../utils/dateUtils';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To Do' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [subjectId, setSubjectId] = useState(searchParams.get('subject') || '');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { tasks, subjects, deleteTask, setTaskStatus, toggleFavorite } = usePlanner();
  const subjectById = useMemo(() => Object.fromEntries(subjects.map((subject) => [subject.id, subject])), [subjects]);

  const filteredTasks = useMemo(() => {
    const today = toDateKey();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const endDate = toDateKey(end);
    return tasks.filter((task) => {
      const matchesTab = activeTab === 'all'
        || (activeTab === 'todo' && ['todo', 'in_progress', 'overdue'].includes(task.displayStatus))
        || (activeTab === 'completed' && task.displayStatus === 'completed')
        || (activeTab === 'upcoming' && task.displayStatus !== 'completed' && task.dueDate >= today && task.dueDate <= endDate);
      const taskSubject = subjectById[task.subjectId]?.name || '';
      return matchesTab
        && (!search || `${task.title} ${taskSubject}`.toLowerCase().includes(search.toLowerCase()))
        && (!subjectId || task.subjectId === subjectId)
        && (!type || task.taskType === type)
        && (!priority || task.priority === priority)
        && (!status || task.displayStatus === status);
    }).sort((first, second) => `${first.dueDate}${first.dueTime}`.localeCompare(`${second.dueDate}${second.dueTime}`));
  }, [tasks, activeTab, search, subjectId, type, priority, status, subjectById]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const pageTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [activeTab, search, subjectId, type, priority, status]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const chooseSubject = (value) => {
    setSubjectId(value);
    setSearchParams(value ? { subject: value } : {});
  };
  const toggleComplete = (task) => setTaskStatus(task.id, task.displayStatus === 'completed' ? 'todo' : 'completed');
  const confirmDelete = (task) => {
    if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) deleteTask(task.id);
  };

  return (
    <section className="tasks-page">
      <div className="page-title-row"><div><p className="eyebrow eyebrow--violet">TASK MANAGEMENT</p><h2>Tasks & assignments</h2><p>Stay ahead of every deadline, exam, and study goal.</p></div><Link className="button button--primary" to="/tasks/new"><FiPlus /> Add new task</Link></div>
      <div className="task-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Task status filters">{tabs.map((tab) => <button type="button" key={tab.id} className={activeTab === tab.id ? 'filter-tab filter-tab--active' : 'filter-tab'} onClick={() => setActiveTab(tab.id)}>{tab.label} <small>{tab.id === 'all' ? tasks.length : tasks.filter((task) => tab.id === 'todo' ? ['todo', 'in_progress', 'overdue'].includes(task.displayStatus) : task.displayStatus === tab.id).length}</small></button>)}</div>
        <div className="task-filters"><label className="search-field search-field--wide"><FiSearch /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" /></label><select value={subjectId} onChange={(event) => chooseSubject(event.target.value)}><option value="">All subjects</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select><select value={type} onChange={(event) => setType(event.target.value)}><option value="">All types</option>{['assignment', 'study', 'exam', 'project', 'report', 'other'].map((item) => <option key={item}>{item}</option>)}</select><select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="">All priorities</option>{['low', 'medium', 'high'].map((item) => <option key={item}>{item}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="overdue">Overdue</option></select></div>
      </div>

      {filteredTasks.length ? <><div className="task-table-wrap"><table className="task-table"><thead><tr><th>Task</th><th>Subject</th><th>Type</th><th>Due date & time</th><th>Priority</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{pageTasks.map((task) => <tr key={task.id}><td><button className={`table-check ${task.displayStatus === 'completed' ? 'table-check--done' : ''}`} type="button" onClick={() => toggleComplete(task)}>{task.displayStatus === 'completed' && '✓'}</button><div className="table-task"><strong>{task.title}</strong><button className={task.isFavorite ? 'table-star table-star--active' : 'table-star'} type="button" onClick={() => toggleFavorite(task.id)} aria-label="Toggle favourite"><FiStar /></button></div></td><td>{subjectById[task.subjectId]?.name || 'No subject'}</td><td><span className="type-label">{task.taskType}</span></td><td>{formatDateTime(task)}</td><td><PriorityBadge priority={task.priority} /></td><td><StatusBadge status={task.displayStatus} /></td><td><div className="table-actions"><Link to={`/tasks/${task.id}`} title="View task"><FiEye /></Link><Link to={`/tasks/${task.id}/edit`} title="Edit task"><FiEdit2 /></Link><button type="button" onClick={() => confirmDelete(task)} title="Delete task"><FiTrash2 /></button></div></td></tr>)}</tbody></table></div><div className="mobile-task-list">{pageTasks.map((task) => <TaskCard key={task.id} task={task} subject={subjectById[task.subjectId]} onComplete={toggleComplete} onFavorite={toggleFavorite} />)}</div><div className="task-list-footer"><p className="table-count">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredTasks.length)} of {filteredTasks.length} tasks</p>{totalPages > 1 && <div className="pagination"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Previous page"><FiChevronLeft /></button>{Array.from({ length: totalPages }, (_, index) => <button type="button" key={index + 1} onClick={() => setPage(index + 1)} className={page === index + 1 ? 'pagination__page pagination__page--active' : 'pagination__page'}>{index + 1}</button>)}<button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} aria-label="Next page"><FiChevronRight /></button></div>}</div></> : <EmptyState title="No matching tasks" description="Try another filter, or add a new task to your planner." action={<Link className="button button--primary" to="/tasks/new"><FiPlus /> Add new task</Link>} />}
    </section>
  );
}

export default TasksPage;
