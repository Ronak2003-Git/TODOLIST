import { FiClipboard } from 'react-icons/fi';

function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="empty-state">
      <span><FiClipboard /></span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
