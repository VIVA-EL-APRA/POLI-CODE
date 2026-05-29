import { Language } from './types';

/**
 * Perform elegant client-side regex-based syntax highlighting for dark-mode.
 */
export function highlightCode(code: string, lang: Language): string {
  if (!code) return '';

  // 1. Double escape HTML characters to prevent XSS and rendering errors
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Highlighting Comments
  if (lang === 'Python') {
    html = html.replace(/(#.*)$/gm, '<span class="hl-comment">$1</span>');
    // Multi-line docstrings as comments
    html = html.replace(/(""";[\s\S]*?""")|("""[\s\S]*?""")|(\'\'\'[\s\S]*?\'\'\')/g, '<span class="hl-comment">$1</span>');
  } else {
    // Single line JS comments
    html = html.replace(/(\/\/.*)$/gm, '<span class="hl-comment">$1</span>');
    // Multi-line header doc comments
    html = html.replace(/(\/\*\*[\s\S]*?\*\/|\/\*[\s\S]*?\*\/)/g, '<span class="hl-comment">$1</span>');
  }

  // 3. Highlighting Strings (without overriding comments)
  // Match normal strings that are not surrounded by comment tags
  html = html.replace(/(["'`])(.*?)\1/g, '<span class="hl-string">$1$2$1</span>');

  // 4. Highlighting Keywords
  const pyKeywords = [
    'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 
    'print', 'sum', 'len', 'and', 'or', 'not', 'in', 'return', 'None', 'True', 'False',
    'try', 'except', 'finally', 'with', 'lambda', 'pass', 'break', 'continue', 'yield'
  ];
  
  const jsKeywords = [
    'function', 'const', 'let', 'var', 'constructor', 'new', 'console', 'log', 
    'reduce', 'filter', 'map', 'return', 'if', 'else', 'for', 'while', 'import', 
    'export', 'default', 'true', 'false', 'null', 'undefined', 'class', 'this',
    'try', 'catch', 'finally', 'async', 'await', 'switch', 'case', 'break', 'continue'
  ];

  const keywordsList = lang === 'Python' ? pyKeywords : jsKeywords;
  
  // Highlighting key functions & keywords
  const kwRegex = new RegExp(`\\b(${keywordsList.join('|')})\\b`, 'g');
  html = html.replace(kwRegex, (match) => `<span class="hl-keyword">${match}</span>`);

  // 5. Highlighting Numbers
  html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="hl-number">$1</span>');

  // 6. Highlighting function invocations (words followed by parenthesis)
  html = html.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="hl-func">$1</span>');

  return html;
}

/**
 * Format timestamps into Spanish readable values
 */
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
