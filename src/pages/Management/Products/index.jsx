import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
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
  Upload,
} from "antd";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillQuestionCircle,
  AiOutlineUpload,
} from "react-icons/ai";
import "./products.css";
import moment from "moment";
import numeral from "numeral";
import { API_URL } from "../../../constants/URLS";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text, record) => {
        return <strong>{record?.category?.name}</strong>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "15%",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "",
      dataIndex: "imageProduct",
      key: "imageProduct",
      render: (text, record) => {
        return (
          <div className="text-center">
            {text && (
              <img
                className="max-w-[150px] w-[30%] min-w-[70px]"
                src={`${API_URL}${text}`}
                alt="image-product"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => {
        return <span>{numeral(text).format("0,0$")}</span>;
      },
    },
    {
      title: "Giảm",
      dataIndex: "discount",
      key: "discount",
      render: (text) => {
        return <span>{numeral(text).format("0,0.0")}%</span>;
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (text) => {
        return <span>{numeral(text).format("0,0.0")}</span>;
      },
    },
    {
      title: "Đơn vị tính",
      dataIndex: "dram",
      key: "dram",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    // {
    //   title: 'Nhà cung cấp',
    //   dataIndex: 'supplier',
    //   key: 'supplier',
    //   render: (text, record) => {
    //     return <strong>{record?.supplier?.name}</strong>;
    //   },
    // },
    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            {/* Button Upload Image */}
            <Upload
              showUploadList={false}
              name="file"
              data={{ name: "uploads file image products" }}
              action={
                "http://localhost:9000/upload-products/products/" + record._id
              }
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  console.log(info.file, info.fileList);
                }

                if (info.file.status === "done") {
                  message.success(
                    `${info.file.name} file uploaded successfully`
                  );
                  setRefresh((f) => f + 1);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <Button
                className="py-5 flex justify-center items-center"
                icon={<AiOutlineUpload size={"20px"} />}
              />
            </Upload>
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
              title="Are you sure to delete this task?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/products/" + id)
                  .then((response) => {
                    message.success("Deleted Successfully");
                    setRefresh((f) => f + 1);
                  })
                  .catch((errors) => {
                    message.error("Deleted Failed");
                  });
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
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
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
    });
  }, [refresh]);

  // get list categories
  useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  // get list suppliers
  useEffect(() => {
    axiosClient.get("/suppliers").then((response) => {
      setSuppliers(response.data);
    });
  }, []);

  const onFinish = (values) => {
    axiosClient
      .post("/products", values)
      .then((response) => {
        message.success("Successfully Added!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Added Failed");
        // console.log(err);
      });
    console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors) => {
    console.log("💣💣💣 ", errors);
  };
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/products/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Successfully Updated!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Updated Failed!");
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">🛒 Quản Lý Sản Phẩm 🛒</h1>
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
          {/* Danh mục sản phẩm */}
          <Form.Item
            className=""
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Please selected category!" }]}
          >
            <Select
              options={
                categories &&
                categories.map((category) => {
                  return {
                    value: category._id,
                    label: category.name,
                  };
                })
              }
            />
          </Form.Item>

          {/* Tên sản phẩm */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>

          {/* Giá tiền */}
          <Form.Item
            hasFeedback
            className=""
            label="Giá tiền"
            name="price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber className="w-[50%]" addonAfter="VND" />
          </Form.Item>

          {/* Giảm giá */}
          <Form.Item hasFeedback className="" label="Giảm giá" name="discount">
            <InputNumber className="w-[50%]" addonAfter="%" />
          </Form.Item>

          {/* Tồn kho */}
          <Form.Item hasFeedback className="" label="Tồn kho" name="stock">
            <InputNumber className="w-[50%]" />
          </Form.Item>

          {/* Đơn vị tính */}
          <Form.Item hasFeedback className="" label="Đơn vị tính" name="dram">
            <Input className="w-[50%]" />
          </Form.Item>

          {/* Nhà cung cấp */}
          <Form.Item
            className=""
            label="Nhà cung cấp"
            name="supplierId"
            rules={[{ required: true, message: "Please selected suplier!" }]}
          >
            <Select
              options={
                suppliers &&
                suppliers.map((suplier) => {
                  return {
                    value: suplier._id,
                    label: suplier.name,
                  };
                })
              }
            />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item hasFeedback className="" label="Mô tả" name="description">
            <TextArea rows={5} />
          </Form.Item>

          {/* Button Save */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </div>
      </Form>
      <Table rowKey="_id" dataSource={products} columns={columns} />
      <Modal
        centered
        open={editFormVisible}
        title="Cập nhật sản phẩm"
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
          {/* Danh mục sản phẩm */}
          <Form.Item
            className=""
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Please selected category!" }]}
          >
            <Select
              options={
                categories &&
                categories.map((category) => {
                  return {
                    value: category._id,
                    label: category.name,
                  };
                })
              }
            />
          </Form.Item>

          {/* Tên sản phẩm */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>

          {/* Giá tiền */}
          <Form.Item
            hasFeedback
            className=""
            label="Giá tiền"
            name="price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber className="w-[50%]" addonAfter="VND" />
          </Form.Item>

          {/* Giảm giá */}
          <Form.Item hasFeedback className="" label="Giảm giá" name="discount">
            <InputNumber className="w-[50%]" addonAfter="%" />
          </Form.Item>

          {/* Tồn kho */}
          <Form.Item hasFeedback className="" label="Tồn kho" name="stock">
            <InputNumber className="w-[50%]" />
          </Form.Item>

          {/* Đơn vị tính */}
          <Form.Item hasFeedback className="" label="Đơn vị tính" name="dram">
            <Input className="w-[50%]" />
          </Form.Item>

          {/* Nhà cung cấp */}
          <Form.Item
            className=""
            label="Nhà cung cấp"
            name="supplierId"
            rules={[{ required: true, message: "Please selected suplier!" }]}
          >
            <Select
              options={
                suppliers &&
                suppliers.map((suplier) => {
                  return {
                    value: suplier._id,
                    label: suplier.name,
                  };
                })
              }
            />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item hasFeedback className="" label="Mô tả" name="description">
            <TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Products;
