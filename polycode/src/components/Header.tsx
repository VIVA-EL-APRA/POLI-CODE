import { Github, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#111318] border-b border-[#424750]/40">
      <div className="flex items-center gap-4">
        {/* PolyCode Logo Grid Icon */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#1e5799] to-[#a6c8ff] flex items-center justify-center shadow-lg shadow-[#1e5799]/20">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#a6c8ff] tracking-tight leading-none flex items-center gap-2">
            PolyCode
          </h1>
          <p className="text-[11px] text-[#c2c6d2]/80 mt-1 leading-none font-medium">
            Traduce código. No lógica.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#c2c6d2] hover:text-[#a6c8ff] transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
        <button className="bg-[#1e5799] text-[#b0ceff] px-4 py-1.5 rounded-lg text-xs font-bold hover:scale-95 transition-all duration-150 active:translate-y-px">
          Docs
        </button>
      </div>
    </header>
  );
}
