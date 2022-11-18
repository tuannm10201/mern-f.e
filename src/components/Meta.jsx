import { Helmet } from "react-helmet";

const Meta = ({
  title = "Siêu thị đồ điện tử",
  description = "Đồ điện tử chất lượng cao với giá rẻ nhất",
  keywords = "đồ điện tử, electronics, cheap electroincs",
}) => {
  return (
    <Helmet>
      <title>E-Commerce: {title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

export default Meta;
