import utils from "../config/utils";

function Price({ children }) {
  return (
    <span style={{ textTransform: "lowercase" }}>
      {utils.formatCurrency(children)}
    </span>
  );
}

export default Price;
