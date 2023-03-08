import React from "react";
import CloudMarketLogo from "../../assets/logo/cloud-market.jpg";
import AccessLineChart from "../../components/AccessLineChart";

export default function HomePage() {
  return (
    <div>
      <div className="content text-center mt-5">
        <div className="text-2xl font-bold text-primary">
          💼 CLOUD MARKET AT HOME 💼
        </div>
        {/* <div className="text-xl mt-5"> Chào ... </div> */}
        <div className="text-xl mt-5">
          🏠{" "}
          <code>
            Bạn đang ở Trang Chủ phần mềm quản lý Chợ Trên Mây Tại Nhà
          </code>{" "}
          🏠
        </div>
      </div>
      <div className="line-chart text-center mt-10">
        <AccessLineChart />
      </div>
    </div>
  );
}
