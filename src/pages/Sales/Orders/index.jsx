import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../../libraries/axiosClient';
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Select,
} from 'antd';
import { AiFillEdit, AiFillDelete, AiFillQuestionCircle } from 'react-icons/ai';
import './orders.css';
import moment from 'moment';
import numeral from 'numeral';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text) => {
        return <span>{moment(text).format('DD/MM/yyyy')}</span>;
      },
    },
    {
      title: 'Ngày Giao',
      dataIndex: 'shippedDate',
      key: 'shippedDate',
      render: (text) => {
        return <span>{moment(text).format('DD/MM/yyyy')}</span>;
      },
    },
    {
      title: 'Trạng Thái Đơn Hàng',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Địa Chỉ Giao Hàng',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Hình Thức Thanh Toán',
      dataIndex: 'paymentType',
      key: 'paymentType',
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (text, record) => {
        return <strong>{record?.customer?.fullName}</strong>;
      },
    },
    {
      title: 'Nhân Viên',
      dataIndex: 'employee',
      key: 'employee',
      render: (text, record) => {
        return <strong>{record?.employee?.fullName}</strong>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: '1%',
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
              {<AiFillEdit size={'16px'} />}
            </Button>
            {/* Button Delete */}
            <Popconfirm
              icon={
                <AiFillQuestionCircle size={'24px'} className="text-red-600" />
              }
              title="Are you sure to delete this task?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete('/orders/' + id)
                  .then((response) => {
                    message.success('Deleted Successfully');
                    setRefresh((f) => f + 1);
                  })
                  .catch((errors) => {
                    message.error('Deleted Failed');
                  });
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button className="py-5 flex items-center" danger>
                {<AiFillDelete size={'16px'} />}
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    axiosClient.get('/orders').then((response) => {
      setOrders(response.data);
    });
  }, [refresh]);

  // get list customers
  useEffect(() => {
    axiosClient.get('/customers').then((response) => {
      setCustomers(response.data);
    });
  }, []);

  // get list employees
  useEffect(() => {
    axiosClient.get('/employees').then((response) => {
      setEmployees(response.data);
    });
  }, []);

  const onFinish = (values) => {
    axiosClient
      .post('/orders', values)
      .then((response) => {
        message.success('Thêm Hóa Đơn thành công!');
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error('Thêm Hóa Đơn thất bại!');
        // console.log(err);
      });
    console.log('👌👌👌', values);
  };
  const onFinishFailed = (errors) => {
    console.log('💣💣💣 ', errors);
  };
  const onUpdateFinish = (values) => {
    axiosClient
      .patch('/orders/' + selectedRecord._id, values)
      .then((response) => {
        message.success('Cập nhật thông tin thành công!');
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error('Cập nhật thông tin thất bại!');
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log('🐣', errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">📑 Orders 📑</h1>
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
        <div className="w-[80%]">
          {/* Created Date */}
          <Form.Item
            hasFeedback
            className=""
            label="Ngày tạo"
            name="createdDate"
          >
            <Input />
          </Form.Item>

          {/* Shipped Date */}
          <Form.Item
            hasFeedback
            className=""
            label="Ngày giao"
            name="shippedDate"
            // rules={[
            //   { type: 'date', message: 'Invalid datetime' },
            //   {
            //     validator: function (value) {
            //       if (!value) return true;
            //       if (value < this.createDate) {
            //         return false;
            //       }
            //       return true;
            //     },
            //     message: `Shipped date: {VALUE} < Created Date!`,
            //   },
            // ]}
          >
            <Input />
          </Form.Item>

          {/* Status */}
          <Form.Item
            hasFeedback
            className=""
            label="Trạng thái đơn hàng"
            name="status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select
              options={[
                {
                  value: 'COMPLETED',
                  label: 'COMPLETED',
                },
                {
                  value: 'WAITING',
                  label: 'WAITING',
                },
                {
                  value: 'CANCELED',
                  label: 'CANCELED',
                },
              ]}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item hasFeedback className="" label="Mô tả" name="description">
            <Input />
          </Form.Item>

          {/* Shipping Address */}
          <Form.Item
            hasFeedback
            className=""
            label="Địa chỉ giao hàng"
            name="shippingAddress"
            rules={[
              { required: true, message: 'Please input Shipping Address!' },
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
            rules={[{ required: true, message: 'Please select payment type!' }]}
          >
            <Select
              options={[
                {
                  value: 'CREDIT CARD',
                  label: 'CREDIT CARD',
                },
                {
                  value: 'CASH',
                  label: 'CASH',
                },
              ]}
            />
          </Form.Item>

          {/* Customer */}
          <Form.Item
            className=""
            label="Khách hàng"
            name="customerId"
            rules={[{ required: true, message: 'Please selected customer!' }]}
          >
            <Select
              options={
                customers &&
                customers.map((customer) => {
                  return {
                    value: customer._id,
                    label: customer.lastName,
                  };
                })
              }
            />
          </Form.Item>

          {/* Employee */}
          <Form.Item
            className=""
            label="Nhân viên"
            name="employeeId"
            rules={[{ required: true, message: 'Please selected suplier!' }]}
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

          {/* Button Save */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </div>
      </Form>
      <Table rowKey="_id" dataSource={orders} columns={columns} />

      <Modal
        centered
        open={editFormVisible}
        title="Cập nhật thông tin hóa đơn"
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
          <Form.Item
            hasFeedback
            className=""
            label="Ngày tạo"
            name="createdDate"
          >
            <Input />
          </Form.Item>

          {/* Shipped Date */}
          <Form.Item
            hasFeedback
            className=""
            label="Ngày giao"
            name="shippedDate"
            // rules={[
            //   { type: 'date', message: 'Invalid datetime' },
            //   {
            //     validator: function (value) {
            //       if (!value) return true;
            //       if (value < this.createDate) {
            //         return false;
            //       }
            //       return true;
            //     },
            //     message: `Shipped date: {VALUE} < Created Date!`,
            //   },
            // ]}
          >
            <Input />
          </Form.Item>

          {/* Status */}
          <Form.Item
            hasFeedback
            className=""
            label="Trạng thái đơn hàng"
            name="status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select
              options={[
                {
                  value: 'COMPLETED',
                  label: 'COMPLETED',
                },
                {
                  value: 'WAITING',
                  label: 'WAITING',
                },
                {
                  value: 'CANCELED',
                  label: 'CANCELED',
                },
              ]}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item hasFeedback className="" label="Mô tả" name="description">
            <Input />
          </Form.Item>

          {/* Shipping Address */}
          <Form.Item
            hasFeedback
            className=""
            label="Địa chỉ giao hàng"
            name="shippingAddress"
            rules={[
              { required: true, message: 'Please input Shipping Address!' },
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
            rules={[{ required: true, message: 'Please select payment type!' }]}
          >
            <Select
              options={[
                {
                  value: 'CREDIT CARD',
                  label: 'CREDIT CARD',
                },
                {
                  value: 'CASH',
                  label: 'CASH',
                },
              ]}
            />
          </Form.Item>

          {/* Customer */}
          <Form.Item
            className=""
            label="Khách hàng"
            name="customerId"
            rules={[{ required: true, message: 'Please selected customer!' }]}
          >
            <Select
              options={
                customers &&
                customers.map((customer) => {
                  return {
                    value: customer._id,
                    label: customer.lastName,
                  };
                })
              }
            />
          </Form.Item>

          {/* Employee */}
          <Form.Item
            className=""
            label="Nhân viên"
            name="employeeId"
            rules={[{ required: true, message: 'Please selected suplier!' }]}
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
        </Form>
      </Modal>
    </>
  );
}

export default Orders;
