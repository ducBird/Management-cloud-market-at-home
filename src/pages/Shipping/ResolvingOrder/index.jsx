import React, { useState } from "react";
import numeral from "numeral";
import {
  Table,
  Button,
  Modal,
  Descriptions,
  Divider,
  Form,
  message,
  Input,
  Select,
  Space,
  Popconfirm,
  Upload,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { axiosClient } from "../../../libraries/axiosClient";
import axios from "axios";
import { API_URL } from "../../../constants/URLS";
import { useUser } from "../../../hooks/useUser";

export default function ResolvingOrder() {
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [isOpenFormAccept, setIsOpenFormAccept] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [employees, setEmployees] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [file, setFile] = useState();
  const { users } = useUser((state) => state);

  // GET ORDER HAVE CONFIRMED ORDER
  React.useEffect(() => {
    let orderResolving = [];
    if (selectedOrder) {
      axiosClient.get("orders/" + selectedOrder._id).then((response) => {
        setSelectedOrder(response.data);
      });
    }
    if (
      users.roles.some((role) => {
        return (
          role === "directors" ||
          role === "administrator" ||
          role === "managers"
        );
      })
    ) {
      axiosClient.get("/orders").then((response) => {
        response.data.map((order) => {
          if (order.status.includes("DELIVERY IN PROGRESS")) {
            orderResolving.push(order);
          }
        });
        setOrders(orderResolving);
      });
    } else {
      axiosClient.get("/orders").then((response) => {
        response.data.map((order) => {
          if (
            order.employeeId === users.id &&
            order.status.includes("DELIVERY IN PROGRESS")
          ) {
            orderResolving.push(order);
          }
        });
        setOrders(orderResolving);
      });
    }
  }, [refresh]);

  // get list employees
  React.useEffect(() => {
    axiosClient.get("/employees").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  const renderStatus = (result) => {
    return (
      <div>
        {result && result === "WAITING CONFIRMATION ORDER"
          ? "Đang Chờ Xác Nhận"
          : result === "CONFIRMED ORDER"
          ? "Đã Xác Nhận Đơn Hàng"
          : result === "SHIPPING CONFIRMATION"
          ? "Xác Nhận Vận Chuyển"
          : result === "DELIVERY IN PROGRESS"
          ? "Đang Giao Hàng"
          : result === "DELIVERY SUCCESS"
          ? "Giao Hàng Thành Công"
          : result === "RECEIVED ORDER"
          ? "Đã Nhận Hàng"
          : "Đã Hủy Đơn Hàng"}
      </div>
    );
  };

  const productColumns = [
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product.name",
      key: "product.name",
      render: (text, record) => {
        return <strong>{record?.product?.name}</strong>;
      },
    },
    {
      title: "Giá",
      dataIndex: "product.price",
      key: "product.price",
      render: (text, record) => {
        return (
          <div style={{ textAlign: "right" }}>
            {numeral(
              record?.product?.discount
                ? record?.product?.total
                : record?.product?.price
            ).format("0,0$")}
          </div>
        );
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "product.discount",
      key: "product.discount",
      render: (text, record) => {
        return (
          <div style={{ textAlign: "right" }}>
            {numeral(record?.product?.discount).format("0,0")}%
          </div>
        );
      },
    },
  ];

  // Orders have status == "COMFIRMED ORDER"
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return renderStatus(text);
      },
    },
    {
      title: "Nhân viên",
      dataIndex: "employee",
      key: "employee",
      render: (text, record) => {
        return <strong>{record.employee?.fullName}</strong>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (text, record) => {
        const { orderDetails } = record;

        let total = 0;
        orderDetails.forEach((od) => {
          let sum = od.quantity * od.product.total;
          total = total + sum;
        });

        return <strong>{numeral(total).format("0,0$")}</strong>;
      },
    },
    {
      title: "",
      key: "details",
      render: (text, record) => {
        return (
          <Button
            onClick={() => {
              setSelectedOrder(record);
            }}
          >
            Xem
          </Button>
        );
      },
    },
    // delete, update
    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record) => {
        return (
          <Space>
            {users.roles.some((role) => {
              return (
                role === "directors" ||
                role === "administrator" ||
                role === "managers"
              );
            }) ? (
              <Button
                type="dashed"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedRecord(record);
                  console.log("selectes", record);
                  updateForm.setFieldsValue(record);
                  setEditFormVisible(true);
                }}
              />
            ) : (
              <Button
                onClick={() => {
                  setSelectedRecord(record);
                  console.log("selectes", record);
                  // acceptForm.setFieldsValue(record);
                  setIsOpenFormAccept(true);
                }}
                className="text-green-500"
              >
                Xác Nhận
              </Button>
            )}
            {/* delete */}
            {users.roles.some((role) => {
              return (
                role === "directors" ||
                role === "administrator" ||
                role === "managers"
              );
            }) ? (
              <Popconfirm
                title="Bạn có muốn hủy đơn hàng không?"
                onConfirm={() => {
                  //Cancel order
                  const id = record._id;
                  axiosClient
                    .patch("/orders/" + id, {
                      employeeId: null,
                      status: "WAITING CONFIRMATION ORDER",
                    })
                    .then((response) => {
                      message.success("Hủy đơn hàng thành công!");
                      setRefresh((pre) => pre + 1);
                    })
                    .catch((err) => {
                      message.error("Hủy đơn hàng thất bại!");
                    });
                  console.log("Cancel order", record);
                }}
                onCancel={() => {}}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ) : (
              <></>
            )}
          </Space>
        );
      },
    },
  ];

  // update form
  const [updateForm] = Form.useForm();
  // accept delivery progress ship form
  const [acceptForm] = Form.useForm();

  // update form
  // xử lý cập nhật thông tin
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/orders/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công ❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
        console.log();
      })
      .catch((err) => {
        message.error("Cập nhật thất bại 😥");
      });
    console.log("❤", values);
  };
  const onUpdateFinishFailed = (errors) => {
    console.log("💣", errors);
  };

  // accept delivery progress ship form
  const onDeliverySuccess = (values) => {
    const { file } = values;
    axiosClient
      .patch("/orders/" + selectedRecord._id, {
        file,
        status: "DELIVERY SUCCESS",
        shippedDate: Date.now(),
      })
      .then((response) => {
        const { _id } = response.data;
        const formData = new FormData();
        formData.append("file", file.file);
        // console.log(file.file);
        axios
          .post(`${API_URL}/upload-image/orders/${_id}`, formData)
          .then((response) => {
            console.log("ok");
            setRefresh((f) => f + 1);
            setIsOpenFormAccept(false);
            message.success("Xác nhận giao hàng thành công!");
          })
          .catch((err) => {
            message.error("Tải lên hình ảnh thất bại!");
          });
      })
      .catch((err) => {
        console.log(err);
        message.error("Cập nhật thất bại 😥");
      });
    console.log("❤", values);
  };
  const onDeliverySuccessFailed = (errors) => {
    console.log("💣", errors);
  };

  return (
    <div>
      <h1 className="p-2 mb-5 text-xl">🛵 Đơn Hàng Đang Vận Chuyển</h1>
      {/* Modal view detail order */}
      <Modal
        centered
        title="Chi tiết đơn hàng"
        open={selectedOrder}
        onOk={() => {
          setSelectedOrder(null);
        }}
        onCancel={() => {
          setSelectedOrder(null);
        }}
        okText="Tiếp tục"
        cancelText="Đóng"
      >
        {selectedOrder && (
          <div>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: "700" }}
            >
              <Descriptions.Item label="Trạng thái">
                {renderStatus(selectedOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo hóa đơn">
                {selectedOrder.createdDate}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày giao">
                {selectedOrder.shippedDate}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Nhân viên">
                {selectedOrder.employee?.fullName}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Table
              rowKey="_id"
              dataSource={selectedOrder.orderDetails}
              columns={productColumns}
            />
          </div>
        )}
      </Modal>
      {/* Table view order have status == "COMFIRMED ORDER" */}
      <Table rowKey="_id" dataSource={orders} columns={columns} />
      {/* update form for roles = directors, administrator, managers */}
      <Modal
        centered
        open={editFormVisible}
        title="Cập nhật thông tin"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText="Lưu thông tin"
        cancelText="Đóng"
      >
        <Form
          form={updateForm}
          name="update-form"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="off"
        >
          <div className="w-[80%]">
            {/* Created Date */}
            <Form.Item
              hasFeedback
              className=""
              label="Ngày tạo"
              name="createdDate"
              rules={[{ required: false }]}
            >
              <Input />
            </Form.Item>

            {/* Shipped Date */}
            <Form.Item
              hasFeedback
              className=""
              label="Ngày giao"
              name="shippedDate"
              rules={[
                { required: true, type: "Date", message: "Không để trống" },
                { type: "date", message: "Ngày không hợp lệ" },
                {
                  validate: {
                    validator: function (value) {
                      if (!value) return true;
                      if (value < createDate) {
                        return false;
                      }
                      return true;
                    },
                    message: "Ngày giao phải nhỏ hơn ngày hiện tại",
                  },
                },
              ]}
            >
              <Input value={Date.now()} />
            </Form.Item>

            {/* Status */}
            <Form.Item
              hasFeedback
              className=""
              label="Trạng thái đơn hàng"
              name="status"
              rules={[
                { required: true, message: "Không thể để trống" },
                {
                  validator: (_, value) => {
                    if (
                      [
                        "WAITING CONFIRMATION ORDER",
                        "CONFIRMED ORDER",
                        "SHIPPING CONFIRMATION",
                        "DELIVERY IN PROGRESS",
                        "DELIVERY SUCCESS",
                        "RECEIVED ORDER",
                        "CANCELED ORDER",
                      ].includes(value)
                    ) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Trạng thái không hợp lệ!");
                    }
                  },
                },
              ]}
            >
              <Select
                options={[
                  {
                    value: "SHIPPING CONFIRMATION",
                    label: "Xác Nhận Vận Chuyển",
                  },
                  {
                    value: "DELIVERY IN PROGRESS",
                    label: "Đang Giao Hàng",
                  },
                ]}
              />
            </Form.Item>

            {/* Description */}
            <Form.Item
              hasFeedback
              className=""
              label="Mô tả"
              name="description"
            >
              <Input />
            </Form.Item>

            {/* Shipping Address */}
            <Form.Item
              hasFeedback
              className=""
              label="Địa chỉ giao hàng"
              name="shippingAddress"
              rules={[
                { required: true, message: "Please input Shipping Address!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Payment Type */}
            <Form.Item
              hasFeedback
              className=""
              label="Hình thức thanh toán"
              name="paymentType"
              rules={[{ required: true, message: "Không thể để trống" }]}
            >
              <Select
                options={[
                  {
                    value: "MOMO",
                    label: "MOMO",
                  },
                  {
                    value: "CASH",
                    label: "Thanh Toán Bằng Tiền Mặt",
                  },
                ]}
              />
            </Form.Item>

            {/* Customer */}
            <Form.Item
              className=""
              label="Khách hàng"
              name="fullName"
              rules={[{ required: true, message: "Please selected customer!" }]}
            >
              <Input />
            </Form.Item>
            {/* PhoneNumber */}
            <Form.Item
              className=""
              label="Số điện thoại"
              name="phoneNumber"
              rules={[{ required: true, message: "Please selected customer!" }]}
            >
              <Input />
            </Form.Item>
            {/* Employee */}
            <Form.Item
              className=""
              label="Nhân viên"
              name="employeeId"
              rules={[{ required: true, message: "Please selected empoyees!" }]}
            >
              <Select
                options={
                  employees &&
                  employees.map((employee) => {
                    return {
                      value: employee._id,
                      label: employee.fullName,
                    };
                  })
                }
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
      {/* form accept delivery success */}
      <Modal
        open={isOpenFormAccept}
        title="Xác nhận đã giao hàng"
        onOk={() => {
          acceptForm.submit();
        }}
        onCancel={() => {
          setIsOpenFormAccept(false);
        }}
        okText="Lưu thông tin"
        cancelText="Đóng"
      >
        <Form
          form={acceptForm}
          name="accept-form"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          onFinish={onDeliverySuccess}
          onFinishFailed={onDeliverySuccessFailed}
          autoComplete="off"
        >
          <div className="w-[80%]">
            <Form.Item
              label="Hình ảnh xác nhận"
              name="file"
              rules={[
                {
                  required: true,
                  message: "Hình ảnh xác nhận không được để trống!",
                },
              ]}
            >
              <Upload
                showUploadList={true}
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
              >
                <Button>
                  <UploadOutlined size={"20px"} />
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
