import { createResponseSchema } from "@/lib/swagger/registry";

export const healthTags = [
	{ name: "Health Check", description: "System health and status checkpoints" }
];

export const healthOpenAPI = {
	"/api/health": {
		get: {
			tags: ["Health Check"],
			summary: "System Health Status",
			description: "Returns the current server uptime, database status, and system timestamp.",
			security: [],
			responses: {
				200: {
					description: "System is operational",
					content: {
						"application/json": {
							schema: createResponseSchema({
								type: "object",
								properties: {
									status: {
										type: "string",
										example: "Welcome to Agent Builder"
									},
									uptime: {
										type: "number",
										example: 182.42
									},
									timestamp: {
										type: "string",
										example: "2026-06-27T13:05:12.431Z"
									}
								},
								required: ["status", "uptime", "timestamp"]
							})
						}
					}
				}
			}
		}
	}
};
