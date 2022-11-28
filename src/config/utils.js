import moment from "moment";

export default {
  convertObjectToQueryString(obj) {
    return obj
      ? Object.keys(obj)
          .map((key) =>
            obj[key] || obj[key] === 0 ? `${key}=${obj[key]}` : null
          )
          .filter((element) => element !== null)
          .join("&")
      : "";
  },

  formatCurrency(value = 0) {
    let money = value;
    if (!value) money = 0;
    if (!/^-?[\d.]+(?:e-?\d+)?$/.test(money)) return money;
    const numberValue = +money.toString().replaceAll(",", "");
    return numberValue.toLocaleString("en-US") + "đ";
  },

  formatCurrencyShorter(value) {
    return value / 1000000 >= 1
      ? `${value / 1000000}M`
      : value / 1000 >= 1
      ? `${value / 1000}K`
      : value;
  },

  toTimestamp(type, inputDate, openAt = 0) {
    let checkDate;
    if (inputDate) {
      checkDate = new Date(inputDate);
    } else {
      checkDate = new Date();
    }
    const dd = String(checkDate.getDate()).padStart(2, "0");
    const mm = String(checkDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = checkDate.getFullYear();
    let converDate;
    if (type === "from") {
      converDate = `${mm}/${dd}/${yyyy} 00:00:00`;
    } else {
      converDate = `${mm}/${dd}/${yyyy} 23:59:59`;
    }
    const timestamp = new Date(converDate).getTime() + openAt * 3600000;
    return timestamp;
  },

  typeOf(val) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
  },

  genDateRange(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  },
};
