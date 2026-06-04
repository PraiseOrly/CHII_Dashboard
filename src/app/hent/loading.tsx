export default function HENTLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ backgroundColor: "#f1f5f9" }}>

      {/* Brand mark */}
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 200 200" width="44" height="44" aria-label="CHII logo">
          <rect width="200" height="200" rx="24" fill="#002147" />
          <text x="100" y="97" textAnchor="middle" fill="white"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontWeight="900" fontSize="74">ALU</text>
          <text x="100" y="120" textAnchor="middle" fill="rgba(255,255,255,0.6)"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="12">CENTRE FOR HEALTH</text>
          <text x="100" y="136" textAnchor="middle" fill="rgba(255,255,255,0.6)"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="12">INNOVATION &amp;</text>
          <text x="100" y="152" textAnchor="middle" fill="rgba(255,255,255,0.6)"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="12">IMPACT</text>
        </svg>
        <div>
          <p className="text-sm font-bold leading-none" style={{ color: "#002147" }}>HENT</p>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">CHII · ALU</p>
        </div>
      </div>

      {/* Skeleton stat strip */}
      <div className="w-[720px] max-w-[90vw] h-16 rounded overflow-hidden">
        <div className="grid grid-cols-5 h-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse" style={{ backgroundColor: i === 0 ? "#002147" : "#0a2d5e", opacity: 1 - i * 0.08 }} />
          ))}
        </div>
      </div>

      {/* Skeleton chart row */}
      <div className="w-[720px] max-w-[90vw] grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-9 bg-gray-100" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-100 rounded-sm w-3/4" />
              <div className="h-3 bg-gray-100 rounded-sm w-1/2" />
              <div className="h-20 bg-gray-50 rounded mt-3" />
            </div>
          </div>
        ))}
      </div>

      {/* Pulse dots */}
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#002147] inline-block animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>

    </div>
  );
}
