import { FiLogOut, FiX } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoMark from './LogoMark';
import { navigationItems } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Primary navigation">
      <div className="sidebar__head">
        <LogoMark />
        <button className="icon-button sidebar__close" type="button" onClick={onClose} aria-label="Close navigation">
          <FiX />
        </button>
      </div>

      <nav className="sidebar__nav">
        <p className="sidebar__section-label">STUDENT PLANNER</p>
        {navigationItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            key={to}
            to={to}
            onClick={onClose}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="nav-link nav-link--logout" type="button" onClick={handleLogout}>
          <FiLogOut aria-hidden="true" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
