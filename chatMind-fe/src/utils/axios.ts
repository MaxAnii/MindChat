import axios, { AxiosError } from "axios";

// Create axios instance
const api = axios.create({
	baseURL: "http://localhost:3000",
	withCredentials: true, // send cookies automatically
});

// Flag to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: {
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (
	error: AxiosError | null,
	token: string | null = null
) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(token);
	});
	failedQueue = [];
};

// Add response interceptor
api.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const originalRequest: any = error.config;

		// If it's not 401 OR the refresh endpoint itself, reject normally
		if (error.response?.status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		// Mark request as retried
		originalRequest._retry = true;

		// Only one refresh request at a time
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			})
				.then(() => api(originalRequest))
				.catch((err) => Promise.reject(err));
		}

		isRefreshing = true;

		try {
			await api.post("/auth/refresh"); // hits backend to refresh tokens

			processQueue(null, null);
			return api(originalRequest); // retry original request
		} catch (refreshError) {
			processQueue(refreshError as AxiosError, null);
			throw refreshError;
		} finally {
			isRefreshing = false;
		}
	}
);

export default api;
