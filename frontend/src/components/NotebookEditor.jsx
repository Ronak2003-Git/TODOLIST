import { useRef, useState } from 'react';
import { FiAlignLeft, FiBold, FiItalic, FiList, FiMessageSquare, FiType } from 'react-icons/fi';
import NoteContent from './NoteContent';

function NotebookEditor({ value, onChange }) {
  const editor = useRef(null);
  const [mode, setMode] = useState('write');

  const focusAt = (start, end = start) => {
    window.requestAnimationFrame(() => {
      editor.current?.focus();
      editor.current?.setSelectionRange(start, end);
    });
  };

  const wrapSelection = (before, after, placeholder) => {
    const input = editor.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || placeholder;
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    onChange(next);
    focusAt(start + before.length, start + before.length + selected.length);
  };

  const prefixLines = (prefix, numbered = false) => {
    const input = editor.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? value.length;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const selected = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd) || 'Write here';
    const formatted = selected.split('\n').map((line, index) => `${numbered ? `${index + 1}. ` : prefix}${line}`).join('\n');
    const next = `${value.slice(0, lineStart)}${formatted}${value.slice(lineEnd === -1 ? value.length : lineEnd)}`;
    onChange(next);
    focusAt(lineStart, lineStart + formatted.length);
  };

  return (
    <div className="notebook-editor">
      <div className="notebook-editor__head"><span>Write your note</span><div className="notebook-editor__tabs"><button className={mode === 'write' ? 'notebook-tab notebook-tab--active' : 'notebook-tab'} type="button" onClick={() => setMode('write')}>Write</button><button className={mode === 'preview' ? 'notebook-tab notebook-tab--active' : 'notebook-tab'} type="button" onClick={() => setMode('preview')}>Preview</button></div></div>
      {mode === 'write' && <><div className="notebook-toolbar" aria-label="Note formatting"><button type="button" onClick={() => prefixLines('## ')} title="Section heading"><FiType /> Heading</button><button type="button" onClick={() => wrapSelection('**', '**', 'bold text')} title="Bold text"><FiBold /></button><button type="button" onClick={() => wrapSelection('*', '*', 'italic text')} title="Italic text"><FiItalic /></button><button type="button" onClick={() => prefixLines('- ')} title="Bullet list"><FiList /></button><button type="button" onClick={() => prefixLines('', true)} title="Numbered list"><FiAlignLeft /></button><button type="button" onClick={() => prefixLines('> ')} title="Important quote"><FiMessageSquare /></button></div><textarea ref={editor} className="notebook-editor__input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={'Write freely, just like a notebook.\n\nUse the toolbar to organize your ideas into headings, bullet lists, numbered steps, and key quotes.'} rows="14" aria-label="Note content" /></>}
      {mode === 'preview' && <div className="notebook-preview"><NoteContent content={value} /></div>}
      <small className="notebook-editor__hint">Tip: use **bold**, *italic*, # headings, - bullets, 1. steps, or &gt; key points.</small>
    </div>
  );
}

export default NotebookEditor;
