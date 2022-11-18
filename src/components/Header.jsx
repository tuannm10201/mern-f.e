import { useDispatch, useSelector } from "react-redux";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";

function Header() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky-top shadow">
      <Navbar bg="info" variant="dark" className="py-2">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>E-Commerce</Navbar.Brand>
          </LinkContainer>
          <SearchBox />
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <div style={{ color: "white" }}>
                    <i className="fas fa-shopping-cart"></i> Giỏ hàng
                  </div>
                </Nav.Link>
              </LinkContainer>
              {userInfo?.isAdmin && (
                <NavDropdown title="Quản lý" id="adminmenu">
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item style={{ color: "white" }}>
                      Người dùng
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Sản phẩm</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Đơn hàng</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo && Object.keys(userInfo).length !== 0 ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Tài khoản</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/">
                    <NavDropdown.Item onClick={logoutHandler}>
                      Đăng xuất
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Đăng nhập
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
