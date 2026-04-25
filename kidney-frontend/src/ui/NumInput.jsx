export default function NumInput({
  name,
  placeholder,
  step = "1",
  value,
  onChange,
}) {
  return (
    <input
      name={name}
      type="number"
      step={step}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        bg-white
        border border-slate-200
        rounded-xl
        px-3 py-2
        text-[13px]
        font-mono font-semibold
        text-slate-700
        placeholder-slate-300
        outline-none
        focus:border-sky-400
        focus:ring-4
        focus:ring-sky-100
        transition-all
        hover:shadow-sm
      "
    />
  );
}