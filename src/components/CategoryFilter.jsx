import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CATEGORIES } from "../constants/productConstants";

function CategoryFilter() {
  const navigate = useNavigate();
  const filterHandler = (category) => {
    navigate("?category=" + category);
  };

  return (
    <>
      {CATEGORIES.slice(0, -1).map((cat) => (
        <Button
          key={cat.value}
          variant="outline-secondary"
          onClick={() => filterHandler(cat.value)}
        >
          {cat.text}
        </Button>
      ))}
    </>
  );
}

export default CategoryFilter;
