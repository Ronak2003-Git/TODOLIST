import { FiBookOpen, FiCalendar, FiHome, FiPlus, FiUser } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const mobileItems = [
  { label: 'Home', to: '/dashboard', icon: FiHome },
  { label: 'Subjects', to: '/subjects', icon: FiBookOpen },
  { label: 'Calendar', to: '/calendar', icon: FiCalendar },
  { label: 'Profile', to: '/profile', icon: FiUser },
];

function MobileBottomNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {mobileItems.slice(0, 2).map(({ label, to, icon: Icon }) => (
        <NavLink className={({ isActive }) => `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`} key={to} to={to}>
          <Icon aria-hidden="true" /><span>{label}</span>
        </NavLink>
      ))}
      <NavLink className="mobile-nav__add" to="/tasks/new" aria-label="Add a new task"><FiPlus /></NavLink>
      {mobileItems.slice(2).map(({ label, to, icon: Icon }) => (
        <NavLink className={({ isActive }) => `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`} key={to} to={to}>
          <Icon aria-hidden="true" /><span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileBottomNav;
