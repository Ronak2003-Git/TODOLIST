import { FiAlertCircle, FiCheckCircle, FiClock, FiList } from 'react-icons/fi';
import { Bar, BarChart, Cell, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ProgressBar from '../components/ProgressBar';
import { usePlanner } from '../context/PlannerContext';

const priorityColors = { Low: '#22C55E', Medium: '#F59E0B', High: '#EF4444' };

function ProgressPage() {
  const { subjects, stats, analytics } = usePlanner();
  const priorityData = (analytics.priority || []).map((item) => ({ name: item.name, value: item.value }));
  const weeklyData = analytics.weekly || [];
  const cards = [
    { label: 'Total tasks', value: stats.total, icon: FiList, tone: 'purple' },
    { label: 'Pending', value: stats.pending, icon: FiClock, tone: 'amber' },
    { label: 'Overdue', value: stats.overdue, icon: FiAlertCircle, tone: 'danger' },
    { label: 'Completion rate', value: `${stats.completionRate}%`, icon: FiCheckCircle, tone: 'green' },
  ];

  return (
    <section className="progress-page">
      <div className="page-title-row"><div><p className="eyebrow eyebrow--violet">STUDY ANALYTICS</p><h2>Study progress</h2><p>A clear view of your momentum across every course.</p></div><span className="period-pill">This week</span></div>
      <section className="stats-grid">{cards.map(({ label, value, icon: Icon, tone }) => <article className="stat-card" key={label}><span className={`stat-card__icon stat-card__icon--${tone}`}><Icon /></span><div><strong>{value}</strong><span>{label}</span></div></article>)}</section>
      <section className="analytics-grid"><article className="analytics-card completion-card"><div className="panel-heading"><div><p className="eyebrow">COMPLETION RATE</p><h3>{stats.completionRate}% of tasks complete</h3></div></div><ProgressBar value={stats.completionRate} color="#6C4DF6" showValue={false} label="Overall completion rate" /><p>{stats.completed} completed · {stats.pending} pending · {stats.overdue} overdue</p></article><article className="analytics-card priority-chart-card"><div className="panel-heading"><div><p className="eyebrow">TASKS BY PRIORITY</p><h3>What needs attention</h3></div></div><div className="pie-chart-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={75} paddingAngle={4}>{priorityData.map((entry) => <Cell key={entry.name} fill={priorityColors[entry.name]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="priority-legend">{priorityData.map((item) => <span key={item.name}><i style={{ background: priorityColors[item.name] }} />{item.name} <b>{item.value}</b></span>)}</div></div></article><article className="analytics-card analytics-card--wide"><div className="panel-heading"><div><p className="eyebrow">WEEKLY PRODUCTIVITY</p><h3>Created vs completed</h3></div></div><div className="bar-chart-wrap"><ResponsiveContainer width="100%" height={260}><BarChart data={weeklyData} barGap={4}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#707080', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#707080', fontSize: 12 }} allowDecimals={false} /><Tooltip cursor={{ fill: 'rgba(108, 77, 246, .06)' }} /><Bar dataKey="created" name="Created" fill="#D9D0FF" radius={[5, 5, 0, 0]} /><Bar dataKey="completed" name="Completed" fill="#6C4DF6" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></article><article className="analytics-card analytics-card--wide"><div className="panel-heading"><div><p className="eyebrow">SUBJECT-WISE PROGRESS</p><h3>Completion by course</h3></div></div><div className="analytics-subject-list">{subjects.map((subject) => <div className="analytics-subject-row" key={subject.id}><div><span className="subject-dot" style={{ background: subject.color }} /><strong>{subject.name}</strong><small>{subject.taskCount} {subject.taskCount === 1 ? 'task' : 'tasks'}</small></div><ProgressBar value={subject.progress} color={subject.color} label={`${subject.name} progress`} /></div>)}</div></article></section>
    </section>
  );
}

export default ProgressPage;
