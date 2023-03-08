import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
function AccessLineChart() {
  const data = [
    { name: "Tháng 1", "Truy Cập": 1000, "Đăng ký": 200 },
    { name: "Tháng 2", "Truy Cập": 1500, "Đăng ký": 400 },
    { name: "Tháng 3", "Truy Cập": 2800, "Đăng ký": 600 },
    { name: "Tháng 4", "Truy Cập": 4300, "Đăng ký": 1000 },
    { name: "Tháng 5", "Truy Cập": 3000, "Đăng ký": 1500 },
    { name: "Tháng 6", "Truy Cập": 4800, "Đăng ký": 800 },
    { name: "Tháng 7", "Truy Cập": 6000, "Đăng ký": 2000 },
    { name: "Tháng 8", "Truy Cập": 4300, "Đăng ký": 930 },
    { name: "Tháng 9", "Truy Cập": 4800, "Đăng ký": 1000 },
    { name: "Tháng 10", "Truy Cập": 5000, "Đăng ký": 1200 },
    { name: "Tháng 11", "Truy Cập": 4300, "Đăng ký": 1000 },
    { name: "Tháng 12", "Truy Cập": 4400, "Đăng ký": 1100 },
  ];
  return (
    <>
      <ResponsiveContainer className="chart mt-10" height={450}>
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Truy Cập"
            stroke="#261dc1"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="Đăng ký" stroke="#24602e" />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-[17px]">
        Biểu đồ đường biểu diễn số lượng truy cập và đăng ký của WEBSITE
      </p>
    </>
  );
}

export default AccessLineChart;
