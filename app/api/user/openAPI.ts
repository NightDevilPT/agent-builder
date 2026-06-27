import { createResponseSchema, createErrorResponseSchema } from "@/lib/swagger/registry";

export const userTags = [
	{ name: "User", description: "User registration and profile management operations" }
];

export const userOpenAPI = {
	"/api/user": {
		post: {
			tags: ["User"],
			summary: "Register a new user profile",
			description: "Registers a new user inside the platform with unique email, username, and password credentials.",
			security: [], // Public registration endpoint
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: { type: "string", format: "email", example: "johndoe@example.com" },
								username: { type: "string", example: "johndoe" },
								password: { type: "string", format: "password", example: "securePass123" },
								firstName: { type: "string", example: "John", nullable: true },
								lastName: { type: "string", example: "Doe", nullable: true },
								avatar: { type: "string", example: "https://example.com/avatar.png", nullable: true }
							},
							required: ["email", "username", "password"]
						}
					}
				}
			},
			responses: {
				200: {
					description: "User registered successfully",
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
				400: {
					description: "Validation failure or email/username already exists",
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
