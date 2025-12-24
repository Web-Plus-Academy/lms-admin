import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 20000 },
  { month: "Feb", revenue: 35000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 60000 },
  { month: "May", revenue: 72000 },
];

const RevenueChart = () => (
  <div className="admin-chart-card">
    <h3 className="admin-chart-title">Revenue Trend</h3>

    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueChart;
