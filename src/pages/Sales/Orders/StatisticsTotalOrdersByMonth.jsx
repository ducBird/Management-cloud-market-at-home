import React from "react";
import numeral from "numeral";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./orders.css";
function StatisticsTotalOrdersByMonth() {
  const datas = [
    { name: "Tháng 1", DoanhThu: 200000000 },
    { name: "Tháng 2", DoanhThu: 230000000 },
    { name: "Tháng 3", DoanhThu: 280000000 },
    { name: "Tháng 4", DoanhThu: 300000000 },
    { name: "Tháng 5", DoanhThu: 270000000 },
    { name: "Tháng 6", DoanhThu: 380000000 },
    { name: "Tháng 7", DoanhThu: 400000000 },
    { name: "Tháng 8", DoanhThu: 350000000 },
    { name: "Tháng 9", DoanhThu: 380000000 },
    { name: "Tháng 10", DoanhThu: 400000000 },
    { name: "Tháng 11", DoanhThu: 380000000 },
    { name: "Tháng 12", DoanhThu: 350000000 },
  ];
  const total = datas.reduce((total, item) => {
    return total + item.DoanhThu;
  }, 0);
  return (
    <>
      <p className="m-10 text-[20px] text-primary font-bold text-center">
        Thống kê tổng doanh thu đơn hàng theo tháng
      </p>
      <p className="text-[15px]  font-bold">Biểu đồ</p>
      <div className="w-[100%]">
        <BarChart
          width={1100}
          height={300}
          data={datas}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="DoanhThu" fill="#8884d8" />
        </BarChart>
      </div>
      <hr />
      <div className="ml-10 text-center mt-10">
        <p className="text-[15px] font-bold">Bảng thống kê</p>

        <table className="mb-10 table">
          <tr>
            <th className="border border-solid">Name</th>
            <th className="border border-solid">Doanh thu</th>
          </tr>

          {datas &&
            datas.map((data, index) => {
              return (
                <tr key={index}>
                  <td className="border border-solid">{data.name}</td>
                  <td className="border border-solid">
                    {numeral(data.DoanhThu).format("0,0")} đ
                  </td>
                </tr>
              );
            })}
        </table>
      </div>
      <div className="text-primary text-[17px] font-bold text-right">
        Tổng doanh thu:
        <span className="text-red-500 ml-2">
          {numeral(total).format("0,0")} đ
        </span>
      </div>
    </>
  );
}

export default StatisticsTotalOrdersByMonth;
