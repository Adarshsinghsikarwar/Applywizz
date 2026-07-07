import Card from '../../../../shared/ui/Card';
import { formatNumber } from '../../../../shared/utils/formatters';

export default function MetricCard({ label, value, hint }) {
  return (
    <Card hoverEffect className="relative overflow-hidden p-5">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-signal-400/80 to-signal-600/80" />
      
      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">{label}</p>
      <div className="mt-2.5 flex items-baseline justify-between">
        <p className="font-mono text-3xl font-bold tracking-tight text-ink-900">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
      </div>
      {hint && (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-400" />
          {hint}
        </p>
      )}
    </Card>
  );
}
