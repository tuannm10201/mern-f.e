import axiosClient from "./axiosClient";
import utils from "../config/utils";

const config = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
});

const ordersApi = {
  createOrder: (order, token) =>
    axiosClient.post("/api/orders/", order, config(token)),
  getOrderById: (id, token) =>
    axiosClient.get(`/api/orders/${id}`, config(token)),
  listMyOrders: (token) =>
    axiosClient.get(`/api/orders/myorders`, config(token)),
  listAllOrders: (dateRange, token) => {
    if (dateRange)
      return axiosClient.get(
        "/api/orders?" + utils.convertObjectToQueryString(dateRange),
        config(token)
      );
    return axiosClient.get("/api/orders", config(token));
  },
  orderSentpayment: (id, token) =>
    axiosClient.put(`/api/orders/${id}/sentpayment`, {}, config(token)),
  deleteOrder: (id, token) =>
    axiosClient.delete(`/api/orders/${id}/delete`, config(token)),
  orderDelivered: (id, token) =>
    axiosClient.put(`/api/orders/${id}/delivered`, {}, config(token)),
  orderPaid: (id, token) =>
    axiosClient.put(`/api/orders/${id}/pay`, {}, config(token)),
};

export default ordersApi;
