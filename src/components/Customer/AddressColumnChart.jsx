import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function AddressColumnChart() {
  const datas = [
    { name: "Quận Hải Châu", value: 1000 },
    { name: "Quận Thanh Khê", value: 800 },
    { name: "Quận Liên Chiểu", value: 1200 },
    { name: "Quận Ngũ Hành Sơn", value: 200 },
    { name: "Quận Sơn Trà", value: 300 },
    { name: "Quận Cẩm Lệ", value: 800 },
    { name: "Huyện Hòa Vang", value: 700 },
    { name: "Huyện Đảo Hoàng Sa", value: 300 },
  ];
  const total = datas.reduce((total, item) => {
    return total + item.value;
  }, 0);
  return (
    <>
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
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
      <div className="ml-10 text-center mt-10">
        <p className="text-[15px] font-bold">Bảng thống kê</p>

        <table className="mb-5 table">
          <tr>
            <th className="border border-solid">Tên Quận/Huyện</th>
            <th className="border border-solid">Số Lượng người mua hàng</th>
          </tr>

          {datas &&
            datas.map((data) => {
              return (
                <tr key={data.name}>
                  <td className="border border-solid">{data.name}</td>
                  <td className="border border-solid">{data.value} Người</td>
                </tr>
              );
            })}
        </table>
        <div className="text-primary text-[17px] font-bold text-right">
          Tổng số người mua hàng:
          <span className="text-red-500 ml-2">{total}</span>
        </div>
      </div>
    </>
  );
}

export default AddressColumnChart;
