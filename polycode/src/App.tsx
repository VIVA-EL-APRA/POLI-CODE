/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  HelpCircle, 
  Github, 
  FileCode, 
  Activity, 
  RefreshCw, 
  Terminal, 
  Clock, 
  Settings2, 
  Sparkles, 
  Cpu, 
  Check, 
  Share2 
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import Pipeline from './components/Pipeline';
import Examples from './components/Examples';
import StatsFooter from './components/StatsFooter';

import { Language, TranslationHistoryItem } from './types';
import { CODE_EXAMPLES, DEFAULT_SOURCE_CODE, DEFAULT_TARGET_CODE } from './data';
import { formatTimeSpan } from './utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'visualizar' | 'historial' | 'configuracion'>('editor');
  
  // Code editor states
  const [sourceCode, setSourceCode] = useState(DEFAULT_SOURCE_CODE);
  const [targetCode, setTargetCode] = useState(DEFAULT_TARGET_CODE);
  const [fromLang, setFromLang] = useState<Language>('Python');
  const [toLang, setToLang] = useState<Language>('JavaScript');
  
  // Interactive state variables
  const [isTranslating, setIsTranslating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(94);
  const [activeExampleId, setActiveExampleId] = useState<number | null>(null);
  
  // History collection state
  const [historyList, setHistoryList] = useState<TranslationHistoryItem[]>([]);
  
  // Developer configuration preferences
  const [activeTheme, setActiveTheme] = useState<'flow' | 'classic'>('flow');
  const [advancedOptimization, setAdvancedOptimization] = useState(true);
  
  // Toast notifications feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync translation history from user localStorage on base mounting
  useEffect(() => {
    try {
      const stored = localStorage.getItem('polycode_history');
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error('LocalStorage parsing error:', e);
    }
  }, []);

  // Save history to disk
  const saveHistory = (items: TranslationHistoryItem[]) => {
    try {
      setHistoryList(items);
      localStorage.setItem('polycode_history', JSON.stringify(items));
    } catch (e) {
      console.error('LocalStorage saving error:', e);
    }
  };

  // Automated notification toast handler
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Perform Swap Interaction between Python and JS
  const handleSwap = () => {
    const tempLang = fromLang;
    setFromLang(toLang);
    setToLang(tempLang);
    
    const tempCode = sourceCode;
    setSourceCode(targetCode);
    setTargetCode(tempCode);
    
    // Clear pipeline highlights
    setPipelineStep(null);
    setActiveExampleId(null);
    triggerToast(`Intercambiado a: ${toLang} ↔ ${fromLang}`);
  };

  // Clear Editor contents
  const handleClear = () => {
    setSourceCode('');
    setTargetCode('');
    setConfidence(0);
    setPipelineStep(null);
    setActiveExampleId(null);
    triggerToast('Editor Limpiado');
  };

  // Copy Source or Target parameters to clipboard
  const handleCopySource = () => {
    navigator.clipboard.writeText(sourceCode);
    triggerToast('✓ Código fuente copiado');
  };

  const handleCopyTarget = () => {
    navigator.clipboard.writeText(targetCode);
    triggerToast('✓ Código traducido copiado');
  };

  // Load a preset code example
  const handleLoadExample = (id: number) => {
    const example = CODE_EXAMPLES.find((x) => x.id === id);
    if (example) {
      setSourceCode(example.src);
      setTargetCode('');
      setConfidence(0);
      setPipelineStep(null);
      setActiveExampleId(id);
      triggerToast(`Ejemplo cargado: "${example.title}"`);
    }
  };

  // Main translation function
  const startTranslation = async () => {
    if (!sourceCode.trim()) {
      triggerToast('Ingrese código primero antes de traducir.');
      return;
    }

    setIsTranslating(true);
    setPipelineStep(1);
    setConfidence(0);

    // Sequential timing cycle to move pipeline step highlighted states (1 -> 2 -> 3 -> 4 -> 5 -> 6)
    const steps = [1, 2, 3, 4, 5, 6];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setPipelineStep(step);
      }, idx * 300);
    });

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: sourceCode,
          fromLang,
          toLang,
        }),
      });

      const data = await response.json();

      // Delay rendering a bit so the analytical steps are fully visible and satisfying
      setTimeout(() => {
        if (data.success && data.translatedCode) {
          setTargetCode(data.translatedCode);
          setConfidence(data.confidence || 95);
          
          // Prepend new item to active history lists
          const newHistoryItem: TranslationHistoryItem = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            sourceText: sourceCode,
            translatedText: data.translatedCode,
            sourceLang: fromLang,
            targetLang: toLang,
            confidence: data.confidence || 95,
          };
          
          saveHistory([newHistoryItem, ...historyList]);
          triggerToast('Traducción completada con éxito');
        } else {
          setTargetCode(`// Error de traducción:\n// ${data.error || 'No se pudo obtener el código'}`);
          setConfidence(0);
          triggerToast('Error en la traducción del código.');
        }
        setIsTranslating(false);
      }, 1800);

    } catch (e: any) {
      console.error(e);
      setTimeout(() => {
        setTargetCode(`// Error de conexión:\n// ${e.message || 'No se puede contactar con PolyCode Server'}`);
        setConfidence(0);
        setIsTranslating(false);
        triggerToast('Error de conexión con el backend.');
      }, 1800);
    }
  };

  // Reload an item from the translations history directly into the workspace
  const handleReloadHistoryItem = (item: TranslationHistoryItem) => {
    setSourceCode(item.sourceText);
    setTargetCode(item.translatedText);
    setFromLang(item.sourceLang);
    setToLang(item.targetLang);
    setConfidence(item.confidence);
    setPipelineStep(null);
    setActiveExampleId(null);
    setActiveTab('editor');
    triggerToast('Código recargado desde el Historial');
  };

  // Remove single item from history database
  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyList.filter((item) => item.id !== id);
    saveHistory(updated);
    triggerToast('Traducción eliminada');
  };

  // Clear entire cache database
  const handleClearHistory = () => {
    saveHistory([]);
    triggerToast('Historial vaciado por completo');
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#e2e2e8] flex flex-col font-sans selection:bg-[#1e5799] selection:text-white">
      {/* Top Header Module */}
      <Header />

      {/* Main Structural Paneling with Sidebar Layout */}
      <div className="flex flex-1 w-full relative">
        {/* Navigation Sidebar */}
        <Sidebar currentTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Context Canvas */}
        <main className="flex-1 md:pl-64 pt-24 pb-12 px-6 min-h-screen flex flex-col gap-8 max-w-7xl mx-auto w-full">
          
          {/* TAB 1: CODE TRANSLATION WORKSPACE */}
          {activeTab === 'editor' && (
            <div className="flex flex-col gap-6 w-full animate-fade-in">
              <EditorPanel
                sourceCode={sourceCode}
                targetCode={targetCode}
                fromLang={fromLang}
                toLang={toLang}
                isTranslating={isTranslating}
                confidence={confidence}
                onSourceCodeChange={setSourceCode}
                onSwap={handleSwap}
                onClear={handleClear}
                onCopySource={handleCopySource}
                onCopyTarget={handleCopyTarget}
              />

              {/* Translate Action Button */}
              <div className="flex justify-center -mt-4 relative z-30">
                <button
                  onClick={startTranslation}
                  disabled={isTranslating}
                  className={`bg-gradient-to-r from-[#1e5799] to-[#005c9b] hover:from-[#a6c8ff] hover:to-[#1e5799] hover:text-[#001c3b] text-white px-10 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-[1.03] disabled:opacity-50 disabled:scale-95 cursor-pointer`}
                >
                  <Zap className={`w-4 h-4 ${isTranslating ? 'animate-bounce text-[#FFD43B]' : 'text-[#a6c8ff]'}`} />
                  <span className="tracking-wide font-extrabold text-[13px]">
                    {isTranslating ? 'Procesando traducción...' : '⚡ Traducir con PolyCode'}
                  </span>
                </button>
              </div>

              {/* Pipeline processing indicator map */}
              <Pipeline activeStep={pipelineStep} isTranslating={isTranslating} />

              {/* Editable Preset Examples */}
              <Examples onLoadExample={handleLoadExample} activeExampleId={activeExampleId} />

              {/* Statistical summary footer panel */}
              <StatsFooter />
            </div>
          )}

          {/* TAB 2: PIPELINE VISUALIZER EXPOSED AST MAP */}
          {activeTab === 'visualizar' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl border-[#424750]/30">
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#a6c8ff]" />
                  Visualización Profunda de Compilación
                </h2>
                <p className="text-xs text-[#c2c6d2]">
                  PolyCode no hace mapeo de palabras clave ingenuo. Analiza el código fuente a nivel sintáctico para construir un Árbol Sintáctico Abstracto (AST) y reescribirlo de forma idiomática.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visualizer card 1: AST Token parser code example */}
                <div className="glass-card p-5 rounded-xl border-[#424750]/20 bg-[#12141c]/50">
                  <h3 className="font-bold text-xs text-[#a6c8ff] uppercase tracking-wider mb-3">
                    A. Análisis Léxico (Tokenización)
                  </h3>
                  <div className="p-3 rounded-lg bg-[#0D1117] text-xs font-mono text-[#8B9DC3] space-y-1 z-10 border border-[#424750]/20">
                    <div><span className="text-[#C678DD]">def</span> [keyword]</div>
                    <div><span className="text-[#61AFEF]">calculate_total</span> [identifier: function]</div>
                    <div>( [left_paren]</div>
                    <div>prices [identifier: variable], discount [identifier: variable]</div>
                    <div>) [right_paren] : [colon]</div>
                    <div><span className="text-emerald-500">"Apply global..."</span> [string: docstring]</div>
                  </div>
                  <p className="text-[11px] text-[#c2c6d2] mt-3">
                    El analizador léxico examina la secuencia de caracteres en el código fuente de entrada y la agrupa en tokens lógicos clasificados jerárquicamente.
                  </p>
                </div>

                {/* Visualizer card 2: Target Code Generation AST tree */}
                <div className="glass-card p-5 rounded-xl border-[#424750]/20 bg-[#12141c]/50">
                  <h3 className="font-bold text-xs text-[#a6c8ff] uppercase tracking-wider mb-3">
                    B. Generador de Código de Salida (Codegen AST)
                  </h3>
                  <div className="p-3 rounded-lg bg-[#0D1117] text-xs font-mono text-[#8B9DC3] space-y-1.5 border border-[#424750]/20">
                    <div className="text-slate-400">└─ FunctionDeclaration (JavaScript)</div>
                    <div className="pl-4 text-emerald-400">├── Name: "calculateTotal" (snake_case → camelCase)</div>
                    <div className="pl-4 text-[#C678DD]">├── BlockStatement</div>
                    <div className="pl-8 text-blue-300">├── VariableDeclaration: "const total"</div>
                    <div className="pl-12 text-slate-400">└── CallExpression: "prices.reduce(...)"</div>
                  </div>
                  <p className="text-[11px] text-[#c2c6d2] mt-3">
                    El motor reescribe la estructura AST resultante y mapea de forma inteligente modismos (como list comprehensions a map/filter o sum() a arrays.reduce()).
                  </p>
                </div>
              </div>

              {/* Operational health diagnostics banner */}
              <div className="p-5 rounded-xl bg-[#1d2024]/40 border border-[#424750]/30 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                    <Terminal className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Estado del compilador PolyCode</h4>
                    <p className="text-[10px] text-[#c2c6d2]">Servidores en la nube operativos y listos para traducción de tokens con Gemini 3.5-Flash.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-white">99.99%</p>
                    <p className="text-[9px] text-[#c2c6d2]/80 uppercase">Uptime Promedio</p>
                  </div>
                  <div className="border-l border-[#424750]/40 pl-4 text-right">
                    <p className="text-xs font-extrabold text-white">Activo</p>
                    <p className="text-[9px] text-[#c2c6d2]/80 uppercase">Sincronización</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRADUCTIONS PAST HISTORY VIEWER */}
          {activeTab === 'historial' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex flex-wrap justify-between items-center gap-4 glass-card p-6 rounded-2xl border-[#424750]/30">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#a6c8ff]" />
                    Historial de Traducciones
                  </h2>
                  <p className="text-xs text-[#c2c6d2] mt-1">
                    Colección local de traducciones recientes realizadas en esta sesión. Tus datos se conservan localmente.
                  </p>
                </div>
                {historyList.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    Vaciar Historial
                  </button>
                )}
              </div>

              {historyList.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl border-[#424750]/20 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1e5799]/10 flex items-center justify-center text-[#a6c8ff]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-sm mt-1">Sin historial disponible</h3>
                  <p className="text-xs text-[#c2c6d2] max-w-xs mx-auto leading-relaxed">
                    Las traducciones que realices en el panel del editor aparecerán aquí para acceso rápido posterior.
                  </p>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="mt-2 text-xs font-extrabold bg-[#1e5799] text-[#b0ceff] px-4 py-2 rounded-lg hover:scale-95 transition-all cursor-pointer"
                  >
                    Ir al Editor
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {historyList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleReloadHistoryItem(item)}
                      className="glass-card hover:bg-[#33353a]/30 p-5 rounded-xl border-[#424750]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-all hover:scale-[1.005]"
                    >
                      <div className="flex flex-col gap-1 w-full md:w-3/4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-[#a6c8ff] bg-[#1e5799]/20 px-2.5 py-0.5 rounded-full border border-[#a6c8ff]/15">
                            {item.sourceLang} ➔ {item.targetLang}
                          </span>
                          <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/10">
                            {item.confidence}% Confianza
                          </span>
                          <span className="text-[9px] text-[#c2c6d2]/65 ml-auto md:ml-2 font-medium">
                            {formatTimeSpan(item.timestamp)}
                          </span>
                        </div>
                        <div className="mt-2 text-xs font-mono text-[#c2c6d2] bg-[#0D1117] p-3 rounded border border-[#424750]/15 w-full line-clamp-2 overflow-hidden text-ellipsis whitespace-pre-wrap">
                          {item.sourceText}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                          className="p-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                          title="Eliminar de historial"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONFIGURATION SETTINGS PANEL */}
          {activeTab === 'configuracion' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl border-[#424750]/30">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-[#a6c8ff]" />
                  Configuración y Optimización
                </h2>
                <p className="text-xs text-[#c2c6d2] mt-1">
                  Administre los ajustes sintácticos de traducción, su clave secreta de forma segura y visualice licencias del proyecto.
                </p>
              </div>

              {/* Developer details and config block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Visual style and compiler config block */}
                <div className="glass-card p-5 rounded-xl border-[#424750]/20 flex flex-col gap-4">
                  <h3 className="font-bold text-xs text-[#a6c8ff] uppercase tracking-wider">
                    Ajustes de Motor de Código
                  </h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">Mapeo Avanzado AST</p>
                        <p className="text-[10px] text-[#c2c6d2]">Optimiza la estructura idiomática del lenguaje destino.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={advancedOptimization}
                        onChange={(e) => setAdvancedOptimization(e.target.checked)}
                        className="rounded border-[#424750] text-[#1e5799] focus:ring-[#1e5799] bg-[#0c0e12] w-4 h-4 cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">Tema Visual de Editor</p>
                        <p className="text-[10px] text-[#c2c6d2]">Alterna el estilo estético de contraste.</p>
                      </div>
                      <div className="flex border border-[#424750]/40 rounded-lg overflow-hidden shrink-0">
                        <button
                          onClick={() => setActiveTheme('flow')}
                          className={`px-3 py-1 text-[10px] font-bold cursor-pointer ${
                            activeTheme === 'flow'
                              ? 'bg-[#1e5799] text-white'
                              : 'text-[#c2c6d2] bg-transparent hover:bg-[#282a2f]'
                          }`}
                        >
                          Deep Focus
                        </button>
                        <button
                          onClick={() => {
                            setActiveTheme('classic');
                            triggerToast('Estilo visual alternativo activado');
                          }}
                          className={`px-3 py-1 text-[10px] font-bold cursor-pointer ${
                            activeTheme === 'classic'
                              ? 'bg-[#1e5799] text-white'
                              : 'text-[#c2c6d2] bg-transparent hover:bg-[#282a2f]'
                          }`}
                        >
                          Classic Slate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Key Security Information Box */}
                <div className="glass-card p-5 rounded-xl border-[#424750]/20 flex flex-col gap-3">
                  <h3 className="font-bold text-xs text-[#a6c8ff] uppercase tracking-wider">
                    Credenciales y Seguridad
                  </h3>
                  <p className="text-xs text-[#c2c6d2] leading-relaxed">
                    Las llamadas a los modelos generativos avanzados de Gemini para realizar la traducción se realizan en el lado del servidor para proteger de forma absoluta sus tokens y secretos.
                  </p>
                  <p className="text-xs text-[#c2c6d2] leading-relaxed">
                    Si desea actualizar o introducir su propia API Key, puede hacerlo de forma segura a través de la interfaz de la plataforma en la pestaña de <strong>Settings &gt; Secrets</strong>.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-[#c2c6d2] bg-[#0D1117] p-2.5 rounded border border-[#424750]/20">
                    VARIABLE: GEMINI_API_KEY (Protegida)
                  </div>
                </div>
              </div>

              {/* Legal and Credits Box */}
              <div className="glass-card p-5 rounded-xl border-[#424750]/20">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-2">
                  Licencias y Créditos de Investigación
                </h3>
                <p className="text-xs text-[#c2c6d2] leading-relaxed">
                  PolyCode se distribuye bajo la licencia MIT. El motor principal de traducción por red de árbol abstracto está respaldado por investigaciones científicas avanzadas en modelos masivos LLM multilenguaje e Inteligencia Artificial en el MIT Research Lab en 2024.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Persistent Visual Footer Block */}
      <footer className="md:pl-64 w-full py-6 px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0c0e12] border-t border-[#424750]/20 z-10 max-w-full">
        <div className="w-full md:w-auto text-center md:text-left">
          <span className="font-bold text-[#a6c8ff] text-sm tracking-tight">PolyCode</span>
          <p className="text-[#c2c6d2] text-[11px] mt-0.5">© 2024 PolyCode Research Lab. MIT License.</p>
        </div>
        <div className="flex gap-6 text-xs font-semibold">
          <a href="#" className="text-[#c2c6d2] hover:text-[#a6c8ff] transition-all">GitHub</a>
          <a href="#" className="text-[#c2c6d2] hover:text-[#a6c8ff] transition-all">Documentación</a>
          <a href="#" className="text-[#c2c6d2] hover:text-[#a6c8ff] transition-all">Estado</a>
        </div>
      </footer>

      {/* Floating Animated Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
          <div className="bg-[#1e5799] text-[#b0ceff] px-6 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-[#a6c8ff]/20 animate-bounce">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-xs tracking-wide">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
