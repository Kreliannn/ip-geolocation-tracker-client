
const Shimmer = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-800 rounded ${className}`} />
);
  
export default function PageSkeleton() {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
  
        {/* ── Top nav ── */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Shimmer className="w-5 h-5 rounded" />
              <Shimmer className="w-20 h-4 rounded" />
            </div>
            {/* Logout */}
            <Shimmer className="w-16 h-4 rounded" />
          </div>
        </header>
  
        <main className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">
  
          {/* ── Search card ── */}
          <section>
            <Shimmer className="w-16 h-3 mb-3 rounded" />
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                {/* Input */}
                <Shimmer className="flex-1 max-w-sm h-9 rounded-lg" />
                {/* Lookup button */}
                <Shimmer className="w-24 h-9 rounded-lg" />
              </div>
              {/* Clear button */}
              <Shimmer className="w-20 h-9 rounded-lg" />
            </div>
          </section>
  
          {/* ── Result section ── */}
          <section>
            <Shimmer className="w-12 h-3 mb-3 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  
              {/* Info card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
                {/* Live badge */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
                  <Shimmer className="w-16 h-3 rounded" />
                </div>
  
                {/* 9 rows matching IP, Hostname, City, Region, Country, Coordinates, Org, Postal, Timezone */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-slate-800 pb-2 last:border-0 last:pb-0"
                  >
                    {/* Icon */}
                    <Shimmer className="w-3.5 h-3.5 mt-0.5 shrink-0 rounded" />
                    {/* Label */}
                    <Shimmer className="w-20 h-3 shrink-0 rounded" />
                    {/* Value — vary widths to look natural */}
                    <Shimmer className={`h-3 rounded ${["w-28","w-40","w-24","w-32","w-20","w-36","w-44","w-16","w-28"][i]}`} />
                  </div>
                ))}
              </div>
  
              {/* Map placeholder */}
              <div
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative"
                style={{ height: "420px" }}
              >
                <div className="absolute inset-0 animate-pulse bg-slate-800" />
                {/* Fake map pin in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <div className="w-8 h-8 rounded-full bg-slate-600" />
                    <div className="w-1 h-6 bg-slate-600 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* ── History ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shimmer className="w-3.5 h-3.5 rounded" />
                <Shimmer className="w-28 h-3 rounded" />
              </div>
            </div>
  
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  {/* Checkbox */}
                  <Shimmer className="w-4 h-4 rounded" />
  
                  {/* IP + icon */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <Shimmer className="w-3.5 h-3.5 shrink-0 rounded" />
                    <Shimmer className={`h-3.5 rounded ${["w-28","w-24","w-32","w-20","w-28"][i]}`} />
                  </div>
  
                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Shimmer className="w-3 h-3 rounded" />
                    <Shimmer className="w-24 h-3 rounded" />
                  </div>
  
                  {/* View button */}
                  <Shimmer className="w-14 h-7 rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          </section>
  
        </main>
      </div>
    );
  }