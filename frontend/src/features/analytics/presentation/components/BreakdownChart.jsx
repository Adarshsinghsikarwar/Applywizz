import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../../../shared/ui/Card';

export default function BreakdownChart({ title, data }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-ink-700">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5f6b82' }} />
          <YAxis tick={{ fontSize: 11, fill: '#5f6b82' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #d7dbe3' }}
            cursor={{ fill: '#f6f7f9' }}
          />
          <Bar dataKey="value" fill="#2f7f78" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
