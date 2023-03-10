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

import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { FaTrashRestore } from "react-icons/fa";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import moment from "moment";

function GuestService() {
  const [guestServices, setGuestServices] = useState([]);
  const [isDelete, setIsDelete] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormDelete, setEditFormDelete] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Lời nhắn",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Phản hồi",
      dataIndex: "isRequest",
      key: "isRequest",
      render: (text) => {
        return text ? (
          <span className="text-green-700 font-bold">Đã phản hồi</span>
        ) : (
          <span className="text-red-700 font-bold">Chưa phản hồi</span>
        );
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
                setSelectedRecord(text);
                updateForm.setFieldsValue(text);
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
                  .patch("/guestServices/" + id, { isDelete: true })
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
  const isColumns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Lời nhắn",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Phản hồi",
      dataIndex: "isRequest",
      key: "isRequest",
      render: (text) => {
        return text ? (
          <span className="text-green-700 font-bold">Đã phản hồi</span>
        ) : (
          <span className="text-red-700 font-bold">Chưa phản hồi</span>
        );
      },
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center ">
            {/* Button Delete */}
            <Popconfirm
              title="Bạn có chắc muốn xóa dòng này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/guestServices/" + id)
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
              <Button danger className="flex items-center rounded-2xl">
                Xóa
                {<AiFillDelete size={"16px"} />}
              </Button>
            </Popconfirm>
            <Button
              onClick={() => {
                const id = record._id;
                console.log("id", id);
                axiosClient
                  .patch("/guestServices/" + id, { isDelete: false })
                  .then((response) => {
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    console.log(err);
                    message.error("Thất bại !!!");
                  });
              }}
              className="flex items-center bg-blue-400 rounded-2xl text-white"
            >
              <FaTrashRestore size={"16px"} style={{ marginRight: "5px" }} />
              Restore
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    axiosClient
      .get("/guestServices")
      .then((response) => {
        let array = [];
        response.data.map((guest) => {
          if (guest.isDelete === false) {
            array.push(guest);
          }
        });
        // console.log(response.data);
        setGuestServices(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  useEffect(() => {
    axiosClient
      .get("/guestServices")
      .then((response) => {
        let array = [];
        response.data.map((guest) => {
          if (guest.isDelete === true) {
            array.push(guest);
          }
        });
        // console.log(response.data);
        setIsDelete(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/guestServices/" + selectedRecord._id, values)
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

  const [updateForm] = Form.useForm();

  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">
        👩‍🔧 Chăm Sóc Khách Hàng 👨‍🔧
      </h1>
      <div className="flex justify-end  ">
        <Button
          danger
          className=" flex items-center mb-3"
          onClick={() => {
            setEditFormDelete(true);
          }}
        >
          Nơi lưu danh mục đã xóa <AiFillDelete size={"20px"} />
        </Button>
      </div>
      <Table rowKey={"_id"} dataSource={guestServices} columns={columns} />

      <Modal
        centered
        open={editFormVisible}
        width={"50%"}
        title="Cập nhật phản hồi"
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
                {
                  required: true,
                  message: "Tên người dùng không được để trống!",
                },
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
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email bắt buộc nhập!" },
                { type: "email", message: `Đây không phải là một email` },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Lời nhắn */}
            <Form.Item hasFeedback className="" label="Lời nhắn" name="message">
              <TextArea rows={5} disabled />
            </Form.Item>

            <Form.Item label="Phản hồi" name="isRequest">
              <Select
                // defaultValue={["Kích hoạt"]}
                options={[
                  {
                    value: "true",
                    label: "Đã phản hồi",
                  },
                  {
                    value: "false",
                    label: "Chưa phản hồi",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        centered
        width={"80%"}
        title="Danh mục tạm thời xóa"
        open={editFormDelete}
        onCancel={() => {
          setEditFormDelete(false);
        }}
        okText="Lưu thay đổi"
        cancelText="Thoát"
      >
        <Table rowKey={"_id"} dataSource={isDelete} columns={isColumns} />
      </Modal>
    </>
  );
}

export default GuestService;
