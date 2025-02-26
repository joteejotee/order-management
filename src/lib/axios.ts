import axios, { AxiosInstance, AxiosResponse } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

export default axiosInstance;
