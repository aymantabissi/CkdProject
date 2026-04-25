export default function Toggle({ name, value, onChange }) {
  const options = [
    { label: "No", val: "0" },
    { label: "Yes", val: "1" },
  ];

  return (
    <div className="flex gap-2">
      {options.map(({ label, val }) => {
        const active = value === val;

        return (
          <button
            key={val}
            type="button"
            onClick={() =>
              onChange({ target: { name, value: val } })
            }
            className={`
              flex-1 py-2 text-[11px] font-bold rounded-xl border-2
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${
                active
                  ? val === "1"
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                    : "bg-red-400 text-white border-red-400 shadow-md"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}