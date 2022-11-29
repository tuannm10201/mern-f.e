import axiosClient from "./axiosClient";

const config = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
});
const productsApi = {
  getAllProducts: (keyword, pageNumber, category, token) =>
    axiosClient.get(
      `/api/products?keyword=${keyword}&category=${category}&pageNumber=${pageNumber}`,
      config(token)
    ),
  getProduct: (id) => axiosClient.get("/api/products/" + id),
  getTopRatedProducts: () => axiosClient.get("/api/products/topRated"),
  getRecommendProducts: (token) =>
    axiosClient.get("/api/products/recommend", config(token)),
  deleteProduct: (id, token) =>
    axiosClient.delete(`/api/products/${id}/delete`, config(token)),
  addProduct: (product, token) =>
    axiosClient.post(`/api/products/add`, product, config(token)),
  updateProduct: (product, token) =>
    axiosClient.put(
      `/api/products/${product.id}/update`,
      product,
      config(token)
    ),
  createProductReview: (productId, review, token) =>
    axiosClient.post(
      `/api/products/${productId}/reviews`,
      review,
      config(token)
    ),
};

export default productsApi;
