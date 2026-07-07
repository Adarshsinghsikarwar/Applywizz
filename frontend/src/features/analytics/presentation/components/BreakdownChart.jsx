import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../../../shared/ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-ink-150 bg-white/95 p-2.5 shadow-md backdrop-blur-sm text-xs">
        <p className="font-semibold text-ink-800">{label}</p>
        <p className="mt-1 text-signal-600 font-bold">
          {payload[0].value} postings
        </p>
      </div>
    );
  }
  return null;
};

export default function BreakdownChart({ title, data }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-bold tracking-tight text-ink-700">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id={`barGrad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f9c94" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2f7f78" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: '#8992a6', fontWeight: 500 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: '#8992a6', fontWeight: 500 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eceef2/30', radius: 4 }} />
          <Bar
            dataKey="value"
            fill={`url(#barGrad-${title.replace(/\s+/g, '')})`}
            radius={[5, 5, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
