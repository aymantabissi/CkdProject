 function Skeleton({ className = "" }) {
  return <div className={`rounded-xl bg-slate-200 animate-pulse ${className}`} />;
}

export default function LoadingOverlay() {
  return (
    <div
      className="absolute inset-0 z-20 rounded-3xl flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(248,250,252,0.92)", backdropFilter: "blur(4px)" }}
    >
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: "linear-gradient(135deg,rgba(14,165,233,0.15),rgba(13,148,136,0.15))" }}
        >
          <svg className="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.5 2 5 5.2 5 9.2c0 2.8 1.3 5.3 2.8 7.2C9.5 18.5 10.2 21 12 21c1.8 0 2.5-2.5 4.2-4.6C17.7 14.5 19 12 19 9.2 19 5.2 15.5 2 12 2z" />
            <line x1="12" y1="8" x2="12" y2="13" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" />
          </svg>
        </div>
        <div className="absolute inset-[-6px] rounded-[20px] border-2 border-transparent border-t-sky-400 animate-spin" />
      </div>
      <div className="flex flex-col gap-2.5 w-52">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-4/5" />
        <Skeleton className="h-2.5 w-3/5" />
      </div>
      <p className="text-[12px] font-semibold text-slate-400 tracking-wide">
        Analyzing patient data...
      </p>
    </div>
  );
}