import React from "react";
import AddressColumnChart from "../../../components/Customer/AddressColumnChart";

function StatisticsOrdersByAddress() {
  return (
    <>
      <div className="text-center text-[25px] text-primary font-bold m-10">
        Thống kê đơn đặt hàng của khách hàng theo địa chỉ
      </div>
      <div className="mt-20">
        <AddressColumnChart />
      </div>
    </>
  );
}

export default StatisticsOrdersByAddress;
