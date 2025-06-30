import axios from "axios";
import { API_ENDPOINTS } from "../../../../config";

const API_URL = API_ENDPOINTS.COMPANY;

// Configure axios defaults
axios.defaults.withCredentials = true;

const signup = async (userSignupData) => {
  const response = await axios.post(API_URL + "signup", userSignupData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

const signin = async (userData) => {
  const response = await axios.post(API_URL + "signin", userData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

const signout = async (userData) => {
  const response = await axios.post(
    API_URL + "signout",
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

const companyAuthService = {
  signin,
  signout,
  signup,
};

export default companyAuthService;
