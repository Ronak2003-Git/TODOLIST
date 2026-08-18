import { useEffect, useState } from 'react';
import { FiChevronRight, FiLock, FiMoon, FiSun } from 'react-icons/fi';
import api, { getApiError } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { usePlanner } from '../context/PlannerContext';

const defaults = { study_reminders: true, default_task_view: 'list', start_week_on: 'monday', task_reminders: true, class_reminders: true, exam_reminders: true, appearance: 'system', language: 'English' };

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { tasks, deleteTask, showToast } = usePlanner();
  const [preferences, setPreferences] = useState(defaults);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    api.get('/auth/preferences/').then((response) => { setPreferences(response.data); setTheme(response.data.appearance); }).catch((error) => showToast(getApiError(error, 'Unable to load preferences.'), 'error')).finally(() => setIsLoading(false));
  }, [setTheme, showToast]);

  const savePreference = async (updates) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    if (updates.appearance) setTheme(updates.appearance);
    try { await api.put('/auth/preferences/', next); showToast('Preferences saved.'); }
    catch (error) { showToast(getApiError(error, 'Unable to save preferences.'), 'error'); }
  };
  const clearCompleted = async () => {
    const completed = tasks.filter((task) => task.displayStatus === 'completed');
    if (!completed.length) { showToast('There are no completed tasks to clear.', 'info'); return; }
    if (!window.confirm(`Clear ${completed.length} completed task${completed.length === 1 ? '' : 's'}?`)) return;
    await Promise.all(completed.map((task) => deleteTask(task.id)));
  };
  const changePassword = async (event) => {
    event.preventDefault();
    setIsChangingPassword(true);
    try { await api.post('/auth/change-password/', { current_password: passwords.current, new_password: passwords.next }); setPasswords({ current: '', next: '' }); setPasswordOpen(false); showToast('Password changed successfully.'); }
    catch (error) { showToast(getApiError(error, 'Unable to change password.'), 'error'); }
    finally { setIsChangingPassword(false); }
  };

  if (isLoading) return <div className="route-loading"><span className="loading-spinner" /></div>;
  return (
    <section className="settings-page"><div className="page-title-row"><div><p className="eyebrow eyebrow--violet">PERSONALIZATION</p><h2>Settings & preferences</h2><p>Make CUSAT ToDoList feel right for your study routine.</p></div></div>
      <div className="settings-layout"><div className="settings-sections"><SettingsSection title="Preferences"><Toggle label="Study Reminders" description="Helpful nudges for your study plan" checked={preferences.study_reminders} onChange={(value) => savePreference({ study_reminders: value })} /><SelectSetting label="Default Task View" value={preferences.default_task_view} options={[['list', 'List'], ['board', 'Board']]} onChange={(value) => savePreference({ default_task_view: value })} /><SelectSetting label="Start Week On" value={preferences.start_week_on} options={[['monday', 'Monday'], ['sunday', 'Sunday']]} onChange={(value) => savePreference({ start_week_on: value })} /></SettingsSection><SettingsSection title="Notifications"><Toggle label="Task Reminders" checked={preferences.task_reminders} onChange={(value) => savePreference({ task_reminders: value })} /><Toggle label="Class Reminders" checked={preferences.class_reminders} onChange={(value) => savePreference({ class_reminders: value })} /><Toggle label="Exam Reminders" checked={preferences.exam_reminders} onChange={(value) => savePreference({ exam_reminders: value })} /></SettingsSection><SettingsSection title="Appearance"><div className="theme-options">{[['light', FiSun, 'Light mode'], ['dark', FiMoon, 'Dark mode'], ['system', FiChevronRight, 'System default']].map(([value, Icon, label]) => <button type="button" className={theme === value ? 'theme-option theme-option--active' : 'theme-option'} onClick={() => savePreference({ appearance: value })} key={value}><Icon /><span>{label}</span></button>)}</div></SettingsSection><SettingsSection title="Language"><SelectSetting label="Language" value={preferences.language} options={[['English', 'English']]} onChange={(value) => savePreference({ language: value })} /></SettingsSection></div><aside className="settings-other"><p className="eyebrow eyebrow--violet">OTHER</p><h3>Account tools</h3><button type="button" onClick={clearCompleted}>Clear completed tasks <FiChevronRight /></button><button type="button" onClick={() => setPasswordOpen((current) => !current)}>Change password <FiLock /></button><button type="button" onClick={() => showToast('Your planner data now syncs securely through the Django API.', 'info')}>Backup & sync <FiChevronRight /></button><button type="button" onClick={() => showToast('CUSAT ToDoList helps students plan, focus, and progress.', 'info')}>About CUSAT ToDoList <FiChevronRight /></button></aside></div>
      {passwordOpen && <div className="modal-layer"><form className="password-modal" onSubmit={changePassword}><h3>Change password</h3><label className="form-field"><span>Current password</span><input type="password" value={passwords.current} onChange={(event) => setPasswords({ ...passwords, current: event.target.value })} required /></label><label className="form-field"><span>New password</span><input type="password" minLength="8" value={passwords.next} onChange={(event) => setPasswords({ ...passwords, next: event.target.value })} required /></label><div className="form-actions"><button type="button" className="button button--ghost" onClick={() => setPasswordOpen(false)}>Cancel</button><button type="submit" className="button button--primary" disabled={isChangingPassword}>{isChangingPassword ? 'Saving…' : 'Change password'}</button></div></form></div>}</section>
  );
}

function SettingsSection({ title, children }) { return <section className="settings-section"><h3>{title}</h3>{children}</section>; }
function Toggle({ label, description, checked, onChange }) { return <div className="setting-row"><div><strong>{label}</strong>{description && <small>{description}</small>}</div><button type="button" className={checked ? 'toggle toggle--on' : 'toggle'} onClick={() => onChange(!checked)} aria-pressed={checked}><span /></button></div>; }
function SelectSetting({ label, value, options, onChange }) { return <label className="setting-row setting-row--select"><strong>{label}</strong><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, title]) => <option key={option} value={option}>{title}</option>)}</select></label>; }

export default SettingsPage;
