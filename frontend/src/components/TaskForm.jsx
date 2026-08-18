import { useEffect, useState } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toDateKey } from '../utils/dateUtils';

const taskTypes = ['assignment', 'study', 'exam', 'project', 'report', 'other'];
const reminders = ['10 minutes before', '30 minutes before', '1 hour before', '1 day before', 'Custom'];

function createInitialValues(task) {
  return {
    title: '',
    subjectId: '',
    taskType: 'assignment',
    description: '',
    dueDate: toDateKey(),
    dueTime: '17:00',
    priority: 'medium',
    reminder: '1 hour before',
    notes: '',
    attachmentName: '',
    ...task,
  };
}

function TaskForm({ initialTask, subjects, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(() => createInitialValues(initialTask));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const hasSubjects = subjects.length > 0;

  useEffect(() => setForm(createInitialValues(initialTask)), [initialTask]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Enter a task title.';
    if (!form.subjectId) nextErrors.subjectId = hasSubjects ? 'Choose a subject.' : 'Add a subject before creating a task.';
    if (!form.dueDate) nextErrors.dueDate = 'Choose a due date.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsSaving(true);
    try {
      await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim(), notes: form.notes.trim() });
    } finally { setIsSaving(false); }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-section">
        <div className="form-section__head"><h2>Task details</h2><p>Keep the important information together.</p></div>
        <div className="form-grid form-grid--two">
          <label className="form-field form-field--wide">
            <span>Task title <b>*</b></span>
            <input value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="e.g. Submit Lab Record" aria-invalid={Boolean(errors.title)} />
            {errors.title && <small className="field-error">{errors.title}</small>}
          </label>
          <label className="form-field">
            <span>Subject / Course <b>*</b></span>
            <select value={form.subjectId} onChange={(event) => setField('subjectId', event.target.value)} aria-invalid={Boolean(errors.subjectId)} disabled={!hasSubjects}>
              <option value="">{hasSubjects ? 'Select subject' : 'No subjects available'}</option>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
            {errors.subjectId && <small className="field-error">{errors.subjectId}</small>}
            {!hasSubjects && <small className="form-hint">Start by adding one of your courses in <Link to="/subjects">My subjects</Link>.</small>}
          </label>
        </div>
        <fieldset className="form-fieldset">
          <legend>Task type</legend>
          <div className="choice-row">
            {taskTypes.map((type) => <button className={`choice-button ${form.taskType === type ? 'choice-button--selected' : ''}`} type="button" key={type} onClick={() => setField('taskType', type)}>{type}</button>)}
          </div>
        </fieldset>
        <label className="form-field">
          <span>Description</span>
          <textarea value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="What do you need to complete?" rows="4" />
        </label>
      </div>

      <div className="form-section">
        <div className="form-section__head"><h2>Plan your reminder</h2><p>Choose a due date and alert that works for you.</p></div>
        <div className="form-grid form-grid--three">
          <label className="form-field"><span>Due date <b>*</b></span><input type="date" value={form.dueDate} onChange={(event) => setField('dueDate', event.target.value)} aria-invalid={Boolean(errors.dueDate)} />{errors.dueDate && <small className="field-error">{errors.dueDate}</small>}</label>
          <label className="form-field"><span>Due time</span><input type="time" value={form.dueTime} onChange={(event) => setField('dueTime', event.target.value)} /></label>
          <label className="form-field"><span>Reminder</span><select value={form.reminder} onChange={(event) => setField('reminder', event.target.value)}>{reminders.map((reminder) => <option key={reminder}>{reminder}</option>)}</select></label>
        </div>
        <fieldset className="form-fieldset">
          <legend>Priority</legend>
          <div className="priority-choices">
            {['low', 'medium', 'high'].map((priority) => <label className={`priority-choice priority-choice--${priority}`} key={priority}><input type="radio" name="priority" value={priority} checked={form.priority === priority} onChange={(event) => setField('priority', event.target.value)} /><span>{priority}</span></label>)}
          </div>
        </fieldset>
      </div>

      <div className="form-section">
        <div className="form-section__head"><h2>Notes & attachment</h2><p>Optional details that make it easier to pick up later.</p></div>
        <label className="form-field"><span>Notes</span><textarea value={form.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Add notes here..." rows="4" /></label>
        <label className="attachment-input"><FiPaperclip /><span><strong>{form.attachmentName || 'Attach a file'}</strong><small>PDF, DOCX, PNG, or JPG</small></span><input type="file" accept=".pdf,.doc,.docx,image/*" onChange={(event) => { const file = event.target.files?.[0] || null; setForm((current) => ({ ...current, attachmentName: file?.name || '', attachmentFile: file })); }} /></label>
      </div>
      <div className="form-actions"><button type="button" className="button button--ghost" onClick={onCancel} disabled={isSaving}>Cancel</button><button type="submit" className="button button--primary" disabled={isSaving}>{isSaving ? 'Saving…' : submitLabel}</button></div>
    </form>
  );
}

export default TaskForm;
