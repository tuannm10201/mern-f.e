import axiosClient from "./axiosClient";

const uploadImage = (formData, token) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  };
  return axiosClient.post(`/api/upload`, formData, config);
};

export default uploadImage;
