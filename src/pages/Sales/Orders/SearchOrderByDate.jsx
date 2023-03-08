import React from "react";
import { Table, Button, Form, message, Input } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import numeral from "numeral";
import moment from "moment";
function SearchOrderByDate() {
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
  ];
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [searchForm] = Form.useForm();
  const onFinish = (values) => {
    setLoading(true);
    axiosClient
      .post("/orders/tim-don-hang-theo-ngay", values)
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Lỗi!");
        setLoading(false);
      });
  };

  const onFinishFailed = (errors) => {
    console.log("🐣", errors);
  };
  return (
    <>
      <div className="text-center m-[30px] text-[30px] text-primary font-bold">
        Tìm kiếm đơn hàng theo ngày
      </div>
      <div>
        <Form
          form={searchForm}
          name="search-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ status: "" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            hasFeedback
            className=""
            label="Nhập ngày hóa đơn cần tìm"
            name="createdDate"
            rules={[
              { required: true, message: "Không thể để trống" },
              //   {
              //     validator: (_, value) => {
              //       if (value > createdDate) {
              //         return Promise.resolve();
              //       } else {
              //         return Promise.reject("Ngày phải nhỏ ơn ngày hiện tại");
              //       }
              //     },
              //   },
            ]}
          >
            <Input className="w-[30%]" placeholder="Năm - Tháng - Ngày" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Đang xử lý ..." : "Lọc thông tin"}
            </Button>
          </Form.Item>
        </Form>
        <Table rowKey="_id" dataSource={orders} columns={columns} />
      </div>
    </>
  );
}

export default SearchOrderByDate;
