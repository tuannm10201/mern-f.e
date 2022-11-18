import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container>
        <Row>
          <Col className="text-center py-3">
            <img
              style={{
                height: "3rem",
              }}
              src="https://salavietnam.vn/dataimages/images/20150827110756-dadangky.png"
            />
          </Col>
          <Col className="text-center py-3">
            <img
              style={{
                height: "3rem",
              }}
              src="https://salavietnam.vn/dataimages/images/20150827110756-dadangky.png"
            />
          </Col>
          <Col className="text-center py-3">
            <img
              style={{
                height: "3rem",
              }}
              src="https://salavietnam.vn/dataimages/images/20150827110756-dadangky.png"
            />
          </Col>
        </Row>
        <Row className="py-4 justify-content-center font-weight-bold">
          Công ty TNHH Shopee
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
