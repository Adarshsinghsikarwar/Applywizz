import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../../../shared/ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-ink-100 bg-white/95 p-2.5 shadow-md backdrop-blur-sm text-xs">
        <p className="font-semibold text-ink-800">{label}</p>
        <p className="mt-1 text-signal-600 font-bold">
          {payload[0].value} postings
        </p>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-bold tracking-tight text-ink-700">Postings — last 30 days</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 9, fill: '#8992a6', fontWeight: 500 }}
            minTickGap={20}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: '#8992a6', fontWeight: 500 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2f7f78"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: '#3f9c94' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
