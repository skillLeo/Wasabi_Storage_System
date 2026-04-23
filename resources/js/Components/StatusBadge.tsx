export default function StatusBadge({ status }: { status: 'uploaded' | 'missing' }) {
    return status === 'uploaded' ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Uploaded
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Missing
        </span>
    );
}
