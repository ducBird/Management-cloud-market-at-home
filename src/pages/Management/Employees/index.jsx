import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import { API_URL } from "../../../constants/URLS";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  Checkbox,
  Modal,
  message,
  Select,
  Upload,
  DatePicker,
} from "antd";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineUpload,
  AiOutlinePlus,
  AiFillQuestionCircle,
} from "react-icons/ai";
import "./employees.css";
import axios from "axios";
import moment from "moment";
import { useUser } from "../../../hooks/useUser";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isDelete, setIsDelete] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editFormDelete, setEditFormDelete] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [file, setFile] = useState();
  const { users } = useUser((state) => state);
  const [loading, setLoading] = React.useState(false);
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const renderRoles = (arr) => {
    return arr.map((a, index) => {
      return (
        <div
          key={index}
          className="border border-solid border-blue-800 rounded mb-1 text-center"
        >
          {a}
        </div>
      );
    });
  };

  let AUTHORIZATION = [];
  const DIRECTORS_AUTHOR = [
    "administrator",
    "managers",
    "sales",
    "warehouse",
    "shipper",
  ];
  const ADMINISTRATOR_AUTHOR = [
    "directors",
    "managers",
    "sales",
    "warehouse",
    "shipper",
  ];
  const MANAGERS_AUTHOR = ["sales", "warehouse", "shipper"];

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (text, record) => {
        return (
          <div className="text-center">
            {text && (
              <img
                className="max-w-[150px] w-[30%] min-w-[70px]"
                src={`${API_URL}${text}`}
                alt="image-employee"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Họ Và Tên",
      dataIndex: "fullName",
      key: "fullName",
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
      render: (text) => {
        return text ? (
          <span className="text-green-700 font-bold">Kích hoạt</span>
        ) : (
          <span className="text-red-700 font-bold">Thu hồi</span>
        );
      },
    },
    {
      title: "Quyền tài khoản",
      dataIndex: "roles",
      key: "roles",
      render: (text, record) => {
        return renderRoles(text);
      },
    },
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
              data={{ name: "uploads file image employee" }}
              action={`${API_URL}/upload-image/employees/${record._id}`}
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
              title="Bạn có chắc muốn xóa nhân viên này không?"
              onConfirm={() => {
                const id = record._id;
                axiosClient
                  .patch("/employees/" + id, { isDelete: true })
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
    users.roles.includes("directors")
      ? (AUTHORIZATION = DIRECTORS_AUTHOR)
      : users.roles.includes("administrator")
      ? (AUTHORIZATION = ADMINISTRATOR_AUTHOR)
      : (AUTHORIZATION = MANAGERS_AUTHOR);
    // console.log(AUTHORIZATION);

    axiosClient.get("/employees").then((response) => {
      const employeesFilter = response.data.filter((e) => {
        // console.log(JSON.stringify(e.roles));
        // console.log(DIRECTORS_AUTHOR.join(""));
        return e.roles.every((role) => {
          // console.log(role);
          return AUTHORIZATION.includes(role);
        });
      });
      setEmployees(employeesFilter);
    });
  }, [refresh]);

  const onFinish = (values) => {
    axiosClient
      .post("/employees", values)
      .then((response) => {
        if (values.file !== undefined) {
          //UPLOAD FILE
          const { _id } = response.data;
          const formData = new FormData();
          formData.append("file", file);
          axios
            .post(`${API_URL}/upload-image/employees/${_id}`, formData)
            .then((response) => {
              // message.success("Tải lên hình ảnh thành công!");
              // createForm.resetFields();
            })
            .catch((err) => {
              message.error("Tải lên hình ảnh thất bại!");
            });
        }
        createForm.resetFields();
        setRefresh((f) => f + 1);
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
      .patch("/employees/" + selectedRecord._id, values)
      .then((response) => {
        if (values.file !== undefined) {
          //UPLOAD FILE
          const { _id } = response.data;
          const formData = new FormData();
          formData.append("file", file);
          axios
            .post(`${API_URL}/upload-image/employees/${_id}`, formData)
            .then((response) => {
              message.success("Cập nhật thành công!");
            })
            .catch((err) => {
              message.error("Tải lên hình ảnh thất bại!");
            });
        }
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
        console.log(err);
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log("🐣", errors);
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

  // validate birth date
  const dateOfBirthValidator = (rule, value, callback) => {
    const dateFormat = "YYYY/MM/DD"; // Định dạng ngày tháng
    const currentDate = moment(); // Lấy ngày hiện tại
    const dateOfBirth = moment(value, dateFormat); // Chuyển đổi giá trị nhập vào thành kiểu moment

    // Kiểm tra tính hợp lệ của ngày sinh
    if (currentDate.diff(dateOfBirth, "days") < 0) {
      callback("Ngày sinh phải nhỏ hơn ngày hiện tại");
    } else {
      callback();
    }
  };
  return (
    <>
      <h1 className="text-center p-2 mb-5 text-xl">👩‍💼 Quản Lý Nhân Viên 👨‍💼</h1>
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
        >
          <div className="w-[80%]">
            {/* fullName */}
            <Form.Item hasFeedback className="" label="Tên" name="fullName">
              <Input />
            </Form.Item>

            {/* Email */}
            <Form.Item
              hasFeedback
              className=""
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              hasFeedback
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

            {/* Address */}
            <Form.Item hasFeedback className="" label="Địa chỉ" name="address">
              <Input />
            </Form.Item>

            {/* BirthDay */}
            <Form.Item
              hasFeedback
              className=""
              label="Ngày Sinh"
              name="birthDay"
              rules={[
                {
                  validator: dateOfBirthValidator,
                },
                { type: "date", message: "Ngày sinh không hợp lệ" },
              ]}
            >
              <DatePicker format="YYYY/MM/DD" />
            </Form.Item>

            <Form.Item label="Trạng thái" name="active">
              <Select
                // defaultValue={true}
                options={[
                  {
                    value: "true",
                    label: "Kích hoạt",
                  },
                  {
                    value: "false",
                    label: "Thu hồi",
                  },
                ]}
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
      <Button
        className="bg-blue-500 text-white font-bold mb-5 mt-5"
        onClick={() => {
          setCreateFormVisible(true);
          console.log("ok");
        }}
      >
        Thêm mới nhân viên
      </Button>
      {/* modal thêm mới */}
      <div className="ant-modal-content">
        <Modal
          centered
          open={createFormVisible}
          title="Thêm mới thông tin khách hàng"
          onOk={() => {
            createForm.submit();
            //setCreateFormVisible(false);
          }}
          onCancel={() => {
            setCreateFormVisible(false);
          }}
          okText="Lưu"
          cancelText="Đóng"
          className="w-[50rem]"
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
            className="w-[100%]"
          >
            <div className="w-[100%]">
              {/* FirstName */}
              <Form.Item
                hasFeedback
                className=""
                label="Họ - Tên Đệm"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Họ - Tên đệm không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {/* LastName */}
              <Form.Item
                hasFeedback
                className=""
                label="Tên"
                name="lastName"
                rules={[
                  { required: true, message: "Tên không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              {/* Email */}
              <Form.Item
                hasFeedback
                className=""
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không thể để trống" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input />
              </Form.Item>

              {/* Password */}
              <Form.Item
                hasFeedback
                className=""
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              {/* Phone */}
              <Form.Item
                hasFeedback
                className=""
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Số điện thoại bắt buộc nhập!" },
                  { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
                  { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
                  {
                    validator: phoneValidator,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {/* Address */}
              <Form.Item
                hasFeedback
                className=""
                label="Địa chỉ"
                name="address"
                rules={[
                  { required: true, message: "Địa chỉ không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              {/* BirthDay */}
              <Form.Item
                hasFeedback
                className=""
                label="Ngày Sinh"
                name="birthDay"
                rules={[
                  {
                    validator: dateOfBirthValidator,
                  },
                  { type: "date", message: "Ngày sinh không hợp lệ" },
                ]}
              >
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>

              <Form.Item label="Trạng thái" name="active">
                <Select
                  defaultValue={"true"}
                  options={[
                    {
                      value: "true",
                      label: "Kích hoạt",
                    },
                    {
                      value: "false",
                      label: "Thu hồi",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Quyền tài khoản" name="roles">
                <Checkbox.Group
                  className="child:mx-2 grid"
                  options={[
                    {
                      label: "Quản trị viên",
                      value: "administrator",
                    },
                    {
                      label: "Quản lý",
                      value: "managers",
                    },
                    {
                      label: "Giám đốc",
                      value: "directors",
                    },
                    {
                      label: "NV bán hàng",
                      value: "salse",
                    },
                    {
                      label: "NV kho",
                      value: "warehouse",
                    },
                    {
                      label: "NV vận chuyển",
                      value: "shipper",
                    },
                  ]}
                  defaultValue={["sales"]}
                />
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
            </div>
          </Form>
        </Modal>
      </div>
      <Table rowKey="_id" dataSource={employees} columns={columns} />

      <Modal
        centered
        open={editFormVisible}
        width={"50%"}
        title="Cập nhật thông tin nhân viên"
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
          {/* FirstName */}
          <Form.Item
            hasFeedback
            className=""
            label="Họ - Tên Đệm"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Họ - Tên đệm không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* LastName */}
          <Form.Item
            hasFeedback
            className=""
            label="Tên"
            name="lastName"
            rules={[{ required: true, message: "Tên không được để trống!" }]}
          >
            <Input />
          </Form.Item>

          {/* Email */}
          <Form.Item
            hasFeedback
            className=""
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không thể để trống" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Password */}
          <Form.Item
            hasFeedback
            className=""
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            hasFeedback
            className=""
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Số điện thoại bắt buộc nhập!" },
              { min: 10, message: "Số điện thoại không quá 10 chữ số!" },
              { max: 10, message: "Số điện thoại không quá 10 chữ số!" },
              {
                validator: phoneValidator,
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Address */}
          <Form.Item
            hasFeedback
            className=""
            label="Địa chỉ"
            name="address"
            rules={[
              { required: true, message: "Địa chỉ không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* BirthDay */}
          <Form.Item
            hasFeedback
            className=""
            label="Ngày Sinh"
            name="birthDay"
            rules={[
              {
                validator: dateOfBirthValidator,
              },
              { type: "date", message: "Ngày sinh không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Trạng thái" name="active">
            <Select
              options={[
                {
                  value: "true",
                  label: "Kích hoạt",
                },
                {
                  value: "false",
                  label: "Thu hồi",
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="Quyền tài khoản" name="roles">
            <Checkbox.Group
              className="child:mx-2 grid"
              options={[
                {
                  label: "Quản trị viên",
                  value: "administrator",
                },
                {
                  label: "Quản lý",
                  value: "managers",
                },
                {
                  label: "Giám đốc",
                  value: "directors",
                },
                {
                  label: "NV bán hàng",
                  value: "salse",
                },
                {
                  label: "NV kho",
                  value: "warehouse",
                },
                {
                  label: "NV vận chuyển",
                  value: "shipper",
                },
              ]}
            />
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
    </>
  );
}

export default Employees;
