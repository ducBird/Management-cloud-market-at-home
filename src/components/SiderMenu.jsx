import React, { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineShopping,
  AiOutlineDatabase,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from 'react-icons/ai';
import {
  MdOutlineSupportAgent,
  MdOutlinePeopleAlt,
  MdOutlineArticle,
  MdOutlineManageAccounts,
  MdOutlineCategory,
} from 'react-icons/md';

import { RiLuggageDepositLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Menu, Button } from 'antd';

const itemsSider = [
  { label: 'Trang Chủ', key: 'home', icon: <AiOutlineHome /> }, // remember to pass the key prop
  {
    label: 'Quản Trị',
    key: 'management',
    icon: <MdOutlineManageAccounts />,
    children: [
      {
        label: 'Categories',
        key: 'management-categories',
        icon: <MdOutlineCategory />,
      },
      {
        label: 'Products',
        key: 'management-products',
        icon: <AiOutlineShopping />,
      },
      {
        label: 'Customers',
        key: 'management-customers',
        icon: <MdOutlinePeopleAlt />,
      },
      {
        label: 'Employees',
        key: 'management-employees',
        icon: <MdOutlineSupportAgent />,
      },
      { label: 'Orders', key: 'sales-orders', icon: <MdOutlineArticle /> },
      {
        label: 'Suppliers',
        key: 'management-suppliers',
        icon: <RiLuggageDepositLine />,
      },
    ],
  },
  {
    label: 'Quản Lý Bán Hàng',
    key: 'sales',
    icon: <AiOutlineDatabase />,
    children: [
      {
        label: 'Orders',
        key: 'orders',
        icon: <MdOutlineArticle />,
        children: [
          {
            label: <span style={{}}>Order statistics by status</span>,
            key: 'orders-status',
          },
          {
            label: 'Statistics by payment method',
            key: 'orders-payment',
          },
          {
            label: 'Order statistics by revenue',
            key: 'orders-revenue',
            children: [
              {
                label: 'Revenue statistics over time',
                key: 'orders-revenue-overtime',
              },
            ],
          },
        ],
      },
    ],
  },
  { label: 'Cài Đặt', key: 'settings', icon: <AiOutlineSetting /> }, // which is required
];

export default function SiderMenu() {
  const navigate = useNavigate();
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
          height: '100%',
          borderRight: 0,
        }}
        // inlineCollapsed={collapsed}
        items={itemsSider}
        onClick={({ key, keyPath, domEvent }) => {
          navigate('/' + key.split('-').join('/'));
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
