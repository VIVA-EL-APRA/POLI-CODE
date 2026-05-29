import { CODE_EXAMPLES } from '../data';

interface ExamplesProps {
  onLoadExample: (id: number) => void;
  activeExampleId: number | null;
}

export default function Examples({ onLoadExample, activeExampleId }: ExamplesProps) {
  return (
    <section className="mt-4">
      <h3 className="font-bold text-lg text-white mb-4 tracking-tight">
        Prueba un Ejemplo
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CODE_EXAMPLES.map((example) => {
          const isActive = activeExampleId === example.id;
          return (
            <button
              key={example.id}
              onClick={() => onLoadExample(example.id)}
              className={`glass-card p-5 rounded-xl text-left hover:bg-[#33353a]/60 hover:scale-[1.01] transition-all group duration-200 cursor-pointer ${
                isActive 
                  ? 'border-l-4 border-l-[#a6c8ff] bg-[#1e5799]/15' 
                  : 'border-[#424750]/30'
              }`}
            >
              <p className="font-bold text-sm text-[#e2e2e8] mb-1.5 group-hover:text-[#a6c8ff] transition-colors">
                {example.title}
              </p>
              <p className="text-xs text-[#c2c6d2] leading-relaxed line-clamp-2">
                {example.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
