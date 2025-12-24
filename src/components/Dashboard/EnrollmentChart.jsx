import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Courses", count: 220 },
  { name: "Internships", count: 90 },
  { name: "Events", count: 60 },
  { name: "Workshops", count: 50 },
];

const EnrollmentChart = () => (
  <div className="admin-chart-card">
    <h3 className="admin-chart-title">Enrollments</h3>

    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default EnrollmentChart;
