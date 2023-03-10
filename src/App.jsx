import "./App.css";
import { useState } from "react";
import React from "react";
import cmah_logo from "./assets/logo/cloud-market.jpg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AiOutlineWarning } from "react-icons/ai";
import { Layout, message, Menu } from "antd";

import { useUser } from "./hooks/useUser";

import HeaderMenu from "./components/HeaderMenu";
import SiderMenu from "./components/SiderMenu";
import HomePage from "./pages/Home/HomePage";
import Management from "./pages/Management";
import Categories from "./pages/Management/Categories";
import Products from "./pages/Management/Products";
import Employees from "./pages/Management/Employees";
import Customers from "./pages/Management/Customers";
import Suppliers from "./pages/Management/Suppliers";
import Orders from "./pages/Sales/Orders";
import Login from "./pages/Login";
import Accounts from "./pages/Management/Accounts";
import GuestService from "./pages/Management/GuestServices";
import SearchOrdersByStatus from "./pages/Sales/Orders/SearchOrdersByStatus";
import SearchOrdersByPaymentType from "./pages/Sales/Orders/SearchOrdersByPaymentType";
import SearchOrdersByPhoneNumber from "./pages/Sales/Orders/SearchOrdersByPhoneNumber";
import SearchOrderByDate from "./pages/Sales/Orders/SearchOrderByDate";
import StatisticsOrdersByAddress from "./pages/Sales/Customes/StatisticsCustomerOrdersByAddress";
import OrderStatisticsByCategory from "./pages/Sales/Orders/OrderStatisticsByCategory";
import StatisticsTotalOrdersByMonth from "./pages/Sales/Orders/StatisticsTotalOrdersByMonth";
import StatisticsByTotalOrders from "./pages/Sales/Orders/StatisticsByTotalOrders";
import Shipping from "./pages/Shipping";
import UnresolvedOrder from "./pages/Shipping/UnresolvedOrder";
import ResolvingOrder from "./pages/Shipping/ResolvingOrder";
import ResolvedOrder from "./pages/Shipping/ResolvedOrder";
import WareHouse from "./pages/WareHouse";
import WaitingPickUp from "./pages/WareHouse/WaitingPickUp";

const { Header, Content, Sider } = Layout;
function App() {
  const { users } = useUser((state) => state);
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Header className="header">
            {window.localStorage.getItem("token") ? (
              <HeaderMenu />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img className="w-[7%]" src={cmah_logo} alt="logo-CMAH" />
                  <h3 className="text-blue-200 m-0">CLOUD MARKET AT HOME</h3>
                </div>
                <div className="flex justify-end items-center gap-3 w-[50%] text-white">
                  <AiOutlineWarning size={24} />
                  <h4 className="m-0">
                    Bạn cần đăng nhập để có thể sử dụng phần mềm quản lý
                  </h4>
                </div>
              </div>
            )}
          </Header>
          <Layout>
            <Sider
              theme="light"
              width={"20%"}
              style={{ minHeight: "100vh" }}
              className="site-layout-background"
            >
              {window.localStorage.getItem("token") ? (
                <SiderMenu />
              ) : (
                <div></div>
              )}
            </Sider>
            <Layout
              style={{
                padding: "0 20px",
              }}
            >
              <Content
                className="site-layout-background"
                style={{
                  padding: "10px 2px",
                  minHeight: 280,
                }}
              >
                <Routes>
                  {/* HOME */}
                  {window.localStorage.getItem("token") ? (
                    <Route path="/" element={<HomePage />} />
                  ) : (
                    <Route path="/" element={<Login />} />
                  )}

                  {/* HOME */}
                  <Route path="/home" element={<HomePage />} />

                  {/* MANAGEMENT */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "sales"
                      );
                    }) ? (
                    <Route path="/management" element={<Management />} />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}

                  {/* LOGIN */}
                  <Route path="/account" element={<Login />} />

                  {/* MANAGEMENT */}
                  {/* Management-Accounts */}
                  <Route path="/management/accounts" element={<Accounts />} />
                  {/* Management-Employees */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers"
                      );
                    }) ? (
                    <Route
                      path="/management/employees"
                      element={<Employees />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Management-Categories */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      // console.log(role);
                      return [
                        "directors",
                        "administrator",
                        "managers",
                      ].includes(role);
                    }) ? (
                    <Route
                      path="/management/categories"
                      element={<Categories />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Management-Products */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "sales"
                      );
                    }) ? (
                    <Route path="/management/products" element={<Products />} />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Management-Customers */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "sales"
                      );
                    }) ? (
                    <Route
                      path="/management/customers"
                      element={<Customers />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Management-Suppliers */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "sales"
                      );
                    }) ? (
                    <Route
                      path="/management/suppliers"
                      element={<Suppliers />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Management-GuestServices */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "sales"
                      );
                    }) ? (
                    <Route
                      path="/management/guestServices"
                      element={<GuestService />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}

                  {/* SALES */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "sales"
                      );
                    }) ? (
                    <Route path="/sales/orders" element={<Orders />} />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Sales-Orders/Status */}
                  <Route
                    path="sales/orders/status"
                    element={<SearchOrdersByStatus />}
                  />
                  <Route
                    path="sales/orders/payment"
                    element={<SearchOrdersByPaymentType />}
                  />
                  <Route
                    path="sales/orders/phoneNumber"
                    element={<SearchOrdersByPhoneNumber />}
                  />
                  <Route
                    path="sales/orders/date"
                    element={<SearchOrderByDate />}
                  />
                  <Route
                    path="sales/orders/statistics/category"
                    element={<OrderStatisticsByCategory />}
                  />
                  {/* TK tổng đơn hàng theo tháng */}
                  <Route
                    path="sales/total/orders/statistics/month"
                    element={<StatisticsTotalOrdersByMonth />}
                  />
                  {/* TK tổng đơn hàng */}
                  <Route
                    path="orders/statistics/by/total"
                    element={<StatisticsByTotalOrders />}
                  />

                  {/* customes */}
                  <Route
                    path="sales/statistics/orders/customers/address"
                    element={<StatisticsOrdersByAddress />}
                  />

                  {/* SHIPPING */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "shipper"
                      );
                    }) ? (
                    <Route path="/shipping" element={<Shipping />} />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Shipping-UnresolvedOrder */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "shipper"
                      );
                    }) ? (
                    <Route
                      path="/shipping/unresolved"
                      element={<UnresolvedOrder />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Shipping-ResolvingOrder */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "shipper"
                      );
                    }) ? (
                    <Route
                      path="/shipping/resolving"
                      element={<ResolvingOrder />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {/* Shipping-ResolvedOrder */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "shipper"
                      );
                    }) ? (
                    <Route
                      path="/shipping/resolved"
                      element={<ResolvedOrder />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}

                  {/* WAREHOUSE */}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "warehouse"
                      );
                    }) ? (
                    <Route path="/warehouse" element={<WareHouse />} />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}
                  {users.roles === undefined ? (
                    <Route path="/" element={<Login />} />
                  ) : users.roles.some((role) => {
                      return (
                        role === "directors" ||
                        role === "administrator" ||
                        role === "managers" ||
                        role === "warehouse"
                      );
                    }) ? (
                    <Route
                      path="/warehouse/waitingpickup"
                      element={<WaitingPickUp />}
                    />
                  ) : (
                    <Route path="*" element={<div>Not found</div>} />
                  )}

                  {/* NO MATCH ROUTE */}
                  <Route
                    path="*"
                    element={
                      <main style={{ padding: "1rem" }}>
                        <p>404 Page not found 😂😂😂</p>
                      </main>
                    }
                  />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
