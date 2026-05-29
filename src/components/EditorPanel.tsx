import { useState, useEffect, useRef } from 'react';
import { Trash2, Copy, Search, ArrowRightLeft, Check } from 'lucide-react';
import { Language } from '../types';
import { highlightCode } from '../utils';

interface EditorPanelProps {
  sourceCode: string;
  targetCode: string;
  fromLang: Language;
  toLang: Language;
  isTranslating: boolean;
  confidence: number;
  onSourceCodeChange: (code: string) => void;
  onSwap: () => void;
  onClear: () => void;
  onCopySource: () => void;
  onCopyTarget: () => void;
}

export default function EditorPanel({
  sourceCode,
  targetCode,
  fromLang,
  toLang,
  isTranslating,
  confidence,
  onSourceCodeChange,
  onSwap,
  onClear,
  onCopySource,
  onCopyTarget,
}: EditorPanelProps) {
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [detectedLang, setDetectedLang] = useState<Language>('Python');

  // Trigger copy feed animations
  const handleCopySource = () => {
    onCopySource();
    setCopiedSource(true);
    setTimeout(() => setCopiedSource(false), 2000);
  };

  const handleCopyTarget = () => {
    onCopyTarget();
    setCopiedTarget(true);
    setTimeout(() => setCopiedTarget(false), 2000);
  };

  // Automated language detection
  useEffect(() => {
    const trimmed = sourceCode.trim();
    if (trimmed.includes('def ') || trimmed.includes('class ') || trimmed.includes('import ') || trimmed.includes('print(')) {
      setDetectedLang('Python');
    } else if (trimmed.includes('function') || trimmed.includes('const ') || trimmed.includes('let ') || trimmed.includes('console.log')) {
      setDetectedLang('JavaScript');
    }
  }, [sourceCode]);

  // Generate line numbers (minimum 11 lines to match design reference)
  const getLineNumbers = (code: string) => {
    const lines = code.split('\n').length;
    const maxLines = Math.max(lines, 11);
    return Array.from({ length: maxLines }, (_, i) => i + 1);
  };

  const sourceLines = getLineNumbers(sourceCode);
  const targetLines = getLineNumbers(targetCode);

  return (
    <div className="flex flex-col gap-6">
      {/* Language Selector Pill */}
      <div className="flex justify-center">
        <div className="glass-card rounded-full p-1 flex items-center gap-1 shadow-lg border-[#424750]/30 bg-[#1d2024]/80">
          <div
            id="source-lang-pill"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-300 ${
              fromLang === 'Python' ? 'glow-python bg-[#282a2f]/50' : 'glow-js bg-[#282a2f]/50'
            }`}
          >
            {fromLang === 'Python' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD43B]" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-[#F7DF1E]" />
            )}
            <span className="text-xs font-bold text-white tracking-wide">{fromLang}</span>
          </div>

          <button
            onClick={onSwap}
            className="w-10 h-10 rounded-full bg-[#1e5799] text-[#b0ceff] hover:bg-[#a6c8ff] hover:text-[#003060] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Intercambiar Lenguajes"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div
            id="target-lang-pill"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-300 ${
              toLang === 'Python' ? 'glow-python bg-[#282a2f]/50' : 'glow-js bg-[#282a2f]/50'
            }`}
          >
            {toLang === 'Python' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD43B]" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-[#F7DF1E]" />
            )}
            <span className="text-xs font-bold text-white tracking-wide">{toLang}</span>
          </div>
        </div>
      </div>

      {/* Dual Panel Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow w-full">
        {/* Source Panel */}
        <div className="flex flex-col glass-card rounded-xl overflow-hidden shadow-2xl border-[#424750]/40">
          {/* Panel Header */}
          <div className="bg-[#282a2f] px-4 py-3 flex justify-between items-center border-b border-[#424750]/40">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  fromLang === 'Python' ? 'bg-[#FFD43B]' : 'bg-[#F7DF1E]'
                }`}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c2c6d2]">
                Código Fuente ({fromLang})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onClear}
                className="text-[#c2c6d2] hover:text-white hover:bg-[#33353a] p-1.5 rounded transition-all duration-150"
                title="Limpiar Editor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopySource}
                className="text-[#c2c6d2] hover:text-white hover:bg-[#33353a] p-1.5 rounded transition-all duration-150"
                title="Copiar Código"
              >
                {copiedSource ? (
                  <Check className="w-4 h-4 text-green-400 animate-pulse" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Code Container */}
          <div className="editor-bg p-4 flex-grow font-mono text-sm flex gap-4 min-h-[380px] relative overflow-hidden">
            {/* Line Numbers Column */}
            <div className="text-[#424750] select-none text-right w-8 border-r border-[#424750]/20 pr-2.5 font-mono text-xs leading-6 min-h-[350px]">
              {sourceLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>

            {/* Editing and Highlighting Layer */}
            <div className="relative flex-grow w-full h-full min-h-[350px]">
              <textarea
                value={sourceCode}
                onChange={(e) => onSourceCodeChange(e.target.value)}
                className="absolute inset-0 bg-transparent border-none focus:ring-0 p-0 text-transparent caret-white outline-none w-full h-full resize-none z-10 font-mono text-xs leading-6 overflow-y-auto"
                spellCheck="false"
                placeholder={
                  fromLang === 'Python'
                    ? '# Escribe o pega tu código Python aquí...'
                    : '// Escribe o pega tu código JavaScript aquí...'
                }
              />
              <pre
                className="absolute inset-0 text-slate-300 pointer-events-none z-0 font-mono text-xs leading-6 whitespace-pre overflow-y-auto w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: highlightCode(sourceCode, fromLang),
                }}
              />
            </div>
          </div>

          {/* Language Detection Status Bar */}
          <div className="bg-[#191c20] px-4 py-2 border-t border-[#424750]/20 flex items-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#33353a]/40 border border-[#424750]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-bold text-[#c2c6d2] flex items-center gap-1.5">
                <Search className="w-3 h-3 text-[#a6c8ff]" />
                Lenguaje detectado: <span className="text-[#a6c8ff] font-bold">{detectedLang}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Translation Panel */}
        <div className="flex flex-col glass-card rounded-xl overflow-hidden shadow-2xl relative border-[#424750]/40">
          {/* Skeleton Loader Overlay during translation */}
          {isTranslating && (
            <div className="absolute inset-0 z-20 bg-[#0D1117] p-5 flex flex-col gap-4">
              <div className="flex gap-4 h-full">
                <div className="w-8 h-full border-r border-[#424750]/25" />
                <div className="flex-grow flex flex-col gap-4 pt-2">
                  <div className="h-4 w-3/4 skeleton-shimmer" />
                  <div className="h-4 w-1/2 skeleton-shimmer" />
                  <div className="h-4 w-5/6 skeleton-shimmer" />
                  <div className="h-4 w-2/3 skeleton-shimmer" />
                  <div className="h-28 w-full skeleton-shimmer opacity-40" />
                  <div className="h-4 w-1/2 skeleton-shimmer" />
                  <div className="h-4 w-3/4 skeleton-shimmer" />
                </div>
              </div>
            </div>
          )}

          {/* Panel Header */}
          <div className="bg-[#282a2f] px-4 py-3 flex justify-between items-center border-b border-[#424750]/40">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  toLang === 'Python' ? 'bg-[#FFD43B]' : 'bg-[#F7DF1E]'
                }`}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c2c6d2]">
                Traducción ({toLang})
              </span>
            </div>

            <div className="flex items-center gap-4 flex-grow justify-end pr-1">
              {/* Animated Confidence Meter */}
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-extrabold text-[#c2c6d2] uppercase tracking-tighter">
                  Confianza
                </span>
                <div className="w-24 h-1.5 bg-[#424750]/40 rounded-full overflow-hidden">
                  <div
                    id="confidence-bar"
                    style={{ width: `${confidence}%` }}
                    className={`h-full transition-all duration-1000 ${
                      confidence >= 90
                        ? 'bg-[#4caf50]'
                        : confidence >= 75
                        ? 'bg-[#ffc107]'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-extrabold text-[#a6c8ff] w-8">
                  {confidence}%
                </span>
              </div>

              <div className="h-4 w-[1px] bg-[#424750]/50" />

              <button
                onClick={handleCopyTarget}
                className="flex items-center gap-1.5 text-[#a6c8ff] hover:text-white font-extrabold text-[10px] tracking-wider px-2.5 py-1 rounded hover:bg-[#1e5799]/15 transition-all cursor-pointer"
              >
                {copiedTarget ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400 animate-bounce" />
                    <span>¡COPIADO!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPIAR CÓDIGO</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Translation Output Container */}
          <div className="editor-bg p-4 flex-grow font-mono text-sm flex gap-4 min-h-[380px] relative overflow-hidden">
            {/* Line Numbers Column */}
            <div className="text-[#424750] select-none text-right w-8 border-r border-[#424750]/20 pr-2.5 font-mono text-xs leading-6 min-h-[350px]">
              {targetLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>

            {/* Output code formatted */}
            <div className="relative flex-grow w-full h-full min-h-[350px]">
              <pre
                className="absolute inset-0 text-[#8B9DC3] font-mono text-xs leading-6 whitespace-pre overflow-y-auto w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: highlightCode(targetCode, toLang),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
