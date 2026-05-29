export default function StatsFooter() {
  const stats = [
    { value: '98.4', label: 'Puntuación CodeBLEU' },
    { value: '99.9%', label: 'Tasa de Compilación' },
    { value: '<140ms', label: 'Latencia Promedio' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 bg-[#1d2024] px-5 py-2.5 rounded-full border border-[#424750]/40 shadow-sm"
        >
          <span className="text-[#a6c8ff] font-extrabold text-sm tracking-tight">
            {stat.value}
          </span>
          <span className="text-[#c2c6d2] text-[10px] uppercase font-bold tracking-wider">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
