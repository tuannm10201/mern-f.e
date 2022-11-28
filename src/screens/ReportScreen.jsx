import Chart from "react-apexcharts";
import utils from "../config/utils";
import { Col, Row } from "react-bootstrap";
import { listAllOrders } from "../actions/orderActions";
import { listUsers } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import DateRangePicker from "../components/DateRangePicker";
import ListRank from "../components/ListRank";

export default function ReportScreen() {
  const defaultChartOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      "#005EA5",
      "#F89523",
      "#FECE13",
      "#6EC6EB",
      "#B07C29",
      "#BAB6AB",
      "#E63087",
      "#9475AE",
      "#42AD4D",
      "#FFA64D",
    ],
    legend: {
      position: "top",
    },
    markers: {
      size: 4,
      hover: {
        size: 5,
      },
      strokeWidth: 1,
      fillOpacity: 0,
      colors: "#ffffff",
      strokeColors: [
        "#005EA5",
        "#F89523",
        "#FECE13",
        "#6EC6EB",
        "#B07C29",
        "#BAB6AB",
        "#E63087",
        "#9475AE",
        "#42AD4D",
        "#FFA64D",
      ],
    },
    stroke: {
      curve: "straight",
      lineCap: "round",
      width: 2,
      dashArray: 0,
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value) => utils.formatCurrencyShorter(value),
      },
    },
    xaxis: {
      type: "category",
      axisTicks: { show: false },
      labels: {
        formatter: (value) => moment(Number(value)).format("DD/MM"),
      },
    },
    tooltip: {
      fixed: {
        enabled: false,
        position: "topRight",
        xOffset: 0,
        yOffset: 0,
      },
      shared: false,
      followCursor: true,
      intersect: false,
      x: {
        format: "dd/MM",
      },
      y: {
        formatter: (value) => utils.formatCurrency(value),
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 0,
    },
  };

  const [date, setDate] = useState(
    sessionStorage.getItem("date-range")
      ? Object.fromEntries(
          Object.entries(JSON.parse(sessionStorage.getItem("date-range"))).map(
            ([key, val]) => [key, new Date(val)]
          )
        )
      : {
          startDate: new Date(new Date().setHours(0, 0, 0, 0)),
          endDate: new Date(),
        }
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, orders } = useSelector((state) => state.orderList);
  const { error: userError, users } = useSelector((state) => state.userList);
  if (error || userError) {
    navigate(-1);
  }
  const { userInfo } = useSelector((state) => state.userLogin);

  const dateRangeArr = utils.genDateRange(
    date.startDate.getTime(),
    date.endDate.getTime()
  );
  const usersSearch = users
    ?.flatMap((user) => user.search)
    .slice(0, 15)
    .reduce((prev, curr) => {
      prev[curr] = prev[curr] ? prev[curr] + 1 : 1;
      return prev;
    }, {});

  const sortUsersSearch = usersSearch
    ? Object.fromEntries(
        Object.entries(usersSearch).sort(([, a], [, b]) => b - a)
      )
    : {};

  const fulltime = dateRangeArr.map((date) => {
    const orderOnDay = orders?.find((order) => order?._id === date);
    const total = orderOnDay?.results?.reduce(
      (prev, acc) => ({
        quantity: prev?.quantity + acc?.orderItems.length,
        totalPrice: prev?.totalPrice + acc?.totalPrice,
        shippingPrice: prev?.shippingPrice + acc?.shippingPrice,
      }),
      {
        quantity: 0,
        totalPrice: 0,
        shippingPrice: 0,
      }
    );
    return {
      date,
      ...total,
    };
  });
  const flatOrders = orders?.flatMap((order) => order?.results);

  const groupedItemsSold = flatOrders
    ?.flatMap((order) => order?.orderItems)
    .reduce(
      ((map) => (r, a) => {
        map.set(
          a?.product,
          map.get(a?.product) ||
            r[
              r.push({ product: a?.product, name: a?.name, qty: 0, price: 0 }) -
                1
            ]
        );
        map.get(a?.product).qty += a?.qty;
        map.get(a?.product).price += a?.price;
        return r;
      })(new Map()),
      []
    );

  const productSold = flatOrders.flatMap((order) => order?.product);

  const groupedProductsSold = productSold.reduce(
    ((map) => (r, a) => {
      map.set(
        a?._id,
        map.get(a?._id) ||
          r[
            r.push({
              _id: a?._id,
              name: a?.name,
              sold: 0,
              countInStock: a?.countInStock,
            }) - 1
          ]
      );
      map.get(a?._id).sold += 1;
      return r;
    })(new Map()),
    []
  );

  const total_customer = [...new Set(flatOrders?.map((order) => order?.user))]
    .length;
  const total =
    flatOrders?.reduce(
      (prev, curr) => ({
        total_amount: prev?.total_amount + curr?.totalPrice,
        total_shipping: prev?.total_shipping + curr?.shippingPrice,
        total_quanity: prev?.total_quanity + curr?.orderItems.length,
      }),
      {
        total_amount: 0,
        total_shipping: 0,
        total_quanity: 0,
      }
    ) || {};

  useEffect(() => {
    if (userInfo?.isAdmin) {
      const payload = {
        time_start: date.startDate.getTime(),
        time_end: date.endDate.getTime(),
      };
      dispatch(listAllOrders(payload));
      dispatch(listUsers());
    } else {
      navigate("/login");
    }
  }, [userInfo, date]);

  const seriesRevenue = [
    {
      name: "Doanh thu theo ngày",
      data: fulltime.map((revenue) => [
        utils.toTimestamp("to", revenue.date),
        revenue.totalPrice ?? 0,
      ]),
    },
  ];
  const chartOptionsRevenue = {
    ...defaultChartOptions,
    tooltip: {
      ...defaultChartOptions.tooltip,
      y: {
        formatter: (value, { series, seriesIndex, dataPointIndex }) => {
          const dataPoint = fulltime[dataPointIndex] || {};
          return `
            <p class="mb-0" style="font-weight: lighter">
              Doanh thu: <b>${value}</b>
            <br>Số đơn hàng: <b>${dataPoint.quantity ?? 0}</b>
            <br>Phí ship: <b>${dataPoint.shippingPrice ?? 0}</b></p>`;
        },
        title: {
          formatter: (seriesName) => `${seriesName}<br>`,
        },
      },
    },
  };
  const seriesItem = groupedItemsSold?.map((item) => item.price);
  const chartOptionsItem = {
    ...defaultChartOptions,
    labels: groupedItemsSold?.map((e) => e.name),
    stroke: {
      show: false,
    },
    legend: {
      position: "left",
      verticalAlign: "middle",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => Math.round(val) + "%",
    },
  };

  const chartOptionsProduct = {
    ...defaultChartOptions,
    chart: {
      ...defaultChartOptions.chart,
      toolbar: {
        tools: {
          download: false,
        },
      },
    },
    xaxis: {
      type: "category",
      categories: groupedProductsSold?.map((e) => e.name),
    },
    tooltip: {
      ...defaultChartOptions.tooltip,
      shared: true,
      y: {
        formatter: (value) => `<p>Số lượng: <b>${value}</b></p>`,
        title: {
          formatter: (seriesName) => `${seriesName}<br>`,
        },
      },
    },
  };
  const seriesProduct = [
    {
      name: "Món bán chạy nhất",
      data: groupedProductsSold?.map((item) => item.sold),
    },
  ];

  return (
    <>
      <div className="d-flex align-items-center my-3">
        <h4 className="mb-0 me-3">Chọn khoảng thời gian xem báo cáo:</h4>
        <DateRangePicker onChange={setDate} />
      </div>
      <h1>Báo cáo doanh thu theo ngày</h1>
      <Row className="d-flex mb-3 mx-2">
        <Col className="card px-0">
          <div className="card-header">Tổng doanh thu</div>
          <div className="card-body">
            <h5 className="card-title mb-0">
              {utils.formatCurrency(total.total_amount)}
            </h5>
          </div>
        </Col>
        <Col className="card px-0 mx-3">
          <div className="card-header">Tổng hóa đơn</div>
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">{total.total_quanity}</h5>
            </div>
          </div>
        </Col>
        <Col className="card px-0">
          <div className="card-header">Tổng số khách</div>
          <div className="card-body">
            <h5 className="card-title mb-0">{total_customer}</h5>
          </div>
        </Col>
      </Row>
      <Chart
        type="area"
        height="350"
        options={chartOptionsRevenue}
        series={seriesRevenue}
      />

      <h3 className="mt-5">Báo cáo mặt hàng có doanh thu khủng nhất</h3>
      <Chart
        type="donut"
        height="300"
        options={chartOptionsItem}
        series={seriesItem}
      />
      <h3 className="mt-5">Báo cáo mặt hàng bán chạy</h3>
      <Chart
        type="bar"
        height="350"
        options={chartOptionsProduct}
        series={seriesProduct}
      />

      <h2 className="mt-5">Báo cáo xu hướng tìm kiếm</h2>
      <ListRank obj={sortUsersSearch} />
    </>
  );
}
