import { useLocation } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

const Paginate = ({ pages, page, keyword = "" }) => {
  const location = useLocation();
  const category = location.search.split("=")[1];
  const { userInfo } = useSelector((state) => state.userLogin);
  const redirectUrl = (x) => {
    if (userInfo?.isAdmin && location?.pathname == "/admin/products") {
      if (keyword) return `/admin/products/search/${keyword}/page/${x + 1}`;
      return `/admin/products/page/${x + 1}`;
    }
    if (keyword)
      return `/search/${keyword}/page/${x + 1}${
        category && `?category=${category}`
      }`;
    return `/page/${x + 1}${category ? `?category=${category}` : ""}`;
  };

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={redirectUrl(x)}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
