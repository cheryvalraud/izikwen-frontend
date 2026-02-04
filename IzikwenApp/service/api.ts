import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const API_BASE = "http://10.0.0.119:8080";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

let isRefreshing = false;
let refreshWaiters: ((token: string | null) => void)[] = [];

function notifyWaiters(token: string | null) {
  refreshWaiters.forEach((cb) => cb(token));
  refreshWaiters = [];
}

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean });

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    // Prevent infinite loops if refresh itself fails with 401
    if (original.url?.includes("/auth/refresh")) {
      await tokenStorage.clearAll();
      return Promise.reject(error);
    }

    original._retry = true;

    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      await tokenStorage.clearAll();
      return Promise.reject(error);
    }

    // If refresh already running, wait for it
    if (isRefreshing) {
      const newToken = await new Promise<string | null>((resolve) => {
        refreshWaiters.push(resolve);
      });

      if (!newToken) {
        await tokenStorage.clearAll();
        return Promise.reject(error);
      }

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    }

    // Start refresh
    isRefreshing = true;

    try {
      const refreshRes = await axios.post(
        `${API_BASE}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      const newAccess = (refreshRes.data as any)?.accessToken as string;
      if (!newAccess) throw new Error("No accessToken returned from refresh");

      await tokenStorage.setAccessToken(newAccess);
      notifyWaiters(newAccess);

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (e) {
      notifyWaiters(null);
      await tokenStorage.clearAll();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
