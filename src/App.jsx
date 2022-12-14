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

import { Layout, Menu } from "antd";
import Employees from "./pages/Management/Employees";
import Customers from "./pages/Management/Customers";
import Suppliers from "./pages/Management/Suppliers";
import Orders from "./pages/Sales/Orders";
import Login from "./pages/Login";

const { Header, Content, Sider } = Layout;
function App() {
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
                  <Route path="/" element={<Login />} />
                  <Route path="/home" element={<HomePage />} />
                  {/* LOGIN */}
                  <Route path="/account" element={<Login />} />
                  {/* MANAGEMENT */}
                  <Route path="/management/employees" element={<Employees />} />
                  <Route
                    path="/management/categories"
                    element={<Categories />}
                  />
                  <Route path="/management/products" element={<Products />} />
                  <Route path="/management/customers" element={<Customers />} />
                  <Route path="/management/suppliers" element={<Suppliers />} />
                  {/* SALES */}
                  <Route path="/sales/orders" element={<Orders />} />
                  <Route
                    path="orders/status"
                    element={<div>SearchOrdersByStatus</div>}
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
