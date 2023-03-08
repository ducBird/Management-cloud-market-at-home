import React from "react";
import { Table, Button, Form, message, Input } from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import moment from "moment";
function SearchCustomersByAddress() {
  const columns = [
    // {
    //   title: "Khách hàng",
    //   dataIndex: "fullName",
    //   key: "fullName",
    //   render: (text) => {
    //     return <p>{text}</p>;
    //   },
    // },
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => {
        return <p>{record.customers?.fullName}</p>;
      },
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
      title: "Ngày Sinh",
      dataIndex: "birthDay",
      key: "birthDay",
      render: (text) => {
        return <span>{moment(text).format("DD/MM/yyyy")}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      width: "10%",
      render: (text) => {
        return text ? (
          <span className="text-green-700 font-bold">Kích hoạt</span>
        ) : (
          <span className="text-red-700 font-bold">Thu hồi</span>
        );
      },
    },
  ];
  const [loading, setLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [searchForm] = Form.useForm();
  const onFinish = (values) => {
    setLoading(true);
    axiosClient
      .post("/customers/dia-chi-khach-hang", values)
      .then((response) => {
        setCustomers(response.data.results);
        console.log(response.data.results);
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
        Tìm kiếm khách hàng theo địa chỉ
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
            label="Nhập địa chỉ"
            name="address"
            rules={[{ required: true, message: "Không thể để trống" }]}
          >
            <Input className="w-[30%]" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Đang xử lý ..." : "Lọc thông tin"}
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <div className="text-right">Số lượng: {customers?.length}</div>
          </Form.Item>
        </Form>
        <Table
          rowKey={(customers) => customers._id}
          dataSource={customers}
          columns={columns}
        />
      </div>
    </>
  );
}

export default SearchCustomersByAddress;
