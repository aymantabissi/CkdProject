export default function Field({ label, unit, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between flex-wrap">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          {label}
          {required && <span className="text-sky-400 text-[10px]">*</span>}
        </p>

        {unit && (
          <span className="text-[10px] text-slate-300 bg-slate-100 px-2 py-0.5 rounded-md">
            {unit}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}