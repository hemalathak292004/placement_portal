import axios from "axios";
import { API_ENDPOINTS } from "../../../../config";

const API_URL = API_ENDPOINTS.COMPANY;

// Configure axios defaults
axios.defaults.withCredentials = true;

const getCompanyData = async () => {
  const response = await axios.get(API_URL + "getCompanyData", {
    withCredentials: true,
  });
  return response.data;
};

const companyProfileUpdate = async (data) => {
  const response = await axios.put(API_URL + "companyProfileUpdate", data, {
    withCredentials: true,
  });
  return response.data;
};

const uploadProfilePicture = async (data) => {
  // console.log(data);
  const response = await axios.post(API_URL + "uploadProfilePicture", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
};

const getStudentDetails = async (studentID) => {
  // console.log("studentID: " , studentID );
  // console.log(API_URL + `getStudentDetails/${studentID}`);
  const response = await axios.get(API_URL + `getStudentDetails/${studentID}`, {
    withCredentials: true,
  });
  return response.data;
};

const companyService = {
  getCompanyData,
  companyProfileUpdate,
  uploadProfilePicture,
  getStudentDetails,
  // updateStudentDetails
};

export default companyService;
