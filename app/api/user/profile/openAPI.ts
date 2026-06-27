import { createResponseSchema, createErrorResponseSchema } from "@/lib/swagger/registry";

export const userProfileTags = [];

export const userProfileOpenAPI = {
	"/api/user/profile": {
		get: {
			tags: ["User"],
			summary: "Get current user profile",
			description: "Retrieves details of the authenticated user session from HTTP cookies.",
			responses: {
				200: {
					description: "Profile details retrieved successfully",
					content: {
						"application/json": {
							schema: createResponseSchema({
								type: "object",
								properties: {
									id: { type: "string", format: "uuid", example: "f7b11d23-289e-4e4b-9721-654321098765" },
									email: { type: "string", example: "johndoe@example.com" },
									username: { type: "string", example: "johndoe" },
									firstName: { type: "string", example: "John", nullable: true },
									lastName: { type: "string", example: "Doe", nullable: true },
									avatar: { type: "string", example: "https://example.com/avatar.png", nullable: true },
									createdAt: { type: "string", format: "date-time", example: "2026-06-27T15:00:00.000Z" },
									updatedAt: { type: "string", format: "date-time", example: "2026-06-27T15:00:00.000Z" }
								},
								required: ["id", "email", "username", "createdAt", "updatedAt"]
							})
						}
					}
				},
				401: {
					description: "Unauthorized - missing or invalid session cookie tokens",
					content: {
						"application/json": {
							schema: createErrorResponseSchema()
						}
					}
				},
				404: {
					description: "User profile not found in database",
					content: {
						"application/json": {
							schema: createErrorResponseSchema()
						}
					}
				}
			}
		},
		put: {
			tags: ["User"],
			summary: "Update current user profile",
			description: "Modifies username, names, or avatar parameters of the authenticated user session from HTTP cookies.",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								username: { type: "string", example: "john_updated" },
								firstName: { type: "string", example: "Johnnie", nullable: true },
								lastName: { type: "string", example: "Doey", nullable: true },
								avatar: { type: "string", example: "https://example.com/new-avatar.png", nullable: true }
							}
						}
					}
				}
			},
			responses: {
				200: {
					description: "User profile updated successfully",
					content: {
						"application/json": {
							schema: createResponseSchema({
								type: "object",
								properties: {
									id: { type: "string", format: "uuid", example: "f7b11d23-289e-4e4b-9721-654321098765" },
									email: { type: "string", example: "johndoe@example.com" },
									username: { type: "string", example: "john_updated" },
									firstName: { type: "string", example: "Johnnie", nullable: true },
									lastName: { type: "string", example: "Doey", nullable: true },
									avatar: { type: "string", example: "https://example.com/new-avatar.png", nullable: true },
									createdAt: { type: "string", format: "date-time", example: "2026-06-27T15:00:00.000Z" },
									updatedAt: { type: "string", format: "date-time", example: "2026-06-27T15:00:00.000Z" }
								},
								required: ["id", "email", "username", "createdAt", "updatedAt"]
							})
						}
					}
				},
				400: {
					description: "Validation failure or username already taken",
					content: {
						"application/json": {
							schema: createErrorResponseSchema()
						}
					}
				},
				401: {
					description: "Unauthorized - missing or invalid session cookie tokens",
					content: {
						"application/json": {
							schema: createErrorResponseSchema()
						}
					}
				},
				404: {
					description: "User profile not found in database",
					content: {
						"application/json": {
							schema: createErrorResponseSchema()
						}
					}
				}
			}
		}
	}
};
