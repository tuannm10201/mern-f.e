import { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import CategoryFilter from "../components/CategoryFilter";
import ProductCarousel from "../components/ProductCarousel";
import RecommendProducts from "../components/RecommendProducts";

function HomeScreen() {
  const dispatch = useDispatch();
  const { keyword, pageNumber = 1 } = useParams();
  const location = useLocation();
  const category = location.search.split("=")[1];
  const { loading, error, products, pages, page } = useSelector(
    (state) => state.productList
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, category));
  }, [keyword, category, pageNumber]);
  return (
    <>
      <Meta />
      {keyword ? (
        <Link className="btn btn-light my-3" to="/">
          Quay lại
        </Link>
      ) : (
        <ProductCarousel />
      )}
      {userInfo?.token && (
        <RecommendProducts token={userInfo.token} searchs={userInfo.search} />
      )}

      <h1 className="mt-3">Danh sách sản phẩm</h1>
      <CategoryFilter />
      {loading ? (
        <Loader customStyle={{ marginBottom: "500px" }} />
      ) : error ? (
        <Message variant="danger">{error.data?.message}</Message>
      ) : (
        <>
          {products?.length === 0 && (
            <Message variant="danger">Không tìm thấy kết quả phù hợp</Message>
          )}
          <Row>
            {products?.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
}

export default HomeScreen;
