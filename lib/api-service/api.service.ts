import { ApiResponse } from "./api.types";
import { config } from "@/config";

export interface RequestOptions extends RequestInit {
	params?: Record<string, string | number | boolean>;
}

class ApiService {
	private baseUrl: string = "";

	constructor(baseUrl?: string) {
		this.baseUrl = baseUrl || config.api.baseUrl || "";
	}

	/**
	 * Resolves absolute URLs from path and search queries.
	 */
	private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
		const base = this.baseUrl || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
		
		// If path is already absolute, parse it directly
		if (path.startsWith("http://") || path.startsWith("https://")) {
			const absoluteUrl = new URL(path);
			if (params) {
				Object.entries(params).forEach(([key, val]) => {
					if (val !== undefined && val !== null) {
						absoluteUrl.searchParams.append(key, val.toString());
					}
				});
			}
			return absoluteUrl.toString();
		}

		// Ensure path starts with a slash if not empty
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;
		const url = new URL(`${normalizedPath}`, base);
		
		if (params) {
			Object.entries(params).forEach(([key, val]) => {
				if (val !== undefined && val !== null) {
					url.searchParams.append(key, val.toString());
				}
			});
		}
		
		return url.toString();
	}

	/**
	 * Core generic fetch wrapper that handles execution duration, error logging, and standard response formats.
	 */
	async request<T>(
		path: string,
		options: RequestOptions = {}
	): Promise<ApiResponse<T>> {
		const { params, headers, ...fetchOptions } = options;
		const url = this.buildUrl(path, params);

		const defaultHeaders: HeadersInit = {
			"Content-Type": "application/json",
		};

		const mergedHeaders = {
			...defaultHeaders,
			...headers,
		};

		// Default options like credentials setup for session cookies
		const defaultOptions: RequestInit = {
			credentials: "include",
		};

		const response = await fetch(url, {
			...defaultOptions,
			...fetchOptions,
			headers: mergedHeaders,
		});

		const text = await response.text();
		const parsedBody = text ? JSON.parse(text) : null;
		
		return parsedBody as ApiResponse<T>;
	}

	async get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>(path, { ...options, method: "GET" });
	}

	async post<T>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>(path, {
			...options,
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	async put<T>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>(path, {
			...options,
			method: "PUT",
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	async delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>(path, { ...options, method: "DELETE" });
	}
}

// Export default singleton instance
export const apiService = new ApiService();
// Export class for custom instances (e.g. external APIs)
export { ApiService };
