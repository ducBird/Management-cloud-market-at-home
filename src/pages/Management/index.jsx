import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";

const Management = () => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={6} style={{ marginBottom: 24 }}>
          <Link to={"/management/categories"}>Quản lí danh mục</Link>
        </Col>

        <Col span={6} style={{ marginBottom: 24 }}>
          <Link to={"/management/categories"}>Quản lí sản phẩm</Link>
        </Col>

        <Col span={6} style={{ marginBottom: 24 }}>
          <Link to={"/management/categories"}>Quản lí khách hàng</Link>
        </Col>

        <Col span={6} style={{ marginBottom: 24 }}>
          <Link to={"/management/categories"}>Quản lí nhân viên</Link>
        </Col>

        <Col span={6} style={{ marginBottom: 24 }}>
          <Link to={"/management/categories"}>Quản lí nhà cung cấp</Link>
        </Col>

        <Col span={6} style={{ marginBottom: 24 }}>
          <Link to={"/management/categories"}>Quản lí CSKH</Link>
        </Col>
      </Row>
    </>
  );
};

export default Management;
