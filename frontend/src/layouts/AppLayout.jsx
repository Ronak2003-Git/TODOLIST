import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MobileBottomNav from '../components/MobileBottomNav';
import NotificationToast from '../components/NotificationToast';
import { usePlanner } from '../context/PlannerContext';

function AppLayout() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const { toast, clearToast } = usePlanner();
  const closeNavigation = () => setIsNavigationOpen(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isNavigationOpen} onClose={closeNavigation} />
      {isNavigationOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={closeNavigation} />}
      <div className="app-content">
        <Topbar onMenuClick={() => setIsNavigationOpen(true)} />
        <main className="page-content"><Outlet /></main>
      </div>
      <MobileBottomNav />
      <NotificationToast toast={toast} onDismiss={clearToast} />
    </div>
  );
}

export default AppLayout;
