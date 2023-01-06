import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col, Table, Button, Modal, Badge } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser, logout } from "../actions/userActions";
import ChatAdmin from "../components/ChatAdmin";
import { io } from "socket.io-client";
import { BE } from "../constants/userConstants";

let isGetUserOnline = false;
function UserListScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.userList);
  const { userInfo } = useSelector((state) => state.userLogin);
  const socket = useMemo(
    () => io(BE, { auth: { id: userInfo?._id } }),
    [userInfo?._id]
  );
  const [usersOnline, setUsersOnline] = useState([]);
  const [userUnread, setUserUnread] = useState([]);

  const [open, setOpen] = useState(false);
  const [chatUserSelect, setChatUserSelect] = useState(null);
  const handleSelectChatUser = (user) => {
    if (user._id == userInfo._id) return;
    setOpen(true);
    setChatUserSelect(user);
    setUserUnread((prev) => prev.filter((userId) => userId != user._id));
  };

  useEffect(() => {
    socket.emit("adminCheck");
    const handleGetUserOnline = (users) => {
      setUsersOnline(users?.map((user) => user.userId));
    };
    socket.on("getUsersOnline", handleGetUserOnline);

    socket.once("showUserUnread", (payload) => {
      setUserUnread((prev) => [...new Set([...prev, ...payload])]);
    });

    return () => {
      socket.off("getUsersOnline", handleGetUserOnline);
    };
  }, []);

  useEffect(() => {
    const addUserUnread = (userId) => {
      if (!userUnread.includes(userId) && userId != chatUserSelect?._id)
        setUserUnread((prev) => [...new Set([...prev, userId])]);
    };
    socket.on("checkUnreadMsg", addUserUnread);

    return () => {
      socket.off("checkUnreadMsg", addUserUnread);
    };
  }, [chatUserSelect?._id]);

  useEffect(() => {
    if (users?.length && !isGetUserOnline) {
      isGetUserOnline = true;
      const userWasOnline = users.filter((user) => user.isOnline);
      if (userWasOnline.length)
        setUsersOnline(userWasOnline.map((user) => user._id));
    }
    return () => {
      isGetUserOnline = false;
    };
  }, [JSON.stringify(users)]);

  const { success: deleteSuccess } = useSelector((state) => state.userDelete);
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate("/login");
    }

    setDeleteAdminCount(0);
  }, [dispatch, userInfo, navigate, deleteSuccess]);

  const [deleteAdminCount, setDeleteAdminCount] = useState(0);

  const deleteHandler = (user) => {
    setShow(false);
    if (user.isAdmin) {
      setDeleteAdminCount((prev) => prev + 1);
    } else {
      dispatch(deleteUser(user._id));
    }
  };

  const [selectedUser, setSelectedUser] = useState({});
  const [show, setShow] = useState(false);

  const closeModalHandler = () => setShow(false);
  const confirmDeleteUser = (user) => {
    setShow(true);
    setSelectedUser(user);
  };

  const reloadUserList = () => {
    dispatch(listUsers());
  };

  return (
    <>
      <Row className="justify-content-between">
        <Col md={11}>
          <h1>Danh sách tài khoản</h1>
        </Col>
        <Col md={1} className="d-flex justify-content-end align-items-center">
          <i
            className="fa-solid fa-rotate"
            role="button"
            onClick={reloadUserList}
          ></i>
        </Col>
      </Row>
      {deleteAdminCount === 1 && (
        <Message variant="danger">Không thể xóa tài khoản admin</Message>
      )}
      {deleteAdminCount > 1 && deleteAdminCount < 3 && (
        <Message variant="danger">Không được xóa Admin!!</Message>
      )}
      {deleteAdminCount >= 3 && deleteAdminCount < 4 && (
        <Message variant="danger">Cảnh báo lần cuối: Không xóa Admin!!</Message>
      )}
      {deleteAdminCount >= 4 && dispatch(logout())}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.message}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trò chuyện</th>
              <th>Chỉnh sửa</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.name}
                  {"  "}
                  <span
                    className={`dot ${
                      user.isAdmin || usersOnline.includes(user._id)
                        ? "active"
                        : "unactive"
                    }`}
                  ></span>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td
                  className="cursor-pointer"
                  onClick={() => handleSelectChatUser(user)}
                >
                  {!user.isAdmin && (
                    <Badge
                      pill
                      bg={userUnread.includes(user._id) ? "warning" : "primary"}
                    >
                      {userUnread.includes(user._id)
                        ? "Có tin  nhắn đến"
                        : "Tin nhắn rỗng"}
                    </Badge>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/users/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    disabled={user.isAdmin}
                    onClick={() => confirmDeleteUser(user)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal
        show={show}
        onHide={closeModalHandler}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có muốn xóa tài khoản <b>{selectedUser.name}</b> không?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalHandler}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => deleteHandler(selectedUser)}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {chatUserSelect && (
        <ChatAdmin
          key={chatUserSelect?._id}
          open={open}
          setOpen={setOpen}
          user={chatUserSelect}
        />
      )}
    </>
  );
}

export default UserListScreen;
