import axios from "axios";

const BACKEND_URL = "http://localhost:5000";
const API_URL = `${BACKEND_URL}/student/`;

// Configure axios defaults for all requests
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        message: "Request timed out. Please try again.",
      });
    }
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
      });
    }
    return Promise.reject(error);
  }
);

const signup = async (userData) => {
  try {
    const response = await axiosInstance.post("signup", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const signin = async (userData) => {
  try {
    const response = await axiosInstance.post("signin", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const signout = async () => {
  try {
    const response = await axiosInstance.post("signout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProfileDetail = async (userData) => {
  try {
    const response = await axiosInstance.put("updateProfileDetail", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserData = async () => {
  try {
    const response = await axiosInstance.get("getUserData");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  signin,
  signup,
  signout,
  updateProfileDetail,
  getUserData,
};

export default authService;
