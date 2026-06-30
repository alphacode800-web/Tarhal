interface FriendlyColorPickerProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (color: string) => void;
}

export default function FriendlyColorPicker({
  label,
  hint,
  value,
  onChange,
}: FriendlyColorPickerProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
      <p className="text-sm font-medium text-slate-100 mb-1">{label}</p>
      {hint ? <p className="text-xs text-slate-400 mb-3">{hint}</p> : null}
      <label className="flex items-center gap-4 cursor-pointer">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-14 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer"
          aria-label={label}
        />
        <span className="text-sm text-slate-300">
          {hint || 'اضغط على المربع لاختيار اللون'}
        </span>
      </label>
    </div>
  );
}
