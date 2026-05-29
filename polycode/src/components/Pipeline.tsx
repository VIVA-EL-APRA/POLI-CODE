import { PIPELINE_STEPS } from '../data';
import * as Icons from 'lucide-react';

interface PipelineProps {
  activeStep: number | null; // 1-6 during translation
  isTranslating: boolean;
}

export default function Pipeline({ activeStep, isTranslating }: PipelineProps) {
  return (
    <section className="mt-4">
      <h2 className="font-bold text-[11px] text-[#c2c6d2]/70 uppercase tracking-widest text-center mb-6">
        Pipeline de Procesamiento
      </h2>
      
      <div className="relative flex flex-wrap justify-center items-center gap-4">
        {/* Connection Dotted Lines for desktop views */}
        <div className="absolute inset-0 -z-10 pointer-events-none hidden lg:block">
          <svg className="opacity-20 w-full h-full" height="100%" width="100%">
            <line
              className={`stroke-[#a6c8ff] ${isTranslating ? 'pipeline-dash' : ''}`}
              strokeWidth="1.5"
              x1="5%"
              x2="95%"
              y1="50%"
              y2="50%"
              style={{ strokeDasharray: '4 4' }}
            />
          </svg>
        </div>

        {/* Pipeline Individual Cards */}
        {PIPELINE_STEPS.map((step) => {
          // Dynamic Lucide icon lookup
          const IconComponent = (Icons as any)[step.icon] || Icons.HelpCircle;
          const isActive = activeStep === step.id;
          const isDone = isTranslating && activeStep !== null && step.id < activeStep;

          return (
            <div
              key={step.id}
              className={`pipeline-card glass-card px-5 py-4 rounded-xl flex flex-col items-center gap-3 w-32 md:w-36 transition-all duration-300 ${
                isActive
                  ? 'border-[#a6c8ff] bg-[#1e5799]/20 shadow-[0_0_15px_rgba(166,200,255,0.15)] scale-105'
                  : isDone
                  ? 'border-[#4caf50]/40 bg-[#4caf50]/5 shadow-none'
                  : 'border-[#424750]/30 opacity-70'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#a6c8ff]/10 text-[#a6c8ff]' 
                  : isDone 
                  ? 'bg-green-500/10 text-green-400' 
                  : 'text-[#c2c6d2]/80'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                isActive 
                  ? 'text-[#a6c8ff]' 
                  : isDone 
                  ? 'text-green-400' 
                  : 'text-[#c2c6d2]/90'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
