import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api-service/api.types";

export type WrappedHandler<T> = (
	request: NextRequest,
	context: any
) => Promise<T | ApiResponse<T> | Response> | T | ApiResponse<T> | Response;

/**
 * Higher-order function wrapper to intercept and format all backend responses/errors into
 * the unified ApiResponse structure.
 * 
 * @param handler The API route handler function to wrap.
 */
export function withResponseWrapper<T>(handler: WrappedHandler<T>) {
	return async (request: NextRequest, context: any): Promise<Response> => {
		const startTime = new Date().toISOString();
		const startMs = Date.now();

		try {
			// Execute the underlying API route logic
			const result = await handler(request, context);

			const endMs = Date.now();
			const endTime = new Date().toISOString();
			const executionTimeMs = endMs - startMs;

			const meta = {
				startTime,
				endTime,
				executionTimeMs,
			};

			// If the handler directly returned a standard Response (e.g. file downloads, redirects), bypass wrapping
			if (result instanceof Response) {
				return result;
			}

			// If the handler already returned a formatted ApiResponse envelope, pass it through and merge meta
			if (result && typeof result === "object" && "success" in result) {
				const apiResponse = result as ApiResponse<T>;
				const statusCode = apiResponse.statusCode || apiResponse.error?.statusCode || (apiResponse.success ? 200 : 500);

				return NextResponse.json(
					{
						...apiResponse,
						statusCode,
						meta: {
							...meta,
							...(apiResponse.meta || {}),
						},
					},
					{ status: statusCode }
				);
			}

			// Otherwise, automatically wrap the returned data in a successful ApiResponse envelope
			const responseBody: ApiResponse<T> = {
				success: true,
				statusCode: 200,
				data: result as T,
				meta,
			};

			return NextResponse.json(responseBody, { status: 200 });
		} catch (error: any) {
			const endMs = Date.now();
			const endTime = new Date().toISOString();
			const executionTimeMs = endMs - startMs;

			const statusCode = error.statusCode || error.status || 500;
			const message = error.message || "Internal Server Error";

			// Format all uncaught exceptions/errors into our uniform ApiError format
			const errorResponseBody: ApiResponse<null> = {
				success: false,
				statusCode,
				error: {
					message,
					statusCode,
					statusText: error.name || "Error",
					details: error.details || null,
				},
				meta: {
					startTime,
					endTime,
					executionTimeMs,
				},
			};

			return NextResponse.json(errorResponseBody, { status: statusCode });
		}
	};
}
