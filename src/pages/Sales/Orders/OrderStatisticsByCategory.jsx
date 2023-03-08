import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
function OrderStatisticsByCategory() {
  const datas = [
    {
      name: "Cá và hải sản",
      value: 30,
    },
    {
      name: "Gà",
      value: 10,
    },
    {
      name: "Heo",
      value: 20,
    },
    {
      name: "Rau củ quả",
      value: 40,
    },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <>
      <p className="text-center text-[20px] text-primary font-bold">
        Thống kê đơn hàng theo danh mục
      </p>
      <div className="ml-[25%]">
        <PieChart width={500} height={500}>
          <Pie
            data={datas}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={200}
            fill="#8884d8"
            labelLine={false}
          >
            {datas.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      <div className="ml-10 text-center mt-10">
        <p className="text-[15px] font-bold">Bảng thống kê</p>

        <table className="mb-10 table">
          <tr>
            <th className="border border-solid">Tên danh mục</th>
            <th className="border border-solid">Tỷ lệ</th>
          </tr>

          {datas &&
            datas.map((data) => {
              return (
                <tr>
                  <td className="border border-solid">{data.name}</td>
                  <td className="border border-solid">{data.value} %</td>
                </tr>
              );
            })}
        </table>
      </div>
    </>
  );
}

export default OrderStatisticsByCategory;
