import React, { useEffect } from "react";
import { Input, Button, Divider, Form, Checkbox, message } from "antd";
import { axiosClient } from "../../libraries/axiosClient";
import { useUser } from "../../hooks/useUser";

export default function Login() {
  const { addUser } = useUser((state) => state);

  const onFinish = (values) => {
    const { email, password } = values;
    axiosClient
      .post("/employees/login-jwt", { email, password })
      .then((response) => {
        // console.log(response.data);
        // console.log(values);
        // console.log(email);
        // console.log(values.password);
        axiosClient
          .get(`/employees/${response.data._id}`)
          .then((res) => {
            // console.log(res.data);
            addUser(res.data);
            window.location.href = "/";
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          message.error("Đăng nhập thất bại!");
        }
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <h1 className="text-center text-2xl">Cloud Market At Home</h1>
      <Divider />
      <Form
        name="login-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ email: "", password: "", remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không thể để trống" },
            { type: "email", message: "Đây không phải là một email" },
          ]}
        >
          <Input placeholder="Nhập email của bạn" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password không thể để trống" },
            {
              min: 5,
              max: 50,
              message: "Độ dài mật khẩu từ 5-50 kí tự",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu của bạn" />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Nhớ mật khẩu</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ minWidth: 120 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
