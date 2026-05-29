import { Language } from './types';

export function highlightCode(code: string, lang: Language): string {
  if (!code) return '';

  // Split into lines and process each
  const lines = code.split('\n');
  
  const processLine = (line: string): string => {
    // Escape HTML first
    line = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Comments (full line takes priority)
    if (lang === 'Python' && /^\s*#/.test(line)) {
      return `<span class="hl-comment">${line}</span>`;
    }
    if (lang === 'JavaScript' && /^\s*\/\//.test(line)) {
      return `<span class="hl-comment">${line}</span>`;
    }

    // Strings - replace with placeholder to avoid double processing
    const stringPlaceholders: string[] = [];
    line = line.replace(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g, (match) => {
      const idx = stringPlaceholders.length;
      stringPlaceholders.push(`<span class="hl-string">${match}</span>`);
      return `\x00STR${idx}\x00`;
    });

    // Keywords
    const pyKeywords = ['def','class','if','elif','else','for','while','import','from',
      'as','return','None','True','False','try','except','finally','with','lambda',
      'pass','break','continue','yield','and','or','not','in','print','len','range'];
    const jsKeywords = ['function','const','let','var','return','if','else','for',
      'while','import','export','default','true','false','null','undefined','class',
      'this','try','catch','finally','async','await','switch','case','break',
      'continue','new','typeof','instanceof'];

    const keywords = lang === 'Python' ? pyKeywords : jsKeywords;
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    line = line.replace(kwRegex, '<span class="hl-keyword">$1</span>');

    // Numbers
    line = line.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="hl-number">$1</span>');

    // Function calls
    line = line.replace(/\b([a-zA-Z_]\w*)(?=\()/g, (match, name) => {
      if (keywords.includes(name)) return match;
      return `<span class="hl-func">${name}</span>`;
    });

    // Restore strings
    line = line.replace(/\x00STR(\d+)\x00/g, (_, idx) => stringPlaceholders[parseInt(idx)]);

    return line;
  };

  return lines.map(processLine).join('\n');
}

export function formatTimeSpan(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
           ' - ' + 
           date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  } catch (e) {
    return isoString;
  }
}
