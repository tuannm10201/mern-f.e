import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

function SearchBox({ isAdmin }) {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (userInfo?.search) {
      const userStorage = JSON.parse(localStorage.getItem("userInfo"));

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...userStorage,
          search: [...new Set([keyword, ...userStorage.search].slice(0, 8))],
        })
      );
    }
    if (isAdmin) {
      if (keyword.trim()) {
        navigate(`/admin/products/search/${keyword}`);
      } else navigate("/admin/products");
    } else {
      if (keyword.trim()) {
        navigate(`/search/${keyword}`);
      } else navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline="true" className="d-inline-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm sản phẩm..."
        className="mr-sm-2 ml-sm-5 py-1"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="py-1 px-2">
        <i className="fa-solid fa-magnifying-glass"></i>
      </Button>
    </Form>
  );
}

export default SearchBox;
