import React from "react";
import { Input, Button, Divider, Form, Checkbox } from "antd";
import { axiosClient } from "../../libraries/axiosClient";

export default function Login() {
  const onFinish = (values) => {
    const { username, password } = values;
    axiosClient
      .post("/auth/login-jwt", { username, password })
      .then((response) => {
        window.location.href = "/home";
        // console.log(response.data);
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
        initialValues={{ username: "", password: "", remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="username"
          rules={[
            { required: true, message: "Email không thể để trống" },
            { type: "email", message: "Đây không phải là một email" },
          ]}
        >
          <Input placeholder="Your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password không thể để trống" },
            {
              min: 5,
              max: 10,
              message: "Độ dài mật khẩu từ 5-10 kí tự",
            },
          ]}
        >
          <Input.Password placeholder="Your password" />
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
