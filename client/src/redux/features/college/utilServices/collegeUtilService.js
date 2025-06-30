import axios from "axios";
import { API_ENDPOINTS } from "../../../../config";

const API_URL = API_ENDPOINTS.COLLEGE_STAFF;

// Configure axios defaults
axios.defaults.withCredentials = true;

const getCollegeStaffData = async () => {
  const response = await axios.get(API_URL + "getCollegeStaffData", {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

const collegeStaffProfileUpdate = async (data) => {
  const response = await axios.put(
    API_URL + "collegeStaffProfileUpdate",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

const uploadProfilePicture = async (data) => {
  const response = await axios.put(API_URL + "uploadProfilePicture", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
};

const getStudentDetails = async (id) => {
  const response = await axios.get(API_URL + `getStudentDetails/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

const updateStudentDetails = async (data) => {
  const response = await axios.put(API_URL + "updateStudentDetails", data, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};

const collegeService = {
  getCollegeStaffData,
  collegeStaffProfileUpdate,
  uploadProfilePicture,
  getStudentDetails,
  updateStudentDetails,
};

export default collegeService;
