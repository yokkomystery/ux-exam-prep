type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
  color?: "blue" | "green" | "teal" | "red" | "indigo";
};

const colorMap = {
  blue: "bg-indigo-500",
  green: "bg-emerald-500",
  teal: "bg-teal-500",
  red: "bg-rose-500",
  indigo: "bg-indigo-500",
};

export function ProgressBar({
  value,
  max,
  label,
  color = "blue",
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">{label}</span>
          <span className="text-gray-500 dark:text-gray-400">
            {value}/{max} ({percentage}%)
          </span>
        </div>
      )}
      <div
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `進捗 ${percentage}%`}
      >
        <div
          className={`${colorMap[color]} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
