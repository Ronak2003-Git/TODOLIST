import { FiEdit2, FiMoreHorizontal } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <article className="subject-card">
      <div className="subject-card__head">
        <span className="subject-card__mark" style={{ background: subject.color }}>{subject.name.slice(0, 1)}</span>
        <div><h3>{subject.name}</h3><p>{subject.code} · {subject.lecturerName}</p></div>
        <details className="subject-menu"><summary aria-label={`Actions for ${subject.name}`}><FiMoreHorizontal /></summary><button type="button" onClick={() => onEdit(subject)}><FiEdit2 /> Edit subject</button><button type="button" className="subject-menu__delete" onClick={() => onDelete(subject)} >Remove subject</button></details>
      </div>
      <div className="subject-card__stats"><span>{subject.taskCount} {subject.taskCount === 1 ? 'task' : 'tasks'}</span><strong>{subject.progress}%</strong></div>
      <ProgressBar value={subject.progress} color={subject.color} showValue={false} label={`${subject.name} progress`} />
      <Link className="text-link subject-card__link" to={`/tasks?subject=${subject.id}`}>View tasks</Link>
    </article>
  );
}

export default SubjectCard;
