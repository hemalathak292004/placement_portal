import axios from "axios";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = "http://localhost:5000";
const API_URL = `${BACKEND_URL}/college-staff/`;

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
