import React from "react";
import CloudMarketLogo from "../../assets/logo/cloud-market.jpg";
import AccessLineChart from "../../components/AccessLineChart";

export default function HomePage() {
  return (
    <div>
      <div className="content text-center mt-5">
        <div className="text-2xl font-bold">💼 CLOUD MARKET AT HOME 💼</div>
      </div>
      <div className="line-chart text-center mt-10">
        <AccessLineChart />
      </div>
    </div>
  );
}
