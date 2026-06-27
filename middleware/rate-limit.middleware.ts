import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config";
import { ApiResponse } from "@/lib/api-service/api.types";

interface RateLimitInfo {
	count: number;
	resetTime: number;
}

// In-memory cache for IP requests
const rateLimitMap = new Map<string, RateLimitInfo>();

// Run garbage collection periodically to prevent memory leaks from inactive IPs
if (typeof setInterval !== "undefined") {
	setInterval(() => {
		const now = Date.now();
		for (const [key, value] of rateLimitMap.entries()) {
			if (now > value.resetTime) {
				rateLimitMap.delete(key);
			}
		}
	}, 60000); // Run clean-up every 60 seconds
}

export interface RateLimitOptions {
	limit?: number;     // Maximum number of requests allowed in the window
	windowMs?: number;  // Window duration in milliseconds (e.g. 60000 for 1 minute)
}

export type NextRouteHandler = (
	request: NextRequest,
	context: any
) => Promise<Response> | Response;

/**
 * Higher-order function wrapper to enforce rate limiting on Next.js API Routes.
 * 
 * @param handler The API route handler function to protect.
 * @param options Rate limit configurations (limit, windowMs).
 */
export function withRateLimit(
	handler: NextRouteHandler,
	options?: RateLimitOptions
) {
	const limit = options?.limit ?? config.rateLimits.default.limit; // Default from config
	const windowMs = options?.windowMs ?? config.rateLimits.default.windowMs; // Default from config

	return async (request: NextRequest, context: any) => {
		// Extract client IP address from request metadata or fallback headers
		const ip =
			(request as any).ip ||
			request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
			request.headers.get("x-real-ip") ||
			"127.0.0.1";

		const now = Date.now();
		let clientLimit = rateLimitMap.get(ip);

		// Initialize or reset key if window has elapsed
		if (!clientLimit || now > clientLimit.resetTime) {
			clientLimit = {
				count: 0,
				resetTime: now + windowMs,
			};
		}

		// Increment request tally
		clientLimit.count += 1;
		rateLimitMap.set(ip, clientLimit);

		const remaining = Math.max(0, limit - clientLimit.count);
		const resetSeconds = Math.ceil(clientLimit.resetTime / 1000);

		// Setup standard rate limit response headers
		const rateLimitHeaders = {
			"X-RateLimit-Limit": limit.toString(),
			"X-RateLimit-Remaining": remaining.toString(),
			"X-RateLimit-Reset": resetSeconds.toString(),
		};

		// If threshold exceeded, immediately block request and respond with 429 Too Many Requests
		if (clientLimit.count > limit) {
			const retryAfter = Math.ceil((clientLimit.resetTime - now) / 1000);
			const errorResponseBody: ApiResponse<null> = {
				success: false,
				statusCode: 429,
				error: {
					message: "Rate limit exceeded. Please try again later.",
					statusCode: 429,
					statusText: "Too Many Requests",
				},
			};
			return NextResponse.json(
				errorResponseBody,
				{
					status: 429,
					headers: {
						...rateLimitHeaders,
						"Retry-After": retryAfter.toString(),
					},
				}
			);
		}

		try {
			// Await the nested handler with full context mapping (params, queries, etc.)
			const response = await handler(request, context);

			// Append the rate limit indicators to the route's response headers
			Object.entries(rateLimitHeaders).forEach(([key, val]) => {
				response.headers.set(key, val);
			});

			return response;
		} catch (error) {
			console.error(`Rate limit handler error [IP: ${ip}]:`, error);
			// Forward errors up the stack to be caught by the route or global error boundary
			throw error;
		}
	};
}
