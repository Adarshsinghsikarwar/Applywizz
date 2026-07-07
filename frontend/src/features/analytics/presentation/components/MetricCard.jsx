import Card from '../../../../shared/ui/Card';
import { formatNumber } from '../../../../shared/utils/formatters';

export default function MetricCard({ label, value, hint }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-ink-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-800">{formatNumber(value)}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
    </Card>
  );
}
