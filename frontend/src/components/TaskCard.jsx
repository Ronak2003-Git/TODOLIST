import { FiCheck, FiClock, FiEdit2, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatDateTime, relativeDueLabel } from '../utils/dateUtils';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

function TaskCard({ task, subject, onComplete, onFavorite }) {
  return (
    <article className="task-card">
      <div className="task-card__head">
        <button className={`task-check ${task.displayStatus === 'completed' ? 'task-check--done' : ''}`} type="button" onClick={() => onComplete(task)} aria-label={`Mark ${task.title} as ${task.displayStatus === 'completed' ? 'to do' : 'completed'}`}>
          {task.displayStatus === 'completed' && <FiCheck />}
        </button>
        <div className="task-card__title"><Link to={`/tasks/${task.id}`}>{task.title}</Link><span>{subject?.name || 'No subject'}</span></div>
        <button className={`star-button ${task.isFavorite ? 'star-button--active' : ''}`} type="button" onClick={() => onFavorite(task.id)} aria-label="Toggle favourite"><FiStar /></button>
      </div>
      <div className="task-card__meta"><span><FiClock /> {relativeDueLabel(task)}</span><span>{formatDateTime(task)}</span></div>
      <div className="task-card__foot"><PriorityBadge priority={task.priority} /><StatusBadge status={task.displayStatus} /><Link to={`/tasks/${task.id}/edit`} className="mini-action"><FiEdit2 /> Edit</Link></div>
    </article>
  );
}

export default TaskCard;
