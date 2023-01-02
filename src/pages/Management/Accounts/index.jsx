import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  Checkbox,
  Modal,
  message,
  Select,
} from "antd";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const renderRoles = (arr) => {
    return arr.map((a, index) => {
      return (
        <div
          key={index}
          className="border border-solid border-blue-800 rounded mb-1 text-center"
        >
          {a}
        </div>
      );
    });
  };
  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
      render: (text, record) => {
        return <Input.Password value={text} />;
      },
    },
    {
      title: "Kích hoạt",
      dataIndex: "active",
      key: "active",
      render: (text) => {
        return text ? (
          <span className="text-green-700 font-bold">Kích hoạt</span>
        ) : (
          <span className="text-red-700 font-bold">Thu hồi</span>
        );
      },
    },
    {
      title: "Quyền tài khoản",
      dataIndex: "roles",
      key: "roles",
      render: (text, record) => {
        return renderRoles(text);
      },
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center">
            {/* Button Edit */}
            <Button
              className="py-5 flex items-center"
              onClick={() => {
                setSelectedRecord(record);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            >
              {<AiFillEdit size={"16px"} />}
            </Button>
            {/* Button Delete */}
            <Popconfirm
              title="Bạn có chắc muốn xóa dòng này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/auth/" + id)
                  .then((response) => {
                    message.success("Xóa thành công!");
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    console.log(err);
                    message.error("Xóa thất bại!");
                  });
              }}
              onCancel={() => {}}
              okText="Có"
              cancelText="Không"
            >
              <Button danger className="py-5 flex items-center">
                {<AiFillDelete size={"16px"} />}
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    axiosClient
      .get("/auth")
      .then((response) => {
        // console.log(response.data);
        setAccounts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const onFinish = (values) => {
    axiosClient
      .post("/auth", values)
      .then((response) => {
        // console.log(response.data);
        message.success("Thêm Tài khoản thành công!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Thêm Tài khoản thất bại!");
        console.log({ message: message.err });
      });
    console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors) => {
    console.log("💣💣💣 ", errors);
  };

  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/auth/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
        console.log(err);
      });
  };
  const onUpdateFinishFailed = (errors) => {
    console.log("💣💣💣 ", errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">🔐 Quản lý tài khoản 🔑</h1>

      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        // initialValues={{ remember: true }}
        initialValues={{ active: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="w-[80%]">
          {/* Tên người dùng */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên người dùng"
            name="fullName"
            rules={[{ required: true, message: "Please input name account!" }]}
          >
            <Input />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            hasFeedback
            className=""
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Số điện thoại bắt buộc nhập!" },
              { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
              { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Username */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Tên tài khoản bắt buộc nhập!" },
              { type: "email", message: `Invalid Email` },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            hasFeedback
            className=""
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Mật khẩu bắt buộc nhập!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="Kích hoạt" name="active">
            <Select
              // defaultValue={true}
              options={[
                {
                  value: "true",
                  label: "Kích hoạt",
                },
                {
                  value: "false",
                  label: "Thu hồi",
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="Quyền tài khoản" name="roles">
            <Checkbox.Group
              options={[
                {
                  label: "administrator",
                  value: "administrator",
                },
                {
                  label: "managers",
                  value: "managers",
                },
                {
                  label: "directors",
                  value: "directors",
                },
                {
                  label: "customer",
                  value: "customer",
                },
              ]}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Table rowKey={"_id"} dataSource={accounts} columns={columns} />

      <Modal
        centered
        open={editFormVisible}
        width={"50%"}
        title="Cập nhật tài khoản"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText="Lưu thay đổi"
        cancelText="Đóng"
      >
        <Form
          form={updateForm}
          name="update-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          // initialValues={{ remember: true }}
          initialValues={{ active: true }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="off"
        >
          <div className="w-[80%]">
            {/* Tên người dùng */}
            <Form.Item
              hasFeedback
              className=""
              label="Tên người dùng"
              name="fullName"
              rules={[
                { required: true, message: "Please input name account!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              hasFeedback
              className=""
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Số điện thoại bắt buộc nhập!" },
                { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
                { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Username */}
            <Form.Item
              hasFeedback
              className=""
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: "Tên tài khoản bắt buộc nhập!" },
                { type: "email", message: `Invalid Email` },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              hasFeedback
              className=""
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Mật khẩu bắt buộc nhập!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item label="Kích hoạt" name="active">
              <Select
                // defaultValue={["Kích hoạt"]}
                options={[
                  {
                    value: "true",
                    label: "Kích hoạt",
                  },
                  {
                    value: "false",
                    label: "Thu hồi",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item label="Quyền tài khoản" name="roles">
              <Checkbox.Group
                options={[
                  {
                    label: "administrator",
                    value: "administrator",
                  },
                  {
                    label: "managers",
                    value: "managers",
                  },
                  {
                    label: "directors",
                    value: "directors",
                  },
                  {
                    label: "customer",
                    value: "customer",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default Accounts;
