import { healthOpenAPI, healthTags } from "@/app/api/health/openAPI";
import { userOpenAPI, userTags } from "@/app/api/user/openAPI";
import { userProfileOpenAPI, userProfileTags } from "@/app/api/user/profile/openAPI";

// 1. Gather all API endpoint specifications
export const paths = {
	...healthOpenAPI,
	...userOpenAPI,
	...userProfileOpenAPI,
};

// 2. Define global tags for navigation categorization by spreading imported tags
export const tags = [
	...healthTags,
	...userTags,
	...userProfileTags,
];

// 3. Define common, reusable Swagger schemas
export const components = {
	securitySchemes: {
		AccessTokenAuth: {
			type: "apiKey",
			in: "cookie",
			name: "accessToken",
		},
		RefreshTokenAuth: {
			type: "apiKey",
			in: "cookie",
			name: "refreshToken",
		}
	},
	schemas: {
		ApiMeta: {
			type: "object",
			properties: {
				startTime: { type: "string", format: "date-time", example: "2026-06-27T13:05:12.429Z" },
				endTime: { type: "string", format: "date-time", example: "2026-06-27T13:05:12.431Z" },
				executionTimeMs: { type: "integer", example: 2 },
			},
			required: ["startTime", "endTime", "executionTimeMs"],
		},
		ApiPagination: {
			type: "object",
			properties: {
				page: { type: "integer", example: 1 },
				limit: { type: "integer", example: 10 },
				totalPages: { type: "integer", example: 5 },
				totalRecords: { type: "integer", example: 45 },
				hasNext: { type: "boolean", example: true },
				hasPrev: { type: "boolean", example: false },
			},
			required: ["page", "limit", "totalPages", "totalRecords", "hasNext", "hasPrev"],
		},
		ApiError: {
			type: "object",
			properties: {
				message: { type: "string", example: "Rate limit exceeded. Please try again later." },
				statusCode: { type: "integer", example: 429 },
				statusText: { type: "string", example: "Too Many Requests" },
				details: { type: "object", nullable: true, example: null },
			},
			required: ["message", "statusCode", "statusText"],
		},
	},
};

/**
 * Reusable schema helper to wrap raw data schemas inside the standard ApiResponse layout.
 * 
 * @param dataSchemaRefOrObject The OpenAPI schema definition of the inner data field.
 * @param includePagination Set to true to include the ApiPagination schema reference.
 */
export function createResponseSchema(dataSchemaRefOrObject: any, includePagination = false) {
	return {
		type: "object",
		properties: {
			success: { type: "boolean", example: true },
			statusCode: { type: "integer", example: 200 },
			data: dataSchemaRefOrObject,
			meta: { $ref: "#/components/schemas/ApiMeta" },
			...(includePagination ? { pagination: { $ref: "#/components/schemas/ApiPagination" } } : {}),
		},
		required: ["success", "statusCode", "meta"],
	};
}

/**
 * Reusable schema helper to define a standard failed ApiResponse.
 */
export function createErrorResponseSchema() {
	return {
		type: "object",
		properties: {
			success: { type: "boolean", example: false },
			statusCode: { type: "integer", example: 400 },
			error: { $ref: "#/components/schemas/ApiError" },
			meta: { $ref: "#/components/schemas/ApiMeta" },
		},
		required: ["success", "statusCode", "error", "meta"],
	};
}
