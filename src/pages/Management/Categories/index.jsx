import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  Modal,
  message,
  Upload,
  Select,
} from "antd";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineUpload,
  AiOutlinePlus,
  AiOutlineLoading,
  AiFillQuestionCircle,
} from "react-icons/ai";
import { FaTrashRestore } from "react-icons/fa";
import "./categories.css";
import axios from "axios";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { API_URL } from "../../../constants/URLS";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [isDelete, setIsDelete] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editFormDelete, setEditFormDelete] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [file, setFile] = useState();
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageURL",
      key: "imageURL",
      width: "20%",
      render: (text, record) => {
        return (
          <div className="text-center">
            {text && (
              <img
                className="max-w-[150px] w-[30%] min-w-[70px]"
                src={`${API_URL}${text}`}
                alt=""
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center">
            {/* Button Upload Image */}
            <Upload
              showUploadList={false}
              name="file"
              data={{ name: "uploads file image category" }}
              action={`${API_URL}/upload-image/categories/${record._id}`}
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
                if (info.file.status === "done") {
                  message.success(`${info.file.name} file tải lên thành công`);
                  setRefresh((f) => f + 1);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} file tải lên thất bại.`);
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
              title="Bạn có chắc muốn xóa danh mục này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .patch("/categories/" + id, { isDelete: true })
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
      title: "Hình ảnh",
      dataIndex: "imageURL",
      key: "imageURL",
      width: "20%",
      render: (text, record) => {
        return (
          <div className="text-center">
            {text && (
              <img
                className="max-w-[150px] w-[30%] min-w-[70px]"
                src={`${API_URL}${text}`}
                alt=""
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: " Chức năng",
      render: (text, record) => {
        return (
          <div className="flex">
            <Popconfirm
              icon={
                <AiFillQuestionCircle size={"24px"} className="text-red-600" />
              }
              title="Bạn có chắc muốn xóa vĩnh viễn danh mục này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/categories/" + id)
                  //{isDelete:true là mình sẽ lấy giá trị isDelete và xét nó về giá trị true}
                  .then((response) => {
                    message.success("Đã xóa thành công");
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    console.log(err);
                    message.error("Thất bại !!!");
                  });
              }}
              onCancel={() => {}}
              okText="Có"
              cancelText="Không"
            >
              <Button danger className=" flex items-center rounded-2xl mr-3">
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
                  .patch("/categories/" + id, { isDelete: false })
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
    {},
  ];

  useEffect(() => {
    axiosClient
      .get("/categories")
      .then((response) => {
        let array = [];
        response.data.map((cate) => {
          if (cate.isDelete === false) {
            array.push(cate);
          }
        });
        // console.log(response.data);
        setCategories(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  useEffect(() => {
    axiosClient.get("/categories").then((response) => {
      let array = [];
      response.data.map((cate) => {
        if (cate.isDelete === true) {
          array.push(cate);
        }
      });
      setIsDelete(array);
    });
  }, [refresh]);
  const onFinish = (values) => {
    axiosClient
      .post("/categories", values)
      .then((response) => {
        if (values.file !== undefined) {
          //UPLOAD FILE
          const { _id } = response.data;
          const formData = new FormData();
          formData.append("file", file);
          axios
            .post(`${API_URL}/upload-image/categories/${_id}`, formData)
            .then((response) => {
              // createForm.resetFields();
              createForm.resetFields();
              setRefresh((f) => f + 1);
              message.success("Thêm thành công!");
            })
            .catch((err) => {
              message.error("Tải lên hình ảnh thất bại!");
            });
        }
        setHiddenForm(true);
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
      .patch("/categories/" + selectedRecord._id, values)
      .then((response) => {
        if (values.file !== undefined) {
          const { _id } = response.data;
          const formData = new FormData();
          formData.append("file", file);
          console.log("file", file);
          axios
            .post(`${API_URL}/upload-image/categories/${_id}`, formData)
            .then((response) => {
              message.success("Cập nhật thành công!");
              setRefresh((f) => f + 1);
              setEditFormVisible(false);
            })
            .catch((err) => {
              message.error("Tải lên hình ảnh thất bại!");
            });
        }
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
        console.log(err);
      });
  };
  const onUpdateFinishFailed = (errors) => {
    console.log("💣💣💣 ", errors);
  };
  const onSearchFinish = (values) => {
    setLoading(true);
    axiosClient
      .post("/customers/dia-chi-khach-hang", values)
      .then((response) => {
        setCustomers(response.data.results);
        console.log(response.data.results);
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
  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">
        📝 Quản Lý Danh Mục Sản Phẩm 📝
      </h1>

      {/* Form tìm kiếm */}
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
          {/* Tên danh mục */}
          <Form.Item hasFeedback className="" label="Tên danh mục" name="name">
            <Select
              options={
                categories &&
                categories.map((categorie) => {
                  return {
                    value: categorie._id,
                    label: categorie.name,
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
        </Form>
      </div>

      <Button
        className="bg-blue-500 text-white font-bold mb-5 mt-5"
        onClick={() => {
          setCreateFormVisible(true);
          console.log("ok");
        }}
      >
        Thêm mới danh mục
      </Button>
      <Modal
        centered
        open={createFormVisible}
        title="Thêm mới thông tin danh mục"
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
          <div className="w-[80%]">
            {/* Tên danh mục */}
            <Form.Item
              hasFeedback
              className=""
              label="Tên danh mục"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Tên danh mục không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Mô tả */}
            <Form.Item
              hasFeedback
              className=""
              label="Mô tả"
              name="description"
            >
              <TextArea rows={5} />
            </Form.Item>

            {/* Hình ảnh */}
            {/* <Form.Item label="Hình ảnh" name="file">
            <Upload
              showUploadList={true}
              listType="picture-card"
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
            >
              <AiOutlinePlus size={"20px"} />
            </Upload>
          </Form.Item> */}
            <Form.Item label="Hình ảnh" name="file">
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
          </div>
        </Form>
      </Modal>

      <Button
        danger
        className="text-right flex items-center"
        onClick={() => {
          setEditFormDelete(true);
        }}
      >
        Nơi lưu danh mục đã xóa <AiFillDelete size={"20px"} />
      </Button>

      <Table rowKey={"_id"} dataSource={categories} columns={columns} />

      <Modal
        centered
        title="Cập Nhật Danh Mục"
        open={editFormVisible}
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
          {/* Tên danh mục */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Tên danh mục không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item hasFeedback className="" label="Mô tả" name="description">
            <TextArea rows={5} />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="file">
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

export default Categories;
