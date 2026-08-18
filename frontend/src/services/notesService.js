import api from './api';

export function normaliseNote(note) {
  return {
    id: String(note.id),
    subjectId: note.subject_id ? String(note.subject_id) : '',
    subjectName: note.subject_name || 'General',
    semester: String(note.semester),
    heading: note.heading,
    content: note.content || '',
    attachmentName: note.attachment_name || '',
    attachmentSize: note.attachment_size || 0,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
  };
}

function notePayload(note) {
  const form = new FormData();
  form.append('heading', note.heading.trim());
  form.append('semester', note.semester);
  form.append('content', note.content?.trim() || '');
  if (note.subjectId) form.append('subject_id', note.subjectId);
  if (note.attachmentFile) form.append('attachment', note.attachmentFile);
  return form;
}

export async function getNotes({ subjectId, semester } = {}) {
  const response = await api.get('/notes/', { params: { subject: subjectId || undefined, semester: semester || undefined } });
  return response.data.map(normaliseNote);
}

export async function createNote(note) {
  const response = await api.post('/notes/', notePayload(note));
  return normaliseNote(response.data);
}

export async function updateNote(id, note) {
  const response = await api.put(`/notes/${id}/`, notePayload(note));
  return normaliseNote(response.data);
}

export async function deleteNote(id) {
  await api.delete(`/notes/${id}/`);
}

export async function downloadNote(note) {
  const response = await api.get(`/notes/${note.id}/download/`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = note.attachmentName || `note-${note.id}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
