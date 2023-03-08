import "./App.css";
import { useState } from "react";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AiOutlineWarning } from "react-icons/ai";

import cmah_logo from "/cloud-market.jpg";

import HeaderMenu from "./components/HeaderMenu";
import SiderMenu from "./components/SiderMenu";

import HomePage from "./pages/Home/HomePage";
import Categories from "./pages/Management/Categories";
import Products from "./pages/Management/Products";

import { Layout, message, Menu } from "antd";
import Employees from "./pages/Management/Employees";
import Customers from "./pages/Management/Customers";
import Suppliers from "./pages/Management/Suppliers";
import Orders from "./pages/Sales/Orders";
import Login from "./pages/Login";
import Accounts from "./pages/Management/Accounts";
import GuestService from "./pages/Management/GuestServices";

import { useUser } from "./hooks/useUser";
import SearchOrdersByStatus from "./pages/Sales/Orders/SearchOrdersByStatus";
import SearchOrdersByPaymentType from "./pages/Sales/Orders/SearchOrdersByPaymentType";
import SearchOrdersByPhoneNumber from "./pages/Sales/Orders/SearchOrdersByPhoneNumber";
import SearchOrderByDate from "./pages/Sales/Orders/SearchOrderByDate";
import StatisticsOrdersByAddress from "./pages/Sales/Customes/StatisticsCustomerOrdersByAddress";
import OrderStatisticsByCategory from "./pages/Sales/Orders/OrderStatisticsByCategory";
import StatisticsTotalOrdersByMonth from "./pages/Sales/Orders/StatisticsTotalOrdersByMonth";
import StatisticsByTotalOrders from "./pages/Sales/Orders/StatisticsByTotalOrders";

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

                  {/* LOGIN */}
                  <Route path="/account" element={<Login />} />

                  {/* MANAGEMENT */}
                  <Route path="/management/accounts" element={<Accounts />} />
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
                  <Route
                    path="/management/categories"
                    element={<Categories />}
                  />
                  <Route path="/management/products" element={<Products />} />
                  <Route path="/management/customers" element={<Customers />} />
                  <Route path="/management/suppliers" element={<Suppliers />} />
                  <Route
                    path="/management/guestServices"
                    element={<GuestService />}
                  />
                  {/* SALES */}
                  <Route path="/sales/orders" element={<Orders />} />
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
