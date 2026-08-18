function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function blockType(line) {
  if (/^#{1,3}\s+/.test(line)) return 'heading';
  if (/^[-*]\s+/.test(line)) return 'bullet';
  if (/^\d+\.\s+/.test(line)) return 'numbered';
  if (/^>\s?/.test(line)) return 'quote';
  return 'paragraph';
}

export function noteSummary(content) {
  return content
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function NoteContent({ content, className = '' }) {
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    const type = blockType(line);

    if (type === 'heading') {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      const Level = `h${Math.min(match[1].length + 2, 5)}`;
      blocks.push(<Level key={`heading-${index}`}>{renderInline(match[2])}</Level>);
      index += 1;
      continue;
    }

    if (type === 'bullet' || type === 'numbered') {
      const items = [];
      const expression = type === 'bullet' ? /^[-*]\s+(.*)$/ : /^\d+\.\s+(.*)$/;
      while (index < lines.length) {
        const match = lines[index].match(expression);
        if (!match) break;
        items.push(<li key={`item-${index}`}>{renderInline(match[1])}</li>);
        index += 1;
      }
      blocks.push(type === 'bullet' ? <ul key={`list-${index}`}>{items}</ul> : <ol key={`list-${index}`}>{items}</ol>);
      continue;
    }

    if (type === 'quote') {
      const quoteLines = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(<blockquote key={`quote-${index}`}>{renderInline(quoteLines.join(' '))}</blockquote>);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && blockType(lines[index]) === 'paragraph') {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraph.join(' '))}</p>);
  }

  return <div className={`note-content ${className}`.trim()}>{blocks.length ? blocks : <p className="note-content__empty">Start writing your note here.</p>}</div>;
}

export default NoteContent;
