// export const USER_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/user";
// export const JOB_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/job";
// export const APPLICATION_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/application";
// export const COMPANY_API_END_POINT="https://job-portel-1-42el.onrender.com/api/v1/company";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT=`${API_BASE_URL}/user`;
export const JOB_API_END_POINT=`${API_BASE_URL}/job`;
export const APPLICATION_API_END_POINT=`${API_BASE_URL}/application`;
export const COMPANY_API_END_POINT=`${API_BASE_URL}/company`;