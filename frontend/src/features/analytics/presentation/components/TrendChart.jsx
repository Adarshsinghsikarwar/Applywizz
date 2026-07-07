import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../../../shared/ui/Card';

export default function TrendChart({ data }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-ink-700">Postings — last 30 days</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5f6b82' }} minTickGap={20} />
          <YAxis tick={{ fontSize: 11, fill: '#5f6b82' }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #d7dbe3' }} />
          <Line type="monotone" dataKey="count" stroke="#2f7f78" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
