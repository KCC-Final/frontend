import axios from 'axios';

const grooApiBaseURL = `${process.env.NEXT_PUBLIC_GROO_API_HOST_URL}/${process.env.NEXT_PUBLIC_GROO_API_COMMON_PATH_URL}`;

export const axiosGroo = axios.create({
  baseURL: grooApiBaseURL,
  withCredentials: true
});
