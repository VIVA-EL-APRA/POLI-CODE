import { Code, Eye, History, Settings } from 'lucide-react';

interface SidebarProps {
  currentTab: 'editor' | 'visualizar' | 'historial' | 'configuracion';
  onTabChange: (tab: 'editor' | 'visualizar' | 'historial' | 'configuracion') => void;
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'editor' as const, label: 'Editor', icon: Code },
    { id: 'visualizar' as const, label: 'Visualizar', icon: Eye },
    { id: 'historial' as const, label: 'Historial', icon: History },
    { id: 'configuracion' as const, label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-60 flex flex-col gap-4 p-4 bg-[#1d2024] border-r border-[#424750]/40 pt-24 z-40 hidden md:flex">
      <div className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full rounded-lg font-bold p-3 flex items-center gap-3 transition-all duration-200 text-left ${
                isActive
                  ? 'bg-[#005c9b] text-[#b2d4ff] shadow-md border-r-4 border-[#a6c8ff]'
                  : 'text-[#c2c6d2] hover:bg-[#33353a] hover:text-[#e2e2e8]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-xs md:inline tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-[#424750]/30">
        <div className="flex items-center gap-3 bg-[#111318]/40 p-2 rounded-xl border border-[#424750]/15">
          <div className="w-8 h-8 rounded-full bg-[#a6c8ff] flex items-center justify-center text-[#003060] font-bold text-sm tracking-wide shadow-sm">
            R
          </div>
          <div className="hidden md:block overflow-hidden">
            <p className="font-bold text-xs text-[#e2e2e8]">PolyCode Pro</p>
            <p className="text-[9px] text-[#c2c6d2]/70 leading-none">v1.0.4-beta</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
