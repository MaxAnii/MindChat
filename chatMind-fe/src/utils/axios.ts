import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: AxiosError | null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(true);
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};

		//  Not a 401 OR already retried OR refresh request itself
		if (
			error.response?.status !== 401 ||
			originalRequest._retry ||
			originalRequest.url?.includes("/auth/refresh")
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		//  If refresh already in progress, queue request
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			}).then(() => api(originalRequest));
		}

		isRefreshing = true;

		try {
			await api.post("/auth/refresh", {}, { withCredentials: true });

			processQueue(null);
			return api(originalRequest);
		} catch (refreshError) {
			processQueue(refreshError as AxiosError);

			//  Refresh failed → force logout
			// window.location.href = "/auth";
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);

export default api;
