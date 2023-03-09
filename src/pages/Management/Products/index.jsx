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
  AiOutlinePlus,
  AiOutlineLoading,
} from "react-icons/ai";
import { FaTrashRestore } from "react-icons/fa";
import "./products.css";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import { API_URL } from "../../../constants/URLS";
import TextArea from "antd/lib/input/TextArea";
function Products() {
  const [products, setProducts] = useState([]);
  const [isDelete, setIsDelete] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editFormDelete, setEditFormDelete] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [file, setFile] = useState();

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
              action={`${API_URL}/upload-image/products/${record._id}`}
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
                if (info.file.status === "done") {
                  message.success(`${info.file.name} Ảnh tải lên thành công`);
                  setRefresh((f) => f + 1);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} Ảnh tải lên thất bại.`);
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
              title="Bạn có chắc muốn xóa sản phẩm này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .patch("/products/" + id, { isDelete: true })
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
              <Button danger className=" py-5 flex items-center ">
                {" "}
                <AiFillDelete size={"16px"} style={{ marginRight: "5px" }} />
                Xóa
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const isColumns = [
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
            {/* Button Delete */}
            <Popconfirm
              icon={
                <AiFillQuestionCircle size={"24px"} className="text-red-600" />
              }
              title="Bạn có chắc muốn xóa sản phẩm này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/products/" + id)
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
              <Button danger className=" flex items-center rounded-2xl">
                {" "}
                <AiFillDelete size={"16px"} style={{ marginRight: "5px" }} />
                Xóa
              </Button>
            </Popconfirm>
            <Button
              onClick={() => {
                const id = record._id;
                console.log("id", id);
                axiosClient
                  .patch("/products/" + id, { isDelete: false })
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
  // useEffect(() => {
  //   axiosClient.get("/products").then((response) => {
  //     let array = [];
  //     setProducts(response.data);
  //   });
  // }, [refresh]);

  useEffect(() => {
    axiosClient
      .get("/products")
      .then((response) => {
        let array = [];
        // console.log(response.data);
        response.data.map((prod) => {
          if (prod.isDelete === false) {
            array.push(prod);
          }
        });
        // console.log(response.data);
        setProducts(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  useEffect(() => {
    axiosClient
      .get("/products")
      .then((response) => {
        let array = [];
        response.data.map((prod) => {
          // console.log(response.data);
          if (prod.isDelete === true) {
            array.push(prod);
          }
        });
        setIsDelete(array);
      })
      .catch((err) => {
        console.log(err);
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
        //UPLOAD FILE
        const { _id } = response.data;
        const formData = new FormData();
        formData.append("file", file);
        axios
          .post(`${API_URL}/upload-image/products/${_id}`, formData)
          .then((response) => {
            // message.success("Tải lên hình ảnh thành công!");
            createForm.resetFields();
            setRefresh((f) => f + 1);
          })
          .catch((err) => {
            message.error("Tải lên hình ảnh thất bại!");
          });
        message.success("Thêm thành công!");
      })
      .catch((err) => {
        message.error("Thêm thất bại!");
        console.log(err);
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
        const { _id } = response.data;
        const formData = new FormData();
        formData.append("file", file);
        axios
          .post(`${API_URL}/upload-image/products/${_id}`, formData)
          .then((response) => {
            message.success("Cập nhật thành công!");
            updateForm.resetFields();
            setRefresh((f) => f + 1);
            setEditFormVisible(false);
          })
          .catch((err) => {
            message.error("Tải lên hình ảnh thất bại!");
          });
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
        console.log(err);
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

          {/* Hình ảnh */}
          <Form.Item
            label="Hình ảnh"
            name="file"
            rules={[
              { required: true, message: "Hãy chọn hình ảnh cho sản phẩm!" },
            ]}
          >
            <Upload
              showUploadList={true}
              // listType="picture-card"
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
            >
              <div className="flex justify-center items-center w-[100px] h-[100px] border border-dashed rounded-lg hover:cursor-pointer hover:border-blue-400 hover:bg-white transition-all ease-in duration-150">
                <AiOutlinePlus size={"20px"} />
              </div>
            </Upload>
          </Form.Item>

          {/* Button Save */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <div className="flex justify-between">
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button
                danger
                className="text-right flex items-center"
                onClick={() => {
                  setEditFormDelete(true);
                }}
              >
                Nơi lưu danh mục đã xóa <AiFillDelete size={"20px"} />
              </Button>
            </div>
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

          {/* Hình ảnh */}
          <Form.Item
            label="Hình ảnh"
            name="file"
            rules={[
              { required: true, message: "Hãy chọn hình ảnh cho sản phẩm!" },
            ]}
          >
            <Upload
              showUploadList={true}
              // listType="picture-card"
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
            >
              <div className="flex justify-center items-center w-[100px] h-[100px] border border-dashed rounded-lg hover:cursor-pointer hover:border-blue-400 hover:bg-white transition-all ease-in duration-150">
                <AiOutlinePlus size={"20px"} />
              </div>
            </Upload>
          </Form.Item>
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

export default Products;
