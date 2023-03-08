import React, { useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineShopping,
  AiOutlineDatabase,
  AiOutlineUser,
  AiOutlineUserSwitch,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineCar,
} from "react-icons/ai";
import {
  MdOutlineSupportAgent,
  MdOutlinePeopleAlt,
  MdOutlineArticle,
  MdOutlineManageAccounts,
  MdOutlineCategory,
} from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";

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
      disabled:
        users.roles &&
        users.roles.some((role) => {
          return (
            role === "directors" ||
            role === "administrator" ||
            role === "managers" ||
            role === "sales"
          );
        })
          ? false
          : true,
      children: [
        // {
        //   label: "Tài khoản",
        //   key: "management-accounts",
        //   icon: <AiOutlineUser />,
        // },
        {
          label: "Danh mục",
          key: "management-categories",
          icon: <MdOutlineCategory />,
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
        {
          label: "Sản phẩm",
          key: "management-products",
          icon: <AiOutlineShopping />,
        },
        {
          label: "Khách hàng",
          key: "management-customers",
          icon: <MdOutlinePeopleAlt />,
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
      disabled:
        users.roles &&
        users.roles.some((role) => {
          return (
            role === "directors" ||
            role === "administrator" ||
            role === "managers" ||
            role === "sales"
          );
        })
          ? false
          : true,
      children: [
        {
          label: "Thống Kê",
          key: "orders",
          icon: <MdOutlineArticle />,
          children: [
            {
              label: <span style={{}}>Trạng Thái</span>,
              key: "orders-status",
            },
            {
              label: "Hình Thức Thanh Toán",
              key: "orders-payment",
            },
            {
              label: "Doanh Thu",
              key: "orders-revenue",
              children: [
                {
                  label: "Theo Thời Gian",
                  key: "orders-revenue-overtime",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Quản Lý Vận Chuyển",
      key: "shipping",
      icon: <AiOutlineCar />,
      disabled:
        users.roles &&
        users.roles.some((role) => {
          return (
            role === "directors" ||
            role === "administrator" ||
            role === "managers" ||
            role === "shipper"
          );
        })
          ? false
          : true,
      children: [
        {
          label: "Chưa Vận Chuyển",
          key: "shipping-unresolved",
        },
        {
          label: "Đang Vận Chuyển",
          key: "shipping-resolving",
        },
        {
          label: "Đã Vận Chuyển",
          key: "shipping-resolved",
        },
      ],
    },
    {
      label: "Quản Lý Kho",
      key: "warehouse",
      icon: <FaWarehouse />,
      disabled:
        users.roles &&
        users.roles.some((role) => {
          return (
            role === "directors" ||
            role === "administrator" ||
            role === "managers" ||
            role === "warehouse"
          );
        })
          ? false
          : true,
      children: [
        {
          label: "Đơn Đợi Vận Chuyển",
          key: "warehouse-waitingpickup",
        },
      ],
    },
    { label: "Cài Đặt", key: "settings", icon: <AiOutlineSetting /> },
  ];
  // Sử dụng với Redux
  // const [collapsed, setCollapsed] = useState(false);
  // const toggleCollapsed = () => {
  //   setCollapsed(!collapsed);
  // };

  return (
    <div>
      <Menu
        theme="light"
        mode="inline"
        style={{
          height: "100%",
          borderRight: 0,
        }}
        // inlineCollapsed={collapsed}
        items={itemsSider}
        onClick={({ key, keyPath, domEvent }) => {
          navigate("/" + key.split("-").join("/"));
          // console.log(key);
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
