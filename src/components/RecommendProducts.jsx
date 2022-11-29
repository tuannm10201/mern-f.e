import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { listRecommendProducts } from "../actions/productActions";
import Loader from "./Loader";
import Message from "./Message";
import Product from "./Product";

export default function RecommendProducts({ token, searchs = [] }) {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    products: allProducts,
  } = useSelector((state) => state.productRecommend);
  const { pathname, search } = useLocation();
  const isMainPage =
    pathname === "/" && (!search || search === "?category=all");
  const productRecommend = allProducts
    ?.filter((prod) =>
      Object.values(prod).some((value) =>
        searchs.some((s) => `${value}`.toLowerCase().includes(s.toLowerCase()))
      )
    )
    .slice(0, 8);
  useEffect(() => {
    dispatch(listRecommendProducts(token));
  }, []);
  if (!isMainPage || !productRecommend?.length) return;
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data?.message}</Message>
  ) : (
    <Row>
      <h1 className="mt-3">Có thể bạn quan tâm</h1>
      {productRecommend?.map((product) => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
          <Product product={product} />
        </Col>
      ))}
    </Row>
  );
}
