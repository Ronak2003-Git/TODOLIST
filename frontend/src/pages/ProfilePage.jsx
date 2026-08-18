import { useRef, useState } from 'react';
import { FiAward, FiBookOpen, FiCheckSquare, FiEdit2, FiFileText, FiGrid, FiSave, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlanner } from '../context/PlannerContext';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { stats, subjects, tasks, showToast } = usePlanner();
  const imageInput = useRef(null);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ fullName: user.fullName, email: user.email, registerNumber: user.registerNumber, profileImage: null });
  const avatar = form.profileImage ? URL.createObjectURL(form.profileImage) : user.profileImageUrl;
  const menuItems = [
    { icon: FiGrid, label: 'My Profile', value: 'Personal details' },
    { icon: FiCheckSquare, label: 'Attendance', value: '87%' },
    { icon: FiBookOpen, label: 'My Subjects', value: `${subjects.length} courses` },
    { icon: FiFileText, label: 'My Tasks', value: `${tasks.length} tasks` },
    { icon: FiUsers, label: 'Study Groups', value: 'Coming soon' },
    { icon: FiAward, label: 'Achievements', value: '5 badges' },
    { icon: FiFileText, label: 'Notes & Resources', value: 'Study files', to: '/notes' },
  ];
  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
      showToast('Profile updated successfully.');
    } catch (error) { showToast(error.message, 'error'); }
    finally { setIsSaving(false); }
  };

  return (
    <section className="profile-page">
      <div className="profile-hero"><div className="profile-avatar">{avatar ? <img src={avatar} alt="Student profile" /> : user.firstName.slice(0, 1)}</div><div><p>CUSAT STUDENT</p><h2>{user.fullName}</h2><span>Register No: {user.registerNumber}</span><small>{user.email}</small></div><button className="button button--ghost profile-edit" type="button" onClick={() => setEditing((current) => !current)}><FiEdit2 /> {editing ? 'Close edit' : 'Edit profile'}</button></div>
      {editing && <form className="profile-edit-form" onSubmit={save}><div className="form-grid form-grid--two"><label className="form-field"><span>Full name</span><input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></label><label className="form-field"><span>Email address</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label className="form-field"><span>Register number</span><input value={form.registerNumber} onChange={(event) => setForm({ ...form, registerNumber: event.target.value })} /></label><label className="attachment-input profile-photo-input"><FiEdit2 /><span><strong>Change profile photo</strong><small>PNG, JPG, or WEBP</small></span><input ref={imageInput} type="file" accept="image/*" onChange={(event) => setForm({ ...form, profileImage: event.target.files?.[0] || null })} /></label></div><div className="form-actions"><button className="button button--primary" type="submit" disabled={isSaving}><FiSave /> {isSaving ? 'Saving…' : 'Save profile'}</button></div></form>}
      <div className="profile-content"><div className="profile-menu">{menuItems.map(({ icon: Icon, label, value, to }) => to ? <Link className="profile-menu__item" key={label} to={to}><span><Icon /></span><strong>{label}</strong><small>{value}</small></Link> : <div className="profile-menu__item" key={label}><span><Icon /></span><strong>{label}</strong><small>{value}</small></div>)}</div><div className="profile-overview"><div className="panel-heading"><div><p className="eyebrow eyebrow--violet">ACADEMIC OVERVIEW</p><h3>Your semester snapshot</h3></div></div><div className="profile-stats"><div><strong>{stats.completionRate}%</strong><span>Completion rate</span></div><div><strong>{stats.completed}</strong><span>Tasks completed</span></div><div><strong>{subjects.length}</strong><span>Subjects</span></div></div><div className="profile-achievement"><span><FiAward /></span><div><strong>5 badges earned</strong><p>Keep building your academic streak.</p></div></div></div></div>
    </section>
  );
}

export default ProfilePage;
