import { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PriorityBadge from '../components/PriorityBadge';
import { usePlanner } from '../context/PlannerContext';
import { datesForWeek, formatDateTime, getMonthGrid, monthTitle, shortDate, toDateKey } from '../utils/dateUtils';

const viewOptions = ['Today', 'Month', 'Week', 'Day'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function scheduleTime(time) {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(`1970-01-01T${time}:00`));
}

function CalendarPage() {
  const { tasks, subjects, schedule } = usePlanner();
  const [selectedDate, setSelectedDate] = useState(toDateKey());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [view, setView] = useState('Month');
  const subjectById = useMemo(() => Object.fromEntries(subjects.map((subject) => [subject.id, subject])), [subjects]);
  const grid = getMonthGrid(calendarDate.getFullYear(), calendarDate.getMonth());
  const selectedTasks = tasks.filter((task) => task.dueDate === selectedDate).sort((a, b) => a.dueTime.localeCompare(b.dueTime));
  const navigateMonth = (direction) => setCalendarDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  const selectToday = () => { const today = new Date(); setSelectedDate(toDateKey(today)); setCalendarDate(today); setView('Today'); };
  const taskDates = new Set(tasks.map((task) => task.dueDate));
  const agendaDates = view === 'Week' ? datesForWeek(new Date(`${selectedDate}T12:00:00`)) : [new Date(`${selectedDate}T12:00:00`)];

  return (
    <section className="calendar-page">
      <div className="page-title-row"><div><p className="eyebrow eyebrow--violet">ACADEMIC CALENDAR</p><h2>Calendar & timetable</h2><p>See task deadlines beside your class routine.</p></div><button type="button" className="button button--ghost" onClick={selectToday}>Today</button></div>
      <div className="calendar-view-switch" role="tablist">{viewOptions.map((item) => <button key={item} type="button" className={view === item ? 'calendar-view-switch__item calendar-view-switch__item--active' : 'calendar-view-switch__item'} onClick={() => item === 'Today' ? selectToday() : setView(item)}>{item}</button>)}</div>
      {view === 'Month' ? <div className="calendar-layout"><article className="calendar-card"><div className="calendar-card__head"><h3>{monthTitle(calendarDate)}</h3><div><button type="button" className="calendar-arrow" onClick={() => navigateMonth(-1)} aria-label="Previous month"><FiChevronLeft /></button><button type="button" className="calendar-arrow" onClick={() => navigateMonth(1)} aria-label="Next month"><FiChevronRight /></button></div></div><div className="calendar-grid">{weekdays.map((day) => <span key={day} className="calendar-weekday">{day}</span>)}{grid.map((day) => { const selected = day.key === selectedDate; const today = day.key === toDateKey(); const hasTasks = taskDates.has(day.key); return <button type="button" key={day.key} className={`calendar-day ${!day.isCurrentMonth ? 'calendar-day--muted' : ''} ${selected ? 'calendar-day--selected' : ''} ${today ? 'calendar-day--today' : ''}`} onClick={() => setSelectedDate(day.key)}><span>{day.date.getDate()}</span>{hasTasks && <i />}</button>; })}</div></article><aside className="daily-panel"><p className="eyebrow eyebrow--violet">SELECTED DATE</p><h3>Tasks on {shortDate(selectedDate)}</h3><Agenda tasks={selectedTasks} subjectById={subjectById} /><Timetable schedule={schedule} /></aside></div> : <article className="agenda-card"><div className="agenda-card__head"><div><p className="eyebrow eyebrow--violet">{view === 'Week' ? 'THIS WEEK' : 'SELECTED DATE'}</p><h3>{view === 'Week' ? 'Your weekly agenda' : `Tasks on ${shortDate(selectedDate)}`}</h3></div><button className="button button--ghost" type="button" onClick={() => setView('Month')}>View month</button></div><div className={view === 'Week' ? 'week-agenda' : 'day-agenda'}>{agendaDates.map((date) => { const key = toDateKey(date); return <div className="agenda-day" key={key}><h4>{new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }).format(date)}</h4><Agenda tasks={tasks.filter((task) => task.dueDate === key)} subjectById={subjectById} /></div>; })}</div></article>}
    </section>
  );
}

function Agenda({ tasks, subjectById }) {
  if (!tasks.length) return <p className="calendar-empty">No task deadlines for this date.</p>;
  return <div className="agenda-list">{tasks.map((task) => <Link className="agenda-task" to={`/tasks/${task.id}`} key={task.id}><span className="agenda-task__line" style={{ background: subjectById[task.subjectId]?.color || '#6C4DF6' }} /><div><strong>{task.title}</strong><small>{formatDateTime(task)} · {subjectById[task.subjectId]?.name || 'No subject'}</small></div><PriorityBadge priority={task.priority} /></Link>)}</div>;
}

function Timetable({ schedule }) {
  return <div className="timetable"><p className="eyebrow">TODAY'S CLASSES</p>{schedule.map((item) => <div className="timetable-row" key={item.id}><strong>{scheduleTime(item.time)}</strong><span style={{ background: item.color }} /><div><b>{item.title}</b><small>{item.location}</small></div></div>)}</div>;
}

export default CalendarPage;
