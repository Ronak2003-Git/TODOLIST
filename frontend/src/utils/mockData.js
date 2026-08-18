import {
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiCheckSquare,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiSettings,
  FiUser,
} from 'react-icons/fi';

export const student = {
  fullName: 'Ananya S.',
  firstName: 'Ananya',
  registerNumber: '1234567',
  email: 'ananya@example.com',
  role: 'CUSAT Student',
};

export const navigationItems = [
  { label: 'Dashboard', to: '/dashboard', icon: FiHome },
  { label: 'My Subjects', to: '/subjects', icon: FiBookOpen },
  { label: 'Tasks & Assignments', to: '/tasks', icon: FiCheckSquare },
  { label: 'Calendar', to: '/calendar', icon: FiCalendar },
  { label: 'Study Progress', to: '/progress', icon: FiBarChart2 },
  { label: 'Notes & Resources', to: '/notes', icon: FiFileText },
  { label: 'Profile', to: '/profile', icon: FiUser },
  { label: 'Settings', to: '/settings', icon: FiSettings },
  { label: 'Help & Support', to: '/support', icon: FiHelpCircle },
];

export const pageTitles = {
  '/dashboard': 'Dashboard',
  '/subjects': 'My Subjects',
  '/tasks': 'Tasks & Assignments',
  '/calendar': 'Calendar & Timetable',
  '/progress': 'Study Progress',
  '/notes': 'Notes & Resources',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/support': 'Help & Support',
};
