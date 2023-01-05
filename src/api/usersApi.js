import axiosClient from "./axiosClient";
const config = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
});

const usersApi = {
  login: (email, password) =>
    axiosClient.post("/api/users/login", {
      email,
      password,
    }),
  register: (name, email, password) =>
    axiosClient.post("/api/users/", {
      name,
      email,
      password,
    }),
  getProfile: (id, token) => axiosClient.get(`/api/users/${id}`, config(token)),
  updateProfile: (user, token) =>
    axiosClient.put(`/api/users/profile`, user, config(token)),
  updateUserByAdmin: (user, token) =>
    axiosClient.put(`/api/users/${user.id}`, user, config(token)),
  listAllUsers: (token) => axiosClient.get(`/api/users/`, config(token)),
  deleteUser: (id, token) =>
    axiosClient.delete(`/api/users/${id}/delete`, config(token)),
  createChat: (payload, token, id) =>
    axiosClient.post(
      id ? `/api/users/admin/chat/${id}` : "/api/users/chat",
      payload,
      config(token)
    ),
  getChat: (token, id) =>
    axiosClient.get(
      id ? `/api/users/admin/chat/${id}` : "/api/users/chat",
      config(token)
    ),
};

export default usersApi;
