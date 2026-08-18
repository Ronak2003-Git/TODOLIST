import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import SplashPage from './pages/SplashPage';
import OnboardingPage from './pages/OnboardingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TaskEditorPage from './pages/TaskEditorPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import SubjectsPage from './pages/SubjectsPage';
import CalendarPage from './pages/CalendarPage';
import LoadingSpinner from './components/LoadingSpinner';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotesPage from './pages/NotesPage';
import SupportPage from './pages/SupportPage';
import { useAuth } from './context/AuthContext';

const ProgressPage = lazy(() => import('./pages/ProgressPage'));

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="route-loading"><LoadingSpinner label="Loading your account" /></div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<TaskEditorPage mode="create" />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/tasks/:id/edit" element={<TaskEditorPage mode="edit" />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/progress" element={<Suspense fallback={<div className="route-loading"><LoadingSpinner label="Loading study progress" /></div>}><ProgressPage /></Suspense>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
