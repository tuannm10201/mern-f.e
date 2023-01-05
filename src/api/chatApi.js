import axiosClient from "./axiosClient";
import utils from "../config/utils";

const config = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
});

const chatApi = {
  chat: (token) => axiosClient.get(`/api/chat`, config(token)),
};

export default chatApi;
