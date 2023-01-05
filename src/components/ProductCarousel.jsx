import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { listTopRatedProducts } from "../actions/productActions";

function ProductCarousel() {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector(
    (state) => state.productTopRated
  );
  useEffect(() => {
    dispatch(listTopRatedProducts());
  }, []);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data?.message}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products &&
        products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/products/${product._id}`}>
              <Image
                src={"http://localhost:4000" + product.image}
                alt={product.name}
                fluid
              />
              <Carousel.Caption className="carousel-caption">
                <h2>{product.name}</h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
    </Carousel>
  );
}

export default ProductCarousel;
