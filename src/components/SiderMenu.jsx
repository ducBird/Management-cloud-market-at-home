import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineShopping,
  AiOutlineDatabase,
  AiOutlineUser,
  AiOutlineUserSwitch,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import {
  MdOutlineSupportAgent,
  MdOutlinePeopleAlt,
  MdOutlineArticle,
  MdOutlineManageAccounts,
  MdOutlineCategory,
} from "react-icons/md";

import { RiLuggageDepositLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Menu, Button } from "antd";

import { useUser } from "../hooks/useUser";

export default function SiderMenu() {
  const { users } = useUser((state) => state);
  const navigate = useNavigate();
  const itemsSider = [
    { label: "Trang Chủ", key: "home", icon: <AiOutlineHome /> }, // remember to pass the key prop
    {
      label: "Quản Trị",
      key: "management",
      icon: <MdOutlineManageAccounts />,
      children: [
        {
          label: "Tài khoản",
          key: "management-accounts",
          icon: <AiOutlineUser />,
        },
        {
          label: "Danh mục",
          key: "management-categories",
          icon: <MdOutlineCategory />,
        },
        {
          label: "Sản phẩm",
          key: "management-products",
          icon: <AiOutlineShopping />,
        },
        {
          label: "Khách hàng",
          key: "management-customers",
          icon: <MdOutlinePeopleAlt />,
        },
        /* Làm ẩn đi MenuItem Nhân viên
        // {
        //   label:
        //     users.roles &&
        //     users.roles.some((role) => {
        //       return (
        //         role === "directors" ||
        //         role === "administrator" ||
        //         role === "managers"
        //       );
        //     })
        //       ? "Nhân viên"
        //       : null,
        //   key:
        //     users.roles &&
        //     users.roles.some((role) => {
        //       return (
        //         role === "directors" ||
        //         role === "administrator" ||
        //         role === "managers"
        //       );
        //     })
        //       ? "management-employees"
        //       : null,
        //   icon:
        //     users.roles &&
        //     users.roles.some((role) => {
        //       return (
        //         role === "directors" ||
        //         role === "administrator" ||
        //         role === "managers"
        //       );
        //     }) ? (
        //       <MdOutlineSupportAgent />
        //     ) : null,
        // },*/
        {
          label: "Nhân viên",
          key: "management-employees",
          icon: <MdOutlineSupportAgent />,
          disabled:
            users.roles &&
            users.roles.some((role) => {
              return (
                role === "directors" ||
                role === "administrator" ||
                role === "managers"
              );
            })
              ? false
              : true,
        },
        { label: "Đơn hàng", key: "sales-orders", icon: <MdOutlineArticle /> },
        {
          label: "Nhà cung cấp",
          key: "management-suppliers",
          icon: <RiLuggageDepositLine />,
        },
        {
          label: "Chăm sóc KH",
          key: "management-guestServices",
          icon: <AiOutlineUserSwitch />,
        },
      ],
    },
    {
      label: "Quản Lý Bán Hàng",
      key: "sales",
      icon: <AiOutlineDatabase />,
      children: [
        {
          label: "Đơn hàng",
          key: "orders",
          icon: <MdOutlineArticle />,
          children: [
            {
              label: "Thống kê đơn hàng theo danh mục",
              key: "sales-orders-statistics-category",
            },
            {
              label: "Thống kê tổng đơn hàng theo tháng",
              key: "sales-total-orders-statistics-month",
            },
            {
              label: "Thống kê đơn hàng theo trạng thái",
              key: "sales-orders-status",
            },
            {
              label: "Thống kê theo phương thức thanh toán",
              key: "sales-orders-payment",
            },
            {
              label: "Tìm kiếm đơn hàng theo số điện thoại",
              key: "sales-orders-phoneNumber",
            },
            {
              label: "Thống kê đơn hàng theo ngày",
              key: "sales-orders-date",
            },
            {
              label: "Thống kê đơn hàng theo doanh thu",
              key: "orders-revenue",
              children: [
                {
                  label: "Thống kê doanh thu theo tổng đơn hàng",
                  key: "orders-statistics-by-total",
                },
              ],
            },
          ],
        },
        {
          label: "Khách hàng",
          key: "customers",
          icon: <MdOutlineArticle />,
          children: [
            {
              label: "Thống kê theo địa chỉ khách hàng",
              key: "sales-statistics-orders-customers-address",
            },
            {
              label: "Thống kê sinh nhật khách hàng",
              key: "sales-customers-birthday",
            },
          ],
        },
      ],
    },
    { label: "Cài Đặt", key: "settings", icon: <AiOutlineSetting /> }, // which is required
  ];
  // Sử dụng với Redux
  // const [collapsed, setCollapsed] = useState(false);
  // const toggleCollapsed = () => {
  //   setCollapsed(!collapsed);
  // };
  return (
    <div>
      <Menu
        // theme="light"
        // mode="inline"
        // style={{
        //   height: "100%",
        //   borderRight: 0,
        // }}
        //inlineCollapsed={collapsed}
        items={itemsSider}
        onClick={({ key, keyPath, domEvent }) => {
          navigate("/" + key.split("-").join("/"));
          console.log(key);
        }}
      />
      {/* <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
      </Button> */}
    </div>
  );
}
