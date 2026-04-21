interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
}

export default function ProgressBar({ percentage, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const isDone = clamped === 100;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${clamped}%`,
              background: isDone
                ? "#10b981"
                : "linear-gradient(90deg, #4a8ec4 0%, #7ab8e0 100%)",
            }}
          />
        </div>
        {showLabel && (
          <span className={`text-sm font-semibold w-12 text-right ${isDone ? "text-emerald-600" : "text-blue-600"}`}>
            {clamped}%
          </span>
        )}
      </div>
    </div>
  );
}
