import axios from "axios";

const API_URL =
  "https://taskflow-api-3b5f.onrender.com";


const api = axios.create({
  baseURL: API_URL,
});


// =============================
// REQUEST INTERCEPTOR
// Tự động gắn access token
// =============================

api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =============================
// RESPONSE INTERCEPTOR
// Tự refresh access token
// =============================

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // Nếu access token hết hạn
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refresh_token");

      // Không có refresh token
      if (!refreshToken) {

        localStorage.removeItem("access_token");

        window.location.href = "/login";

        return Promise.reject(error);
      }


      try {

        // Gọi API refresh
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );


        const newAccessToken =
          response.data.access_token;


        // Lưu access token mới
        localStorage.setItem(
          "access_token",
          newAccessToken
        );


        // Thay token cho request bị lỗi
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        // Gửi lại request cũ
        return api(originalRequest);

      } catch (refreshError) {

        // Refresh token cũng hết hạn
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);


export default api;