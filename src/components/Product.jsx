import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import Price from "./Price";
import { BE } from "../constants/userConstants";

function Product({ product }) {
  return (
    <Card className="my-3 p-3 roundedc product-detail">
      <Link to={`/products/${product._id}`}>
        <Card.Img
          src={BE + product.image}
          alt={product.name}
          variant="top"
          style={{ height: 272, width: 272 }}
        />
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as="div" className="title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} Đánh Giá`}
          />
        </Card.Text>
        <Card.Text as="h4">
          <div>
            <Price>{product.price}</Price>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
