import React, { useState } from "react";
import numeral from "numeral";
import { Table, Button, Modal, Descriptions, Divider } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import { useUser } from "../../../hooks/useUser";
import { API_URL } from "../../../constants/URLS";

export default function ResolvedOrder() {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);
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
          if (order.status.includes("DELIVERY SUCCESS")) {
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
            order.status.includes("DELIVERY SUCCESS")
          ) {
            orderResolving.push(order);
          }
        });
        setOrders(orderResolving);
      });
    }
  }, [refresh]);

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
      title: "Hình ảnh xác nhận",
      dataIndex: "imageConfirm",
      key: "imageConfirm",
      render: (text, record) => {
        return (
          <div>
            {text && (
              <img
                className="max-w-[150px] w-[30%] min-w-[70px]"
                src={`${API_URL}${text}`}
                alt="image-confirm"
              />
            )}
          </div>
        );
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
  ];

  return (
    <div>
      <h1 className="p-2 mb-5 text-xl">✅ Đơn Hàng Đã Vận Chuyển</h1>
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
    </div>
  );
}
