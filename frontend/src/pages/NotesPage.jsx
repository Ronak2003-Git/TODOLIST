import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiDownload, FiEdit2, FiExternalLink, FiFileText, FiMaximize2, FiMinimize2, FiPlus, FiSearch, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import EmptyState from '../components/EmptyState';
import NotebookEditor from '../components/NotebookEditor';
import NoteContent, { noteSummary } from '../components/NoteContent';
import { usePlanner } from '../context/PlannerContext';
import { createNote, deleteNote, downloadNote, getNotes, updateNote } from '../services/notesService';
import { getApiError } from '../services/api';

const semesters = Array.from({ length: 10 }, (_, index) => String(index + 1));
const blankNote = { heading: '', subjectId: '', semester: '1', content: '', attachmentFile: null, attachmentName: '' };

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUpdatedAt(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function NotesPage() {
  const { subjects, showToast } = usePlanner();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [isReaderFullscreen, setIsReaderFullscreen] = useState(false);
  const [form, setForm] = useState(blankNote);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState('');

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      setNotes(await getNotes({ subjectId: subjectFilter, semester: semesterFilter }));
    } catch (error) {
      showToast(getApiError(error, 'Unable to load your notes.'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [semesterFilter, showToast, subjectFilter]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const visibleNotes = useMemo(() => notes.filter((note) => note.heading.toLowerCase().includes(search.trim().toLowerCase())), [notes, search]);

  const closeComposer = () => {
    setIsComposerOpen(false);
    setEditingNote(null);
    setForm(blankNote);
    setFormError('');
  };

  const openComposer = (note = null) => {
    setEditingNote(note);
    setForm(note ? { ...blankNote, ...note } : { ...blankNote, semester: semesterFilter || '1' });
    setFormError('');
    setIsComposerOpen(true);
  };

  const openReader = (note) => {
    setViewingNote(note);
    setIsReaderFullscreen(false);
  };

  const closeReader = () => {
    setViewingNote(null);
    setIsReaderFullscreen(false);
  };

  const saveNote = async (event) => {
    event.preventDefault();
    if (!form.heading.trim()) {
      setFormError('Enter a heading for this note.');
      return;
    }
    setIsSaving(true);
    setFormError('');
    try {
      if (editingNote) await updateNote(editingNote.id, form);
      else await createNote(form);
      showToast(editingNote ? 'Note updated successfully.' : 'Note saved successfully.');
      closeComposer();
      await loadNotes();
    } catch (error) {
      setFormError(getApiError(error, 'Unable to save this note. Please try again.'));
    } finally {
      setIsSaving(false);
    }
  };

  const removeNote = async (note) => {
    if (!window.confirm(`Delete “${note.heading}”? This cannot be undone.`)) return;
    try {
      await deleteNote(note.id);
      setNotes((current) => current.filter((item) => item.id !== note.id));
      showToast('Note deleted.', 'info');
    } catch (error) {
      showToast(getApiError(error, 'Unable to delete this note.'), 'error');
    }
  };

  const handleDownload = async (note) => {
    setIsDownloading(note.id);
    try {
      await downloadNote(note);
      showToast('Your download has started.', 'info');
    } catch (error) {
      showToast(getApiError(error, 'Unable to download this file.'), 'error');
    } finally {
      setIsDownloading('');
    }
  };

  return (
    <section className="notes-page">
      <div className="page-title-row">
        <div><p className="eyebrow eyebrow--violet">NOTES & RESOURCES</p><h2>Study notes</h2><p>Keep subject notes and course documents in one organized place.</p></div>
        <button className="button button--primary" type="button" onClick={() => openComposer()}><FiPlus /> Add note</button>
      </div>

      <div className="notes-toolbar">
        <label className="search-field notes-search"><FiSearch aria-hidden="true" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by heading" aria-label="Search notes by heading" /></label>
        <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} aria-label="Filter notes by subject"><option value="">All subjects</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select>
        <select value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)} aria-label="Filter notes by semester"><option value="">All semesters</option>{semesters.map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}</select>
      </div>

      {isLoading ? <div className="notes-loading" role="status">Loading your notes…</div> : visibleNotes.length ? <div className="notes-grid">{visibleNotes.map((note) => <article className="note-card" key={note.id}>
        <div className="note-card__icon"><FiFileText /></div>
        <div className="note-card__head"><div><p>Semester {note.semester} · {note.subjectName}</p><h3>{note.heading}</h3></div><div className="note-card__actions"><button type="button" onClick={() => openReader(note)} aria-label={`Open ${note.heading}`} title="Open note"><FiExternalLink /></button><button type="button" onClick={() => openComposer(note)} aria-label={`Edit ${note.heading}`} title="Edit note"><FiEdit2 /></button><button type="button" onClick={() => removeNote(note)} aria-label={`Delete ${note.heading}`} title="Delete note"><FiTrash2 /></button></div></div>
        {note.content && <p className="note-card__content">{noteSummary(note.content)}</p>}
        <div className="note-card__footer"><small>Updated {formatUpdatedAt(note.updatedAt)}</small>{note.attachmentName ? <button className="note-download" type="button" onClick={() => handleDownload(note)} disabled={isDownloading === note.id}><FiDownload /> {isDownloading === note.id ? 'Preparing…' : `${note.attachmentName} · ${formatFileSize(note.attachmentSize)}`}</button> : <span className="note-card__no-file">No file attached</span>}</div>
      </article>)}</div> : <EmptyState title={search ? 'No notes match that heading' : 'No notes yet'} description={search ? 'Try a different heading or clear the search.' : 'Add a note to save study material by subject and semester.'} action={<button className="button button--primary" type="button" onClick={() => openComposer()}><FiPlus /> Add note</button>} />}

      {isComposerOpen && <div className="modal-layer" role="presentation"><section className="note-modal" role="dialog" aria-modal="true" aria-labelledby="note-modal-title"><button className="modal-close" type="button" onClick={closeComposer} aria-label="Close"><FiX /></button><p className="eyebrow eyebrow--violet">{editingNote ? 'UPDATE NOTEBOOK' : 'NEW NOTEBOOK'}</p><h2 id="note-modal-title">{editingNote ? 'Edit your note' : 'Write a study note'}</h2><p className="note-modal__intro">Organize your ideas with headings, lists, and key points. Add a PDF or DOCX only when you need an extra resource.</p>{formError && <p className="form-alert">{formError}</p>}
        <form onSubmit={saveNote} noValidate><label className="form-field"><span>Heading <b>*</b></span><input value={form.heading} onChange={(event) => setForm({ ...form, heading: event.target.value })} placeholder="e.g. Unit 3 revision notes" autoFocus /></label><div className="form-grid form-grid--two"><label className="form-field"><span>Subject</span><select value={form.subjectId} onChange={(event) => setForm({ ...form, subjectId: event.target.value })}><option value="">General note</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label><label className="form-field"><span>Semester</span><select value={form.semester} onChange={(event) => setForm({ ...form, semester: event.target.value })}>{semesters.map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}</select></label></div><NotebookEditor value={form.content} onChange={(content) => setForm({ ...form, content })} /><label className="attachment-input note-file-input"><FiUpload /><span><strong>{form.attachmentFile?.name || form.attachmentName || 'Attach a PDF or DOCX (optional)'}</strong><small>PDF or DOCX · up to 10 MB</small></span><input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { const attachmentFile = event.target.files?.[0] || null; setForm({ ...form, attachmentFile, attachmentName: attachmentFile?.name || form.attachmentName }); }} /></label><div className="form-actions"><button className="button button--ghost" type="button" onClick={closeComposer} disabled={isSaving}>Cancel</button><button className="button button--primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : editingNote ? 'Save changes' : 'Save note'}</button></div></form>
      </section></div>}
      {viewingNote && <div className={`modal-layer${isReaderFullscreen ? ' modal-layer--reader-fullscreen' : ''}`} role="presentation"><article className={`note-reader${isReaderFullscreen ? ' note-reader--fullscreen' : ''}`} role="dialog" aria-modal="true" aria-labelledby="note-reader-title"><div className="note-reader__controls"><button className="note-reader__fullscreen" type="button" onClick={() => setIsReaderFullscreen((isFullscreen) => !isFullscreen)} aria-label={isReaderFullscreen ? 'Exit full screen note view' : 'Open full screen note view'} title={isReaderFullscreen ? 'Exit full screen' : 'View full screen'}>{isReaderFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}</button><button className="modal-close" type="button" onClick={closeReader} aria-label="Close"><FiX /></button></div><p className="eyebrow eyebrow--violet">SEMESTER {viewingNote.semester} · {viewingNote.subjectName}</p><h2 id="note-reader-title">{viewingNote.heading}</h2><small>Updated {formatUpdatedAt(viewingNote.updatedAt)}</small><NoteContent content={viewingNote.content} className="note-reader__content" />{viewingNote.attachmentName && <button className="note-reader__download" type="button" onClick={() => handleDownload(viewingNote)} disabled={isDownloading === viewingNote.id}><FiDownload /> {isDownloading === viewingNote.id ? 'Preparing download…' : `Download ${viewingNote.attachmentName}`}</button>}</article></div>}
    </section>
  );
}

export default NotesPage;
