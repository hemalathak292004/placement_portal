import axios from "axios";
import { API_ENDPOINTS } from "../../../../config";

const API_URL = API_ENDPOINTS.STUDENT;

const uploadProfilePicture = async (data) => {
  // console.log(data);
  const response = await axios.post(API_URL + "uploadProfilePicture", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
const uploadResume = async (data) => {
  // console.log(data);
  const response = await axios.post(API_URL + "uploadResume", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const getJobs = async () => {
  const response = await axios.get(API_URL + "getJobs");
  return response.data;
};

const jobApplyByStudent = async (jobID) => {
  const response = await axios.post(API_URL + "jobApplyByStudent", { jobID });
  return response.data;
};

const utilService = {
  uploadProfilePicture,
  uploadResume,
  getJobs,
  jobApplyByStudent,
};

export default utilService;
