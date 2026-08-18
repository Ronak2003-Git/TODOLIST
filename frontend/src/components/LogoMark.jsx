import { FiCheckCircle } from 'react-icons/fi';

function LogoMark({ compact = false }) {
  return (
    <div className="brand" aria-label="CUSAT ToDoList">
      <span className="brand-mark" aria-hidden="true"><FiCheckCircle /></span>
      {!compact && (
        <span className="brand-copy">
          <strong>CUSAT</strong>
          <span>ToDoList</span>
        </span>
      )}
    </div>
  );
}

export default LogoMark;
