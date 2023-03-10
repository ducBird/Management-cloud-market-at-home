import React from "react";
import numeral from "numeral";
import moment from "moment";
import {
  Table,
  Button,
  Card,
  Modal,
  Descriptions,
  Divider,
  Form,
  message,
  Input,
  Select,
  Space,
  Popconfirm,
  DatePicker,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "../../../libraries/axiosClient";

export default function Orders() {
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [addProductsModalVisible, setAddProductsModalVisible] =
    React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const [createFormVisible, setCreateFormVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // Products
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
    });
  }, [refresh]);

  React.useEffect(() => {
    if (selectedOrder) {
      axiosClient.get("orders/" + selectedOrder._id).then((response) => {
        setSelectedOrder(response.data);
      });
    }
    axiosClient.get("/orders").then((response) => {
      setOrders(response.data);
    });
  }, [refresh]);

  // get list employees have roles is "shipper"
  React.useEffect(() => {
    let shippers = [];
    axiosClient.get("/employees").then((response) => {
      response.data.map((shipper) => {
        if (shipper.roles.includes("shipper")) {
          shippers.push(shipper);
        }
      });
      setEmployees(shippers);
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
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        return (
          <Button
            onClick={async () => {
              setRefresh(false);
              const currentProduct = record;
              const response = await axiosClient.get(
                "orders/" + selectedOrder._id
              );
              const currentOrder = response.data;
              const { orderDetails } = currentOrder;
              const remainOrderDetails = orderDetails.filter((x) => {
                return (
                  x.productId.toString() !== currentProduct.productId.toString()
                );
              });
              await axiosClient.patch("orders/" + selectedOrder._id, {
                orderDetails: remainOrderDetails,
              });

              setAddProductsModalVisible(false);
              message.success("Xóa thành công");
              setRefresh(true);
            }}
          >
            Xóa
          </Button>
        );
      },
    },
  ];

  // Orders
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
      title: "Ngày tạo hóa đơn",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => {
        return <p>{moment(text).format("DD/MM/yyyy")}</p>;
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
      key: "actions",
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
            {/* Update */}
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
            {/* delete */}
            <Popconfirm
              title="Bạn có muốn hủy đơn hàng không?"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/orders/" + id)
                  .then((response) => {
                    message.success("Hủy đơn hàng thành công!");
                    setRefresh((pre) => pre + 1);
                  })
                  .catch((err) => {
                    message.error("Hủy đơn hàng thất bại!");
                  });
                console.log("delete", record);
              }}
              onCancel={() => {}}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const [orders, setOrders] = React.useState([]);

  // create form
  const [createForm] = Form.useForm();
  // update form
  const [updateForm] = Form.useForm();
  // search form
  const [searchForm] = Form.useForm();

  // tạo mới form
  const onFinish = (values) => {
    axiosClient
      .post("/orders", values)
      .then((response) => {
        message.success("Thêm Hóa Đơn thành công!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Thêm Hóa Đơn thất bại!");
        console.log({ message: message.err });
      });
    console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors) => {
    console.log("💣💣💣 ", errors);
  };

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

  // validate ngày hóa đơn
  const dateOfValidator = (rule, value, callback) => {
    const dateFormat = "YYYY/MM/DD"; // Định dạng ngày tháng
    const currentDate = moment(); // Lấy ngày hiện tại
    const dateOfCreatedDate = moment(value, dateFormat); // Chuyển đổi giá trị nhập vào thành kiểu moment

    // Kiểm tra tính hợp lệ của ngày sinh
    if (currentDate.diff(dateOfCreatedDate, "days") < 0) {
      callback("Ngày hóa đơn phải nhỏ hơn ngày hiện tại");
    } else {
      callback();
    }
  };
  return (
    <div>
      <h1 className="text-center p-2 mb-5 text-xl">📑 Quản Lý Đơn Hàng 📑</h1>
      {/* Tìm kiếm đơn hàng */}
      <div className="border border-solid rounded-md">
        <p className="text-center text-primary text-[17px] font-bold">
          Tìm kiếm
        </p>
        <div className="mx-auto">
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
            <div className="w-[100%]">
              {/* Created Date */}
              <Form.Item
                hasFeedback
                className=""
                label="Ngày tạo"
                name="createdDate"
                rules={[
                  {
                    validator: dateOfValidator,
                  },
                  { type: "date", message: "Ngày không hợp lệ" },
                ]}
              >
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>

              {/* Shipped Date */}
              <Form.Item
                hasFeedback
                className=""
                label="Ngày giao"
                name="shippedDate"
                rules={[
                  {
                    validator: dateOfValidator,
                  },
                  { type: "date", message: "Ngày không hợp lệ" },
                ]}
              >
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>

              {/* Status */}
              <Form.Item
                hasFeedback
                className=""
                label="Trạng thái đơn hàng"
                name="status"
              >
                <Select
                  options={[
                    {
                      value: "WAITING CONFIRMATION ORDER",
                      label: "Đang Chờ Xác Nhận",
                    },
                    {
                      value: "CONFIRMED ORDER",
                      label: "Đã Xác Nhận Đơn Hàng",
                    },
                    {
                      value: "SHIPPING CONFIRMATION",
                      label: "Xác Nhận Vận Chuyển",
                    },
                    {
                      value: "DELIVERY IN PROGRESS",
                      label: "Đang Giao Hàng",
                    },
                    {
                      value: "DELIVERY SUCCESS",
                      label: "Giao Hàng Thành Công",
                    },
                    {
                      value: "RECEIVED ORDER",
                      label: "Đã Nhận Hàng",
                    },
                    {
                      value: "CANCELED ORDER",
                      label: "Đã Hủy Đơn Hàng",
                    },
                  ]}
                />
              </Form.Item>

              {/* Shipping Address */}
              <Form.Item
                hasFeedback
                className=""
                label="Địa chỉ giao hàng"
                name="shippingAddress"
              >
                <Input />
              </Form.Item>

              {/* Payment Type */}
              <Form.Item
                hasFeedback
                className=""
                label="Hình thức thanh toán"
                name="paymentType"
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
              <Form.Item className="" label="Khách hàng" name="fullName">
                <Input />
              </Form.Item>
              {/* PhoneNumber */}
              <Form.Item
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
              {/* Employee */}
              <Form.Item className="" label="Nhân viên" name="employeeId">
                <Select
                  options={
                    employees &&
                    employees.map((suplier) => {
                      return {
                        value: suplier._id,
                        label: suplier.fullName,
                      };
                    })
                  }
                />
              </Form.Item>

              {/* Button Lọc thông tin */}
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {loading ? "Đang xử lý ..." : "Lọc thông tin"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>

      {/* Modal thêm mới sản phẩm */}
      <Button
        className="bg-blue-500 text-white font-bold mb-5 mt-5"
        onClick={() => {
          setCreateFormVisible(true);
          console.log("ok");
        }}
      >
        Thêm mới đơn hàng
      </Button>
      <Modal
        centered
        open={createFormVisible}
        title="Thêm mới thông tin đơn hàng"
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
          <div className="w-[100%]">
            {/* Created Date */}
            <Form.Item
              hasFeedback
              className=""
              label="Ngày tạo"
              name="createdDate"
              rules={[
                { required: true, message: "Không thể để trống" },
                {
                  validator: dateOfValidator,
                },
                { type: "date", message: "Ngày không hợp lệ" },
              ]}
            >
              <DatePicker format="YYYY/MM/DD" />
            </Form.Item>

            {/* Shipped Date */}
            <Form.Item
              hasFeedback
              className=""
              label="Ngày giao"
              name="shippedDate"
              rules={[
                {
                  validator: dateOfValidator,
                },
                { type: "date", message: "Ngày không hợp lệ" },
              ]}
            >
              <DatePicker format="YYYY/MM/DD" />
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
                    value: "WAITING CONFIRMATION ORDER",
                    label: "Đang Chờ Xác Nhận",
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
              rules={[{ required: true, message: "Không thể để trống" }]}
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
              rules={[{ required: true, message: "Không thể để trống" }]}
            >
              <Input />
            </Form.Item>
            {/* PhoneNumber */}
            <Form.Item
              className=""
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
                { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
                { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
                {
                  validator: phoneValidator,
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* Employee */}
            <Form.Item
              className=""
              label="Nhân viên"
              name="employeeId"
              rules={[{ required: true, message: "Không thể để trống" }]}
            >
              <Select
                options={
                  employees &&
                  employees.map((suplier) => {
                    return {
                      value: suplier._id,
                      label: suplier.fullName,
                    };
                  })
                }
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        centered
        title="Chi tiết đơn hàng"
        open={selectedOrder}
        onCancel={() => {
          setSelectedOrder(null);
        }}
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

            <Button
              onClick={() => {
                setAddProductsModalVisible(true);
                setRefresh(false);
              }}
            >
              Thêm sản phẩm
            </Button>

            <Modal
              centered
              title="Danh sách sản phẩm"
              open={addProductsModalVisible}
              onCancel={() => {
                setAddProductsModalVisible(false);
              }}
              onOk={() => {
                setRefresh(true);
              }}
            >
              {products &&
                products.map((product) => {
                  return (
                    <Card key={product._id}>
                      <strong>{product.name}</strong>
                      <Button
                        onClick={async () => {
                          const response = await axiosClient.get(
                            "orders/" + selectedOrder._id
                          );
                          const currentOrder = response.data;
                          const { orderDetails } = currentOrder;
                          const found = orderDetails.find(
                            (x) => x.productId === product._id
                          );
                          if (found) {
                            found.quantity++;
                          } else {
                            orderDetails.push({
                              productId: product._id,
                              quantity: 1,
                            });
                          }

                          await axiosClient.patch(
                            "orders/" + selectedOrder._id,
                            {
                              orderDetails,
                            }
                          );

                          setAddProductsModalVisible(false);
                          // RELOAD //

                          setRefresh(true);
                        }}
                      >
                        Add
                      </Button>
                    </Card>
                  );
                })}
            </Modal>
          </div>
        )}
      </Modal>

      {/* update form */}
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
          disabled={
            selectedRecord &&
            selectedRecord.status === "WAITING CONFIRMATION ORDER"
              ? false
              : true
          }
        >
          <div className="w-[80%]">
            {/* Created Date */}
            <Form.Item
              hasFeedback
              className=""
              label="Ngày tạo"
              name="createdDate"
              rules={[
                { required: true, message: "Không thể để trống" },
                {
                  validator: dateOfValidator,
                },
                { type: "date", message: "Ngày không hợp lệ" },
              ]}
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
                {
                  validator: dateOfValidator,
                },
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
                    value: "WAITING CONFIRMATION ORDER",
                    label: "Đang Chờ Xác Nhận",
                  },
                  {
                    value: "CONFIRMED ORDER",
                    label: "Đã Xác Nhận Đơn Hàng",
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
              rules={[{ required: true, message: "Không thể để trống" }]}
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
              rules={[{ required: true, message: "Không thể để trống" }]}
            >
              <Input />
            </Form.Item>
            {/* PhoneNumber */}
            <Form.Item
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
            {/* Employee */}
            <Form.Item
              className=""
              label="Nhân viên"
              name="employeeId"
              rules={[{ required: true, message: "Không thể để trống" }]}
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

      <Table rowKey="_id" dataSource={orders} columns={columns} />
    </div>
  );
}
