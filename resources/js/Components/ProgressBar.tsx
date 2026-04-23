export default function ProgressBar({ percentage }: { percentage: number }) {
    const pct = Math.min(100, Math.max(0, percentage));
    return (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}
