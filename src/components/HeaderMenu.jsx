import React from 'react';
import { Menu } from 'antd';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const items1 = [
  { label: 'Home', key: 'home', icon: <AiOutlineHome /> }, // remember to pass the key prop
  { label: 'Settings', key: 'settings', icon: <AiOutlineSetting /> }, // which is required
  {
    label: 'Management',
    key: 'management',
    icon: <MdOutlineManageAccounts />,
  },
];

export default function HeaderMenu() {
  const navigate = useNavigate();
  return (
    <div>
      <Menu
        theme="dark"
        mode="horizontal"
        items={items1}
        onClick={({ key, keyPath, domEvent }) => {
          navigate('/' + key.split('-').join('/'));
          console.log(key);
        }}
      />
    </div>
  );
}
