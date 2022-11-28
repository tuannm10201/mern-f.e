import moment from "moment";
import DatePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

const DateRangePicker = ({ onChange = () => {}, timePicker, minDate }) => {
  const initDate = sessionStorage.getItem("date-range")
    ? Object.fromEntries(
        Object.entries(JSON.parse(sessionStorage.getItem("date-range"))).map(
          ([key, val]) => [key, new Date(val)]
        )
      )
    : {
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: new Date(),
      };
  const handleChange = (startDate, endDate) => {
    sessionStorage.setItem(
      "date-range",
      JSON.stringify({ startDate, endDate })
    );
    onChange({ startDate: new Date(startDate), endDate: new Date(endDate) });
  };
  const limitMinDate = {
    minDate:
      minDate !== undefined
        ? minDate
        : new Date(new Date().setMonth(new Date().getMonth() - 3)),
  };
  return (
    <DatePicker
      initialSettings={{
        ...initDate,
        locale: { format: "DD/MM/YYYY" + (timePicker ? " hh:mm A" : "") },
        ranges: {
          Today: [moment().toDate(), moment().toDate()],
          Yesterday: [
            moment().subtract(1, "days").toDate(),
            moment().subtract(1, "days").toDate(),
          ],
          "Last 7 Days": [
            moment().subtract(6, "days").toDate(),
            moment().toDate(),
          ],
          "Last 30 Days": [
            moment().subtract(29, "days").toDate(),
            moment().toDate(),
          ],
          "This Month": [
            moment().startOf("month").toDate(),
            moment().endOf("month").toDate(),
          ],
          "Last Month": [
            moment().subtract(1, "month").startOf("month").toDate(),
            moment().subtract(1, "month").endOf("month").toDate(),
          ],
        },
        alwaysShowCalendars: true,
        autoApply: true,
        linkedCalendars: false,
        showCustomRangeLabel: false,
        timePicker,
        maxDate: new Date(Date.now()),
        ...(minDate !== null && limitMinDate),
      }}
      onCallback={handleChange}
    >
      <input className="date-range-picker text-center cursor-pointer" />
    </DatePicker>
  );
};

export default DateRangePicker;
