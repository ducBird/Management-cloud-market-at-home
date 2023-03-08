import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import { Table, Button, Popconfirm, Form, Input, Modal, message } from "antd";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineUpload,
  AiOutlinePlus,
  AiOutlineLoading,
  AiFillQuestionCircle,
} from "react-icons/ai";
import "./suppliers.css";
import moment from "moment";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      title: "Tên Nhà Cung Cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
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
              icon={
                <AiFillQuestionCircle size={"24px"} className="text-red-600" />
              }
              title="Bạn có chắc muốn xóa nhà cung cấp này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/suppliers/" + id)
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
              <Button className="py-5 flex items-center" danger>
                {<AiFillDelete size={"16px"} />}
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      setSuppliers(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    axiosClient
      .post("/suppliers", values)
      .then((response) => {
        message.success("Thêm thành công!");
        createForm.resetFields(); //reset input form
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Thêm thất bại!");
      });
    console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors) => {
    console.log("💣💣💣 ", errors);
  };
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/suppliers/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">🏬 Nhà Cung Cấp 🏬</h1>
      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* Name */}
        <Form.Item
          hasFeedback
          className=""
          label="Tên nhà cung cấp"
          name="name"
          rules={[
            {
              required: true,
              message: "Tên nhà cung cấp không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Email */}
        <Form.Item
          hasFeedback
          className=""
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không được để trống!" },
            { type: "email", message: `Đây không phải là một email!` },
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
            { required: true, message: "Số điện thoại không được để trống!" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Address */}
        <Form.Item
          hasFeedback
          className=""
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Địa chỉ không được để trống!" }]}
        >
          <Input />
        </Form.Item>

        {/* Button Save */}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="_id" dataSource={suppliers} columns={columns} />

      <Modal
        centered
        open={editFormVisible}
        title="Cập nhập thông tin nhà cung cấp"
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
          initialValues={{ remember: true }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="off"
        >
          {/* Name */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên nhà cung cấp"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên nhà cung cấp không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Email */}
          <Form.Item
            hasFeedback
            className=""
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống!" },
              { type: "email", message: `Đây không phải là một email` },
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
              { required: true, message: "Số điện thoại không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Address */}
          <Form.Item
            hasFeedback
            className=""
            label="Địa chỉ"
            name="address"
            rules={[
              { required: true, message: "Địa chỉ không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Suppliers;
