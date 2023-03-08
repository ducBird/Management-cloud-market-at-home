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
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [loading, setLoading] = React.useState(false);
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
        message.success("Cập nhật thành công");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại");
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log("🐣", errors);
  };
  const onSearchFinish = (values) => {
    setLoading(true);
    axiosClient
      .post("/customers/dia-chi-khach-hang", values)
      .then((response) => {
        setCustomers(response.data.results);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Lọc thông tin lỗi");
        setLoading(false);
      });
  };

  const onSearchFinishFailed = (errors) => {
    console.log("🐣", errors);
  };
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [searchForm] = Form.useForm();

  // validate
  // validate phone number
  const phoneValidator = (rule, value, callback) => {
    const phoneNumberPattern =
      /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    if (value && !phoneNumberPattern.test(value)) {
      callback("Số điện thoại không hợp lệ");
    } else {
      callback();
    }
  };
  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">🏬 Nhà Cung Cấp 🏬</h1>
      <div className="border border-solid rounded-md">
        <p className="text-center text-primary text-[17px] font-bold">
          Tìm kiếm
        </p>
        <Form
          form={searchForm}
          name="search-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onSearchFinish}
          onFinishFailed={onSearchFinishFailed}
          autoComplete="off"
          className="m-5"
        >
          {/* Name */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên nhà cung cấp"
            name="name"
          >
            <Input />
          </Form.Item>

          {/* Email */}
          <Form.Item hasFeedback className="" label="Email" name="email">
            <Input />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            hasFeedback
            className=""
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              {
                validator: phoneValidator,
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Address */}
          <Form.Item hasFeedback className="" label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          {/* Button Lọc thông tin */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Đang xử lý ..." : "Lọc thông tin"}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Button
        className="bg-blue-500 text-white font-bold mb-5 mt-5"
        onClick={() => {
          setCreateFormVisible(true);
          console.log("ok");
        }}
      >
        Thêm mới nhà cung cấp
      </Button>
      <Modal
        centered
        open={createFormVisible}
        title="Thêm mới thông tin nhà cung cấp"
        onOk={() => {
          createForm.submit();
          //setCreateFormVisible(false);
        }}
        onCancel={() => {
          setCreateFormVisible(false);
        }}
        okText="Lưu"
        cancelText="Đóng"
      >
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
            rules={[{ required: true, message: "Không thể để trống" }]}
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
              { required: true, message: "Không thể để trống" },
              { type: "email", message: "Email không hợp lệ" },
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
              { required: true, message: "Không thể để trống" },
              {
                validator: phoneValidator,
              },
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
            rules={[{ required: true, message: "Không thể để trống" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

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
            rules={[{ required: true, message: "Không thể để trống" }]}
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
              { required: true, message: "Không thể để trống" },
              { type: "email", message: "Email không hợp lệ" },
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
              { required: true, message: "Không thể để trống" },
              {
                validator: phoneValidator,
              },
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
            rules={[{ required: true, message: "Không thể để trống" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Suppliers;
