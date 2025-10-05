import axiosClient from "./axiosClient";
import { ENDPOINTS } from "@/config/api";
export const getJobs = () => axiosClient.get(ENDPOINTS[0].jobs);