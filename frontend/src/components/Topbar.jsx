import { FiBell, FiMenu, FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { pageTitles } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

function resolveTitle(pathname) {
  if (pathname.startsWith('/tasks/new')) return 'Add New Task';
  if (/^\/tasks\/[^/]+\/edit$/.test(pathname)) return 'Edit Task';
  if (/^\/tasks\/[^/]+$/.test(pathname)) return 'Task Details';
  return pageTitles[pathname] || 'CUSAT ToDoList';
}

function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = resolveTitle(pathname);

  return (
    <header className="topbar">
      <div className="topbar__heading">
        <button className="icon-button menu-trigger" type="button" onClick={onMenuClick} aria-label="Open navigation">
          <FiMenu />
        </button>
        <div>
          <p className="eyebrow">CUSAT STUDENT</p>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="topbar__actions">
        <label className="search-field" aria-label="Search application">
          <FiSearch aria-hidden="true" />
          <input type="search" placeholder="Search tasks, subjects..." disabled />
        </label>
        <button className="icon-button notification-button" type="button" aria-label="Notifications (coming soon)">
          <FiBell />
          <span className="notification-dot" />
        </button>
        <div className="student-chip">
          <span className="avatar avatar--small">{user.profileImageUrl ? <img src={user.profileImageUrl} alt="" /> : user.firstName.slice(0, 1)}</span>
          <span className="student-chip__copy">
            <strong>{user.fullName}</strong>
            <small>{user.role}</small>
          </span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
