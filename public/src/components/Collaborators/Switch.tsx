function classNames(...values: Array<string | false | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

export default function Switch({
  checked,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={classNames(
        "relative inline-flex h-6 w-11 items-center rounded-full border transition",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        checked ? "border-emerald-500 bg-emerald-500/90" : "border-slate-200 bg-slate-100",
      )}
    >
      <span
        className={classNames(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

