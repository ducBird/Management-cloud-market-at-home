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
} from "antd";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineUpload,
  AiOutlinePlus,
  AiOutlineLoading,
} from "react-icons/ai";
import "./categories.css";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { API_URL } from "../../../constants/URLS";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      title: "",
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
              action={
                "http://localhost:9000/upload-categories/categories/" +
                record._id
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
              title="Are you sure to delete this task?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .delete("/categories/" + id)
                  .then((response) => {
                    message.success("Deleted Successfully!");
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    console.log(err);
                    message.error("Deleted Failed!");
                  });
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
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

  useEffect(() => {
    axiosClient
      .get("/categories")
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const onFinish = (values) => {
    axiosClient
      .post("/categories", values)
      .then((response) => {
        message.success("Successfully Added!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Added Failed!");
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
        message.success("Successfully Updated!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Updated Failed!");
        console.log(err);
      });
  };
  const onUpdateFinishFailed = (errors) => {
    console.log("💣💣💣 ", errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">
        📝 Quản Lý Danh Mục Sản Phẩm 📝
      </h1>
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
            rules={[{ required: true, message: "Please input name category!" }]}
          >
            <Input />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item hasFeedback className="" label="Mô tả" name="description">
            <TextArea rows={5} />
          </Form.Item>

          {/* Hình ảnh */}
          <Form.Item
            hasFeedback
            className=""
            label="Hình ảnh"
            name="imageUrl"
            valuePropName=""
          >
            <Upload
              showUploadList={false}
              listType="picture-card"
              name="file"
              action={"http://localhost:9000/uploadsCategories/categories/"}
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
              <AiOutlinePlus size={"20px"} />
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </div>
      </Form>
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
            rules={[{ required: true, message: "Please input name category!" }]}
          >
            <Input />
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

export default Categories;
