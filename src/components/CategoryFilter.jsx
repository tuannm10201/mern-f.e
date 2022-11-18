import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const categories = ["all", "Tivi", "Tablet", "Mobile", "Laptop"];

function CategoryFilter() {
  const navigate = useNavigate();
  const filterHandler = (category) => {
    navigate("?category=" + category);
  };

  return (
    <>
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline-secondary"
          onClick={() => filterHandler(category)}
        >
          {(category === "" && "Tất cả") ||
            (category === "Mobile" && "Điện thoại") ||
            category}
        </Button>
      ))}
    </>
  );
}

export default CategoryFilter;
