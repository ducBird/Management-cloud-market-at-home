import React from "react";
import CloudMarketLogo from "../../assets/logo/cloud-market.jpg";

export default function HomePage() {
  return (
    <div>
      <div className="content text-center mt-5">
        <div className="text-2xl font-bold">💼 CLOUD MARKET AT HOME 💼</div>
        {/* <div className="text-xl mt-5"> Chào ... </div> */}
        <div className="text-xl mt-5">
          🏠{" "}
          <code>
            Bạn đang ở Trang Chủ phần mềm quản lý Chợ Trên Mây Tại Nhà
          </code>{" "}
          🏠
        </div>
      </div>
      <div className="logoImage text-center">
        <img
          src={CloudMarketLogo}
          alt="logo Cloud Market At Home"
          className="w-[50%] inline-block "
        />
      </div>
    </div>
  );
}
