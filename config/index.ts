export const config = {
	env: process.env.NODE_ENV || "development",
	api: {
		baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
	},
	db: {
		url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/agent_builder?schema=public",
	},
	jwt: {
		secret: process.env.JWT_SECRET || "default_jwt_secret_change_me_in_production",
		accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
		refreshSecret: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_change_me_in_production",
		refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
	},
	rateLimits: {
		default: {
			limit: Number(process.env.RATE_LIMIT_DEFAULT_LIMIT) || 10,
			windowMs: Number(process.env.RATE_LIMIT_DEFAULT_WINDOW) || 60000,
		},
	},
} as const;
