import React from "react";
import { Menu } from "antd";
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineCar,
} from "react-icons/ai";
import { FaWarehouse } from "react-icons/fa";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import cmah_logo from "../assets/logo/cloud-market.jpg";
import { useUser } from "../hooks/useUser";
import { API_URL } from "../constants/URLS";

export default function HeaderMenu() {
  const navigate = useNavigate();
  const { users } = useUser((state) => state);
  const items1 = [
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
    },
    {
      label: "Vận Chuyển",
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
    }, // which is required
    {
      label: "Kho",
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
    }, // which is required
    { label: "Cài Đặt", key: "settings", icon: <AiOutlineSetting /> }, // which is required
  ];

  const ButtonLogin = (
    <button
      onClick={() => {
        window.location.href = "/account";
      }}
      className="flex items-center leading-none py-2 px-4  bg-white text-blue-700 rounded hover:cursor-pointer hover:rounded-xl hover:scale-110 hover:transition-all ease-in-out duration-300"
    >
      <span>Đăng Nhập</span>
      <AiOutlineLogin size={18} className="ml-2 text-blue-700" />
    </button>
  );
  const ButtonLogout = (
    <div className="flex items-center gap-10">
      <div className="flex justify-center items-center gap-2 text-white leading-none p-2 border border-solid rounded-md hover:cursor-pointer">
        {/* <AiOutlineUser /> */}
        <div className="w-[20px] h-[20px]">
          <img
            src={`${API_URL}${users.avatar}`}
            alt="avatar"
            className="w-[100%] h-[100%] rounded-full"
          />
        </div>
        <span>{users.fullName}</span>
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="flex items-center leading-none py-2 px-4 bg-white text-red-700 rounded hover:cursor-pointer hover:rounded-xl hover:scale-110 hover:transition-all ease-in-out duration-300"
      >
        <span className="min-w-[70px] w-[50%]">Đăng Xuất</span>
        <AiOutlineLogout size={18} className="ml-2 text-red-700" />
      </button>
    </div>
  );
  return (
    <div className="flex justify-between">
      <div className="flex">
        <img
          className="max-w-[63px] min-w-[5%] text-center"
          src={cmah_logo}
          alt="logo"
        />
        <Menu
          theme="dark"
          mode="horizontal"
          items={items1}
          onClick={({ key, keyPath, domEvent }) => {
            navigate("/" + key.split("-").join("/"));
            // console.log(key);
          }}
        />
      </div>
      <div className="flex items-center">
        {window.localStorage.getItem("token") ? ButtonLogout : ButtonLogin}
        {/* {window.location.href === "/" ? ButtonLogout : ButtonLogin} */}
      </div>
    </div>
  );
}
