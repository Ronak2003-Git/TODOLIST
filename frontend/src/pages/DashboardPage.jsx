import { FiArrowRight, FiCheckCircle, FiClock, FiList, FiPlus, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import { usePlanner } from '../context/PlannerContext';
import { useAuth } from '../context/AuthContext';

function formatScheduleTime(time) {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(`1970-01-01T${time}:00`));
}

function DashboardPage() {
  const { tasks, subjects, schedule, stats, setTaskStatus, toggleFavorite } = usePlanner();
  const { user } = useAuth();
  const subjectById = Object.fromEntries(subjects.map((subject) => [subject.id, subject]));
  const upcoming = tasks.filter((task) => task.displayStatus !== 'completed' && task.dueDate >= new Date().toISOString().slice(0, 10)).slice(0, 3);
  const summaryCards = [
    { label: 'Total tasks', value: stats.total, icon: FiList, tone: 'purple' },
    { label: 'Completed', value: stats.completed, icon: FiCheckCircle, tone: 'green' },
    { label: 'Pending', value: stats.pending, icon: FiClock, tone: 'amber' },
    { label: 'Overall progress', value: `${stats.completionRate}%`, icon: FiTrendingUp, tone: 'violet' },
  ];
  const markComplete = (task) => setTaskStatus(task.id, task.displayStatus === 'completed' ? 'todo' : 'completed');

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div><p className="eyebrow eyebrow--violet">ACADEMIC PLANNER</p><h2>Good morning, {user.firstName}! <span aria-hidden="true">👋</span></h2><p>Here are your tasks and classes for today.</p></div>
        <Link className="button button--primary" to="/tasks/new"><FiPlus /> Add new task</Link>
      </section>
      <section className="stats-grid" aria-label="Task summary">{summaryCards.map(({ label, value, icon: Icon, tone }) => <article className="stat-card" key={label}><span className={`stat-card__icon stat-card__icon--${tone}`}><Icon /></span><div><strong>{value}</strong><span>{label}</span></div></article>)}</section>
      <section className="dashboard-grid">
        <article className="dashboard-panel dashboard-panel--tasks"><div className="panel-heading"><div><p className="eyebrow">UP NEXT</p><h3>Upcoming deadlines</h3></div><Link to="/tasks">View all <FiArrowRight /></Link></div><div className="dashboard-task-list">{upcoming.length ? upcoming.map((task) => <TaskCard key={task.id} task={task} subject={subjectById[task.subjectId]} onComplete={markComplete} onFavorite={toggleFavorite} />) : <p className="compact-empty">You have no upcoming deadlines.</p>}</div></article>
        <article className="dashboard-panel"><div className="panel-heading"><div><p className="eyebrow">TODAY</p><h3>Today's schedule</h3></div><Link to="/calendar">View calendar <FiArrowRight /></Link></div><div className="schedule-list">{schedule.map((item) => <div className="schedule-item" key={item.id}><span className="schedule-item__time">{formatScheduleTime(item.time)}</span><span className="schedule-item__line" style={{ background: item.color }} /><div><strong>{item.title}</strong><small>{item.location}</small></div></div>)}</div></article>
        <article className="dashboard-panel dashboard-panel--progress"><div className="panel-heading"><div><p className="eyebrow">YOUR COURSES</p><h3>Subject-wise progress</h3></div><Link to="/progress">View progress <FiArrowRight /></Link></div><div className="subject-progress-list">{subjects.slice(0, 5).map((subject) => <div className="subject-progress-row" key={subject.id}><div><span className="subject-dot" style={{ background: subject.color }} /><strong>{subject.name}</strong></div><ProgressBar value={subject.progress} color={subject.color} label={`${subject.name} completion`} /></div>)}</div></article>
      </section>
    </div>
  );
}

export default DashboardPage;
