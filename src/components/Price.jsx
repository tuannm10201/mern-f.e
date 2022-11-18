const formatCurrency = (value = 0) => {
  let money = value;
  if (!value) money = 0;
  if (!/^-?[\d.]+(?:e-?\d+)?$/.test(money)) return money;
  const numberValue = +money.toString().replaceAll(",", "");
  return numberValue.toLocaleString("en-US") + "đ";
};

function Price({ children }) {
  return (
    <span style={{ textTransform: "lowercase" }}>
      {formatCurrency(children)}
    </span>
  );
}

export default Price;
