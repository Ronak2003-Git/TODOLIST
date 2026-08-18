import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import SubjectCard from '../components/SubjectCard';
import { usePlanner } from '../context/PlannerContext';

const palette = ['#6C4DF6', '#2563EB', '#F59E0B', '#EC4899', '#14B8A6', '#F97316', '#22C55E'];
const blankSubject = { name: '', lecturerName: '', code: '', color: '#6C4DF6' };

function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = usePlanner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState(blankSubject);
  const [error, setError] = useState('');

  const openCreate = () => { setEditingSubject(null); setForm(blankSubject); setError(''); setIsModalOpen(true); };
  const openEdit = (subject) => { setEditingSubject(subject); setForm(subject); setError(''); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const saveSubject = (event) => {
    event.preventDefault();
    if (!form.name.trim()) { setError('Enter a subject name.'); return; }
    if (editingSubject) updateSubject(editingSubject.id, { ...form, name: form.name.trim(), lecturerName: form.lecturerName.trim(), code: form.code.trim() });
    else addSubject(form);
    closeModal();
  };
  const removeSubject = (subject) => {
    if (window.confirm(`Remove ${subject.name}? Tasks will remain, but no longer be linked to this subject.`)) deleteSubject(subject.id);
  };

  return (
    <section className="subjects-page">
      <div className="page-title-row"><div><p className="eyebrow eyebrow--violet">COURSE OVERVIEW</p><h2>My subjects</h2><p>Keep your courses, lecturers, and task progress organized.</p></div><button className="button button--primary" type="button" onClick={openCreate}><FiPlus /> Add / manage subjects</button></div>
      <div className="subjects-grid">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} onEdit={openEdit} onDelete={removeSubject} />)}</div>
      {isModalOpen && <div className="modal-layer" role="presentation"><section className="subject-modal" role="dialog" aria-modal="true" aria-labelledby="subject-modal-title"><button className="modal-close" type="button" onClick={closeModal} aria-label="Close"><FiX /></button><p className="eyebrow eyebrow--violet">COURSE DETAILS</p><h2 id="subject-modal-title">{editingSubject ? 'Edit subject' : 'Add a subject'}</h2><form onSubmit={saveSubject}><label className="form-field"><span>Subject name <b>*</b></span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Mathematics" autoFocus />{error && <small className="field-error">{error}</small>}</label><div className="form-grid form-grid--two"><label className="form-field"><span>Course code</span><input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="e.g. MAT 101" /></label><label className="form-field"><span>Lecturer</span><input value={form.lecturerName} onChange={(event) => setForm({ ...form, lecturerName: event.target.value })} placeholder="e.g. Dr. Meera Nair" /></label></div><fieldset className="form-fieldset"><legend>Subject colour</legend><div className="color-options">{palette.map((color) => <button type="button" key={color} className={form.color === color ? 'color-option color-option--selected' : 'color-option'} style={{ background: color }} onClick={() => setForm({ ...form, color })} aria-label={`Choose ${color}`} />)}</div></fieldset><div className="form-actions"><button type="button" className="button button--ghost" onClick={closeModal}>Cancel</button><button type="submit" className="button button--primary">{editingSubject ? 'Save changes' : 'Add subject'}</button></div></form></section></div>}
    </section>
  );
}

export default SubjectsPage;
