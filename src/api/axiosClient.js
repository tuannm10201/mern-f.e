import axios from "axios";
import queryString from "query-string";
import apiConfig from "./apiConfig";
import { logout } from "../actions/userActions";
import store from "../store";
import jwt_decode from "jwt-decode";
import { USER_LOGIN_SUCCESS } from "../constants/userConstants";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    withCredentials: true,
  },
  paramsSerializer: (params) =>
    queryString.stringify({ ...params, api_key: apiConfig.apiKey }),
});

const refresh = async () => {
  const { data } = await axios.get(apiConfig.baseUrl + "api/users/refresh", {
    withCredentials: true,
  });
  return data?.accessToken;
};

axiosClient.interceptors.request.use(
  async (config) => {
    const { userInfo } = store.getState().userLogin;
    const token = userInfo?.token;
    if (!token) return config;
    const decodedToken = jwt_decode(token);
    const date = new Date();
    if (decodedToken.exp < date.getTime() / 1000) {
      const newToken = await refresh();
      console.log(newToken);
      const refreshUser = {
        ...userInfo,
        token: newToken,
      };

      store.dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: refreshUser,
      });

      localStorage.setItem("userInfo", JSON.stringify(refreshUser));

      config.headers["Authorization"] = "Bearer " + newToken;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    throw error;
  }
);

export default axiosClient;
