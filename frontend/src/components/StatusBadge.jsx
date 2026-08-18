const labels = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed', overdue: 'Overdue' };

function StatusBadge({ status = 'todo' }) {
  return <span className={`status-badge status-badge--${status}`}>{labels[status] || status}</span>;
}

export default StatusBadge;
