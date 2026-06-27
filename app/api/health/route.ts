import { NextRequest } from "next/server";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { withResponseWrapper } from "@/middleware/response-wrapper.middleware";
import { config } from "@/config";

export const GET = withRateLimit(
	withResponseWrapper(async (request: NextRequest) => {
		return {
			status: "Welcome to Agent Builder",
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
		};
	}),
	config.rateLimits.default,
);
