# Backend Developer Guide & Rules ⚙️

This rule book outlines the architectural patterns, directory conventions, and coding rules for developing APIs, database services, and security mechanisms in the AI Agent Builder.

---

## 1. Directory Layout & Nested API Routes

All backend features must separate HTTP parsing from core business logic using the following folder structure:

```
📁 app/
└── 📁 api/
    └── 📁 {featureName}/
        ├── 📄 route.ts                        # GET (list) & POST (create) endpoints
        ├── 📄 openAPI.ts                      # Swagger/OpenAPI spec for this route
        └── 📁 [{featureId}]/                  # Dynamic route segment (e.g., [agentId])
            ├── 📄 route.ts                    # GET (details), PUT (update) & DELETE endpoints
            ├── 📄 openAPI.ts                  # Swagger/OpenAPI spec for this route
            └── 📁 status/                     # Nested action endpoint (e.g., status, executions)
                ├── 📄 route.ts                # GET/PUT for specific sub-resource
                └── 📄 openAPI.ts              # Swagger/OpenAPI spec for this route

📁 lib/
└── 📁 {featureName}/
    ├── 📄 index.ts                            # Service Layer: DB queries, arithmetic, logic (No HTTP direct references)
    ├── 📄 types.ts                            # Types Layer: Shared TS interfaces between client and server
    └── 📄 validation.ts                       # Validation Layer: Zod schemas for input validation
```

---

## 2. Coding Patterns per Layer

### A. The Validation Layer (`lib/{featureName}/validation.ts`)

- Every API input (payload body, URL search queries, or path parameters) must be validated with Zod.
- **Schema Naming Convention**: camelCase, action verb + feature name + `Schema`:
    - `create{FeatureName}Schema` (e.g. `createAgentSchema`)
    - `update{FeatureName}Schema` (e.g. `updateAgentSchema`)
    - `get{FeatureName}Schema` / `delete{FeatureName}Schema` (if query params are required)

_Example (`lib/user/validation.ts`):_

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
	email: z.string().email("Invalid email address"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters long")
		.max(30, "Username must be at most 30 characters long")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain alphanumeric characters and underscores",
		),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(100),
	firstName: z.string().max(50).optional().nullable(),
	lastName: z.string().max(50).optional().nullable(),
	avatar: z.string().optional().nullable(),
});

export const updateUserSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(30)
		.regex(/^[a-zA-Z0-9_]+$/)
		.optional(),
	firstName: z.string().max(50).optional().nullable(),
	lastName: z.string().max(50).optional().nullable(),
	avatar: z.string().optional().nullable(),
});
```

---

### B. The Types Layer (`lib/{featureName}/types.ts`)

- Define strongly-typed TypeScript interfaces for all request and response shapes.
- **Request type naming**: `create{FeatureName}Request`, `update{FeatureName}Request` — always inferred from Zod schemas.
- **Response type naming**: `{FeatureName}Response` (e.g. `UserResponse`, `AgentResponse`).
- **Do not use DTO (Data Transfer Object) terminology**.
- **No `any` types** — use explicit interfaces, or fall back to `unknown` / `Record<string, unknown>`.
- `createdAt` / `updatedAt` should be typed as `Date` (Prisma returns `Date` objects — the route layer handles serialization).

_Example (`lib/user/types.ts`):_

```typescript
import { z } from "zod";
import { createUserSchema, updateUserSchema } from "./validation";

// Request types derived from Zod schemas
export type createUserRequest = z.infer<typeof createUserSchema>;
export type updateUserRequest = z.infer<typeof updateUserSchema>;

// Response interface — strictly typed, no "any"
export interface UserResponse {
	id: string;
	email: string;
	username: string;
	firstName: string | null;
	lastName: string | null;
	avatar: string | null;
	createdAt: Date;
	updatedAt: Date;
}
```

---

### C. The Service Layer (`lib/{featureName}/index.ts`)

- Handles all database mutations, third-party integrations, and business workflows.
- **Class pattern**: Implement logic inside a class named `{FeatureName}Service` and export a singleton:
    ```typescript
    export const userService = new UserService();
    ```
- **Zero HTTP references**: Never import from `next/server`, read `NextRequest`, or write `NextResponse` here.
- **`ServiceResult<T>` return type**: Every public service method must return `ServiceResult<T>` — a discriminated union defined in the same file. Never throw directly; let the route handler decide how to respond.
    ```typescript
    export type ServiceResult<T> =
    	| { success: true; data: T }
    	| { success: false; errorCode: ApiErrorCode };
    ```
- **Private `format{Model}` helper**: Use a private method to map raw Prisma model objects to the public `{FeatureName}Response` shape before returning.

_Example (`lib/user/index.ts`):_

```typescript
import { prisma } from "@/lib/prisma";
import { User } from "@/generated/prisma";
import crypto from "crypto";
import { createUserRequest, updateUserRequest, UserResponse } from "./types";
import { ApiErrorCode } from "@/lib/api-service/api.types";

export type ServiceResult<T> =
	| { success: true; data: T }
	| { success: false; errorCode: ApiErrorCode };

export function hashPassword(password: string): string {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");
	return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
	const parts = storedHash.split(":");
	const salt = parts[0];
	const originalHash = parts[1];
	if (!salt || !originalHash) return false;
	const hash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");
	return hash === originalHash;
}

class UserService {
	private formatUser(user: User): UserResponse {
		return {
			id: user.id,
			email: user.email,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	async createUser(
		data: createUserRequest,
	): Promise<ServiceResult<UserResponse>> {
		const existingEmail = await prisma.user.findUnique({
			where: { email: data.email },
		});
		if (existingEmail)
			return {
				success: false,
				errorCode: ApiErrorCode.EMAIL_ALREADY_REGISTERED,
			};

		const existingUsername = await prisma.user.findUnique({
			where: { username: data.username },
		});
		if (existingUsername)
			return {
				success: false,
				errorCode: ApiErrorCode.USERNAME_ALREADY_TAKEN,
			};

		const passwordHash = hashPassword(data.password);
		const user = await prisma.user.create({
			data: {
				email: data.email,
				username: data.username,
				passwordHash,
				firstName: data.firstName || null,
				lastName: data.lastName || null,
				avatar: data.avatar || null,
			},
		});

		return { success: true, data: this.formatUser(user) };
	}

	async updateUser(
		userId: string,
		data: updateUserRequest,
	): Promise<ServiceResult<UserResponse>> {
		const existing = await prisma.user.findUnique({
			where: { id: userId },
		});
		if (!existing)
			return { success: false, errorCode: ApiErrorCode.USER_NOT_FOUND };

		if (data.username) {
			const taken = await prisma.user.findFirst({
				where: { username: data.username, NOT: { id: userId } },
			});
			if (taken)
				return {
					success: false,
					errorCode: ApiErrorCode.USERNAME_ALREADY_TAKEN,
				};
		}

		const updated = await prisma.user.update({
			where: { id: userId },
			data: {
				...(data.username && { username: data.username }),
				...(data.firstName !== undefined && {
					firstName: data.firstName,
				}),
				...(data.lastName !== undefined && { lastName: data.lastName }),
				...(data.avatar !== undefined && { avatar: data.avatar }),
			},
		});

		return { success: true, data: this.formatUser(updated) };
	}

	async getUserById(userId: string): Promise<ServiceResult<UserResponse>> {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user)
			return { success: false, errorCode: ApiErrorCode.USER_NOT_FOUND };
		return { success: true, data: this.formatUser(user) };
	}
}

export const userService = new UserService();
```

---

### D. The Routing Layer (`app/api/{featureName}/route.ts`)

#### Middleware Stack & Composition Order

Middlewares are composed **inside-out**. The correct nesting order is:

| Layer                            | Middleware            | Purpose                                                                              |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| Outermost                        | `withRateLimit`       | IP-based request throttling                                                          |
| Middle _(protected routes only)_ | `withAuth`            | Cookie token validation; injects `context.user`                                      |
| Innermost                        | `withResponseWrapper` | Standardizes `ApiResponse<T>`, injects execution `meta`, catches uncaught exceptions |

**Public route** (no authentication required):

```typescript
export const POST = withRateLimit(
	withResponseWrapper(
		async (request: NextRequest): Promise<ApiResponse<UserResponse>> => {
			// handler body
		},
	),
	config.rateLimits.default,
);
```

**Protected route** (authentication required):

```typescript
export const GET = withRateLimit(
	withAuth(
		withResponseWrapper(
			async (
				request: NextRequest,
				context: any,
			): Promise<ApiResponse<UserResponse>> => {
				// handler body
			},
		),
	),
	config.rateLimits.default,
);
```

#### Error Handling Pattern

Route handlers **never re-throw errors**. All error paths — including service failures and unexpected exceptions — return a structured `ApiResponse` object directly. Use `ApiErrorCode` + `ApiErrorRegistry` for all known error cases, and fall back to `ApiErrorCode.INTERNAL_ERROR` in `catch` blocks:

```typescript
// Service failure
if (!result.success) {
  const errorDetail = ApiErrorRegistry[result.errorCode];
  return {
    success: false,
    statusCode: errorDetail.statusCode,
    error: {
      message: errorDetail.messageKey,
      statusCode: errorDetail.statusCode,
      statusText: errorDetail.statusText,
    },
  };
}

// Unexpected exception
catch (error: unknown) {
  console.error("Error in [METHOD] /api/[path]:", error);
  const message = error instanceof Error ? error.message : "";
  return {
    success: false,
    statusCode: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusCode,
    error: {
      message: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].messageKey,
      statusCode: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusCode,
      statusText: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusText,
      details: message ? { error: message } : null,
    },
  };
}
```

#### Validation in Route Handlers

Run `safeParse` before calling the service. On failure, return a `VALIDATION_FAILED` response immediately (do not throw):

```typescript
const validation = updateUserSchema.safeParse(body);
if (!validation.success) {
	return {
		success: false,
		statusCode: ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].statusCode,
		error: {
			message:
				ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].messageKey,
			statusCode:
				ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].statusCode,
			statusText:
				ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].statusText,
			details: validation.error.format(),
		},
	};
}
```

#### Reading Auth Context

When `withAuth` wraps the handler, the decoded JWT payload is available on `context.user`:

```typescript
const userId = context.user.userId;
const email = context.user.email;
```

`withAuth` transparently handles token renewal — if the access token is expired but the refresh token is valid, it regenerates both and sets them as `httpOnly` cookies on the response automatically.

#### Complete Route Example

```typescript
import { NextRequest } from "next/server";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { withResponseWrapper } from "@/middleware/response-wrapper.middleware";
import { withAuth } from "@/middleware/auth.middleware";
import { config } from "@/config";
import { userService } from "@/lib/user";
import { updateUserSchema } from "@/lib/user/validation";
import { UserResponse } from "@/lib/user/types";
import {
	ApiResponse,
	ApiErrorCode,
	ApiErrorRegistry,
} from "@/lib/api-service/api.types";

// GET /api/user/profile — protected
export const GET = withRateLimit(
	withAuth(
		withResponseWrapper(
			async (
				request: NextRequest,
				context: any,
			): Promise<ApiResponse<UserResponse>> => {
				try {
					const userId = context.user.userId;
					const result = await userService.getUserById(userId);

					if (!result.success) {
						const errorDetail = ApiErrorRegistry[result.errorCode];
						return {
							success: false,
							statusCode: errorDetail.statusCode,
							error: {
								message: errorDetail.messageKey,
								statusCode: errorDetail.statusCode,
								statusText: errorDetail.statusText,
							},
						};
					}

					return {
						success: true,
						statusCode: 200,
						data: result.data,
					};
				} catch (error: unknown) {
					console.error("Error in GET /api/user/profile:", error);
					const message = error instanceof Error ? error.message : "";
					return {
						success: false,
						statusCode:
							ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
								.statusCode,
						error: {
							message:
								ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
									.messageKey,
							statusCode:
								ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
									.statusCode,
							statusText:
								ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
									.statusText,
							details: message ? { error: message } : null,
						},
					};
				}
			},
		),
	),
	config.rateLimits.default,
);

// PUT /api/user/profile — protected
export const PUT = withRateLimit(
	withAuth(
		withResponseWrapper(
			async (
				request: NextRequest,
				context: any,
			): Promise<ApiResponse<UserResponse>> => {
				try {
					const userId = context.user.userId;
					const body = await request.json();

					const validation = updateUserSchema.safeParse(body);
					if (!validation.success) {
						return {
							success: false,
							statusCode:
								ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED]
									.statusCode,
							error: {
								message:
									ApiErrorRegistry[
										ApiErrorCode.VALIDATION_FAILED
									].messageKey,
								statusCode:
									ApiErrorRegistry[
										ApiErrorCode.VALIDATION_FAILED
									].statusCode,
								statusText:
									ApiErrorRegistry[
										ApiErrorCode.VALIDATION_FAILED
									].statusText,
								details: validation.error.format(),
							},
						};
					}

					const result = await userService.updateUser(
						userId,
						validation.data,
					);
					if (!result.success) {
						const errorDetail = ApiErrorRegistry[result.errorCode];
						return {
							success: false,
							statusCode: errorDetail.statusCode,
							error: {
								message: errorDetail.messageKey,
								statusCode: errorDetail.statusCode,
								statusText: errorDetail.statusText,
							},
						};
					}

					return {
						success: true,
						statusCode: 200,
						data: result.data,
					};
				} catch (error: unknown) {
					console.error("Error in PUT /api/user/profile:", error);
					const message = error instanceof Error ? error.message : "";
					return {
						success: false,
						statusCode:
							ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
								.statusCode,
						error: {
							message:
								ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
									.messageKey,
							statusCode:
								ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
									.statusCode,
							statusText:
								ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR]
									.statusText,
							details: message ? { error: message } : null,
						},
					};
				}
			},
		),
	),
	config.rateLimits.default,
);
```

---

## 3. Standard API Response Structure (`lib/api-service/api.types.ts`)

All interfaces for request/response shapes are centralised here. **Never redefine these inline.**

```typescript
export interface ApiPagination {
	page: number;
	limit: number;
	totalPages: number;
	totalRecords: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface ApiMeta {
	startTime: string;
	endTime: string;
	executionTimeMs: number;
	[key: string]: unknown;
}

export interface ApiError {
	message: string;
	statusCode: number;
	statusText: string;
	details?: unknown;
}

export interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	data?: T;
	pagination?: ApiPagination;
	meta?: ApiMeta;
	error?: ApiError;
}
```

---

## 4. Error Code Registry (`lib/api-service/api.types.ts`)

All known error cases are centralised in `ApiErrorCode` (enum) and `ApiErrorRegistry` (lookup map). **Never hardcode status codes or error message strings in route handlers or service files.**

#### Defining Error Codes

Add new errors to the enum and registry here — never create one-off error objects inline in routes:

```typescript
export enum ApiErrorCode {
	VALIDATION_FAILED = "VALIDATION_FAILED",
	EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED",
	USERNAME_ALREADY_TAKEN = "USERNAME_ALREADY_TAKEN",
	USER_NOT_FOUND = "USER_NOT_FOUND",
	UNAUTHORIZED = "UNAUTHORIZED",
	INTERNAL_ERROR = "INTERNAL_ERROR",
	BAD_REQUEST = "BAD_REQUEST",
	NOT_FOUND = "NOT_FOUND",
	RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
	// Add new feature-specific codes here
}

export interface ApiErrorDetail {
	statusCode: number;
	statusText: string;
	messageKey: string; // i18n translation key, e.g. "errors.user_not_found"
}

export const ApiErrorRegistry: Record<ApiErrorCode, ApiErrorDetail> = {
	[ApiErrorCode.VALIDATION_FAILED]: {
		statusCode: 400,
		statusText: "Bad Request",
		messageKey: "errors.validation_failed",
	},
	[ApiErrorCode.EMAIL_ALREADY_REGISTERED]: {
		statusCode: 400,
		statusText: "Bad Request",
		messageKey: "errors.email_already_registered",
	},
	[ApiErrorCode.USERNAME_ALREADY_TAKEN]: {
		statusCode: 400,
		statusText: "Bad Request",
		messageKey: "errors.username_already_taken",
	},
	[ApiErrorCode.USER_NOT_FOUND]: {
		statusCode: 404,
		statusText: "Not Found",
		messageKey: "errors.user_not_found",
	},
	[ApiErrorCode.UNAUTHORIZED]: {
		statusCode: 401,
		statusText: "Unauthorized",
		messageKey: "errors.unauthorized",
	},
	[ApiErrorCode.INTERNAL_ERROR]: {
		statusCode: 500,
		statusText: "Internal Server Error",
		messageKey: "errors.internal_error",
	},
	[ApiErrorCode.BAD_REQUEST]: {
		statusCode: 400,
		statusText: "Bad Request",
		messageKey: "errors.bad_request",
	},
	[ApiErrorCode.NOT_FOUND]: {
		statusCode: 404,
		statusText: "Not Found",
		messageKey: "errors.not_found",
	},
	[ApiErrorCode.RATE_LIMIT_EXCEEDED]: {
		statusCode: 429,
		statusText: "Too Many Requests",
		messageKey: "errors.rate_limit_exceeded",
	},
};
```

#### Rules

- `messageKey` values are i18n keys, not raw strings. Never put a human-readable sentence directly into the registry.
- `UNAUTHORIZED` is handled internally by `withAuth` — do not manually return it in protected route handlers.
- When adding a new feature, add its specific error codes to both `ApiErrorCode` and `ApiErrorRegistry` before writing any service or route code.

---

## 5. Rate Limiting Guidelines

Every API endpoint must be wrapped in `withRateLimit`.

- Read thresholds from the central `config` object (`import { config } from "@/config"`). Never hardcode numbers.
- Pass `config.rateLimits.default` unless the endpoint warrants a custom limit:
    ```typescript
    export const GET = withRateLimit(
      withResponseWrapper(async () => { ... }),
      config.rateLimits.default
    );
    ```
- The middleware automatically injects `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers on every response, and returns a `429` with `Retry-After` when the limit is exceeded.

---

## 6. Configuration & Environment Variables

- **Never** use `process.env` directly anywhere outside `config/index.ts`.
- Access all environment values through the central config import:

| Value                | Config path                 |
| -------------------- | --------------------------- |
| Database URL         | `config.db.url`             |
| JWT Access Secret    | `config.jwt.secret`         |
| JWT Refresh Secret   | `config.jwt.refreshSecret`  |
| Access Token Expiry  | `config.jwt.accessExpiry`   |
| Refresh Token Expiry | `config.jwt.refreshExpiry`  |
| API Base URL         | `config.api.baseUrl`        |
| Rate Limit (default) | `config.rateLimits.default` |

---

## 7. Database Access (Prisma)

- Import the shared Prisma singleton from `@/lib/prisma` — never instantiate `PrismaClient` directly inside feature files.
- The singleton uses a global reference to prevent connection pool exhaustion during hot-reload in development.

```typescript
import { prisma } from "@/lib/prisma";

// Usage inside a service
const user = await prisma.user.findUnique({ where: { id: userId } });
```

- All Prisma models are generated to `@/generated/prisma`. Import model types from there, not from `@prisma/client`.

---

## 8. Authentication (`lib/jwt-service/jwt.service.ts`)

Authentication is cookie-based using `httpOnly` JWT access and refresh tokens. The `withAuth` middleware handles all validation automatically — route handlers do not inspect tokens directly.

#### `TokenPayload` shape

```typescript
export interface TokenPayload {
	userId: string;
	email: string;
}
```

#### `jwtService` methods (for auth routes only — do not call elsewhere)

```typescript
// Generate a new token pair (used in login / register)
const { accessToken, refreshToken } = jwtService.generateTokens({
	userId,
	email,
});

// Verify tokens (used internally by withAuth — do not call in routes)
const payload = jwtService.verifyAccessToken(token);
const payload = jwtService.verifyRefreshToken(token);
```

#### Cookie rules

Both tokens are set as `httpOnly`, `sameSite: "lax"`, and `secure: true` in production. The `withAuth` middleware renews both cookies transparently when the access token has expired and the refresh token is still valid.

---

## 9. OpenAPI Documentation (`app/api/{featureName}/openAPI.ts`)

Every route must have a co-located `openAPI.ts` file with two named exports. These are statically imported into the global registry.

### File structure & naming

| Export                 | Type     | Purpose                                                         |
| ---------------------- | -------- | --------------------------------------------------------------- |
| `{featureName}Tags`    | `Array`  | Declares the Swagger tag group. Empty array `[]` on sub-routes. |
| `{featureName}OpenAPI` | `Object` | Path + operation definitions for this route.                    |

### Tag ownership rule

- Tags are declared **once** at the top-level route (`/api/user/openAPI.ts` → `userTags`).
- All nested/sub-routes that share the same tag group must export an **empty array** — never omit the export entirely.

```typescript
// app/api/user/openAPI.ts — parent, declares the tag
export const userTags = [
	{
		name: "User",
		description: "User registration and profile management operations",
	},
];

// app/api/user/profile/openAPI.ts — sub-route, reuses tag string, no new tag declared
export const userProfileTags = [];
```

### Schema helpers (imported from `@/lib/swagger/registry`)

| Helper                                                 | When to use                                         |
| ------------------------------------------------------ | --------------------------------------------------- |
| `createResponseSchema(dataSchema, includePagination?)` | Wrap any successful `200` response data             |
| `createErrorResponseSchema()`                          | Wrap any error response (`400`, `401`, `404`, etc.) |

Both helpers reference the globally registered `ApiMeta`, `ApiPagination`, and `ApiError` component schemas — do not duplicate those definitions inline.

### Public endpoint rule

Add `security: []` explicitly to any operation that does not require authentication (e.g., registration, health check). Omitting it inherits the global cookie-based security scheme.

### Full `openAPI.ts` examples

**Parent route — creates tag, public `POST`:**

```typescript
// app/api/user/openAPI.ts
import {
	createResponseSchema,
	createErrorResponseSchema,
} from "@/lib/swagger/registry";

export const userTags = [
	{
		name: "User",
		description: "User registration and profile management operations",
	},
];

export const userOpenAPI = {
	"/api/user": {
		post: {
			tags: ["User"],
			summary: "Register a new user profile",
			description:
				"Registers a new user inside the platform with unique email, username, and password credentials.",
			security: [], // Public endpoint — no auth cookie required
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									format: "email",
									example: "johndoe@example.com",
								},
								username: {
									type: "string",
									example: "johndoe",
								},
								password: {
									type: "string",
									format: "password",
									example: "securePass123",
								},
								firstName: {
									type: "string",
									example: "John",
									nullable: true,
								},
								lastName: {
									type: "string",
									example: "Doe",
									nullable: true,
								},
								avatar: {
									type: "string",
									example: "https://example.com/avatar.png",
									nullable: true,
								},
							},
							required: ["email", "username", "password"],
						},
					},
				},
			},
			responses: {
				200: {
					description: "User registered successfully",
					content: {
						"application/json": {
							schema: createResponseSchema({
								type: "object",
								properties: {
									id: {
										type: "string",
										format: "uuid",
										example:
											"f7b11d23-289e-4e4b-9721-654321098765",
									},
									email: {
										type: "string",
										example: "johndoe@example.com",
									},
									username: {
										type: "string",
										example: "johndoe",
									},
									firstName: {
										type: "string",
										example: "John",
										nullable: true,
									},
									lastName: {
										type: "string",
										example: "Doe",
										nullable: true,
									},
									avatar: {
										type: "string",
										example:
											"https://example.com/avatar.png",
										nullable: true,
									},
									createdAt: {
										type: "string",
										format: "date-time",
										example: "2026-06-27T15:00:00.000Z",
									},
									updatedAt: {
										type: "string",
										format: "date-time",
										example: "2026-06-27T15:00:00.000Z",
									},
								},
								required: [
									"id",
									"email",
									"username",
									"createdAt",
									"updatedAt",
								],
							}),
						},
					},
				},
				400: {
					description:
						"Validation failure or email/username already exists",
					content: {
						"application/json": {
							schema: createErrorResponseSchema(),
						},
					},
				},
			},
		},
	},
};
```

**Sub-route — empty tags, protected `GET` + `PUT`:**

```typescript
// app/api/user/profile/openAPI.ts
import {
	createResponseSchema,
	createErrorResponseSchema,
} from "@/lib/swagger/registry";

export const userProfileTags = []; // Tag declared by parent — no duplicate needed

export const userProfileOpenAPI = {
	"/api/user/profile": {
		get: {
			tags: ["User"],
			summary: "Get current user profile",
			description:
				"Retrieves details of the authenticated user session from HTTP cookies.",
			responses: {
				200: {
					description: "Profile details retrieved successfully",
					content: {
						"application/json": {
							schema: createResponseSchema({
								type: "object",
								properties: {
									id: {
										type: "string",
										format: "uuid",
										example:
											"f7b11d23-289e-4e4b-9721-654321098765",
									},
									email: {
										type: "string",
										example: "johndoe@example.com",
									},
									username: {
										type: "string",
										example: "johndoe",
									},
									firstName: {
										type: "string",
										example: "John",
										nullable: true,
									},
									lastName: {
										type: "string",
										example: "Doe",
										nullable: true,
									},
									avatar: {
										type: "string",
										example:
											"https://example.com/avatar.png",
										nullable: true,
									},
									createdAt: {
										type: "string",
										format: "date-time",
										example: "2026-06-27T15:00:00.000Z",
									},
									updatedAt: {
										type: "string",
										format: "date-time",
										example: "2026-06-27T15:00:00.000Z",
									},
								},
								required: [
									"id",
									"email",
									"username",
									"createdAt",
									"updatedAt",
								],
							}),
						},
					},
				},
				401: {
					description:
						"Unauthorized — missing or invalid session cookies",
					content: {
						"application/json": {
							schema: createErrorResponseSchema(),
						},
					},
				},
				404: {
					description: "User profile not found in database",
					content: {
						"application/json": {
							schema: createErrorResponseSchema(),
						},
					},
				},
			},
		},
		put: {
			tags: ["User"],
			summary: "Update current user profile",
			description:
				"Modifies username, names, or avatar of the authenticated user.",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								username: {
									type: "string",
									example: "john_updated",
								},
								firstName: {
									type: "string",
									example: "Johnnie",
									nullable: true,
								},
								lastName: {
									type: "string",
									example: "Doey",
									nullable: true,
								},
								avatar: {
									type: "string",
									example:
										"https://example.com/new-avatar.png",
									nullable: true,
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "User profile updated successfully",
					content: {
						"application/json": {
							schema: createResponseSchema({
								type: "object",
								properties: {
									id: {
										type: "string",
										format: "uuid",
										example:
											"f7b11d23-289e-4e4b-9721-654321098765",
									},
									email: {
										type: "string",
										example: "johndoe@example.com",
									},
									username: {
										type: "string",
										example: "john_updated",
									},
									firstName: {
										type: "string",
										example: "Johnnie",
										nullable: true,
									},
									lastName: {
										type: "string",
										example: "Doey",
										nullable: true,
									},
									avatar: {
										type: "string",
										example:
											"https://example.com/new-avatar.png",
										nullable: true,
									},
									createdAt: {
										type: "string",
										format: "date-time",
										example: "2026-06-27T15:00:00.000Z",
									},
									updatedAt: {
										type: "string",
										format: "date-time",
										example: "2026-06-27T15:00:00.000Z",
									},
								},
								required: [
									"id",
									"email",
									"username",
									"createdAt",
									"updatedAt",
								],
							}),
						},
					},
				},
				400: {
					description: "Validation failure or username already taken",
					content: {
						"application/json": {
							schema: createErrorResponseSchema(),
						},
					},
				},
				401: {
					description:
						"Unauthorized — missing or invalid session cookies",
					content: {
						"application/json": {
							schema: createErrorResponseSchema(),
						},
					},
				},
				404: {
					description: "User profile not found in database",
					content: {
						"application/json": {
							schema: createErrorResponseSchema(),
						},
					},
				},
			},
		},
	},
};
```

---

## 10. Swagger Global Registry (`lib/swagger/registry.ts`)

This is the single aggregation point for all OpenAPI specs. Every new `openAPI.ts` file must be imported and spread here — nowhere else.

### Structure

```typescript
// lib/swagger/registry.ts

import { healthOpenAPI, healthTags } from "@/app/api/health/openAPI";
import { userOpenAPI, userTags } from "@/app/api/user/openAPI";
import {
	userProfileOpenAPI,
	userProfileTags,
} from "@/app/api/user/profile/openAPI";
// Add new feature imports here following the same pattern

// 1. All endpoint path definitions
export const paths = {
	...healthOpenAPI,
	...userOpenAPI,
	...userProfileOpenAPI,
	// ...newFeatureOpenAPI,
};

// 2. All tag group definitions
export const tags = [
	...healthTags,
	...userTags,
	...userProfileTags,
	// ...newFeatureTags,
];

// 3. Global reusable component schemas (do not edit these per-feature)
export const components = {
	securitySchemes: {
		AccessTokenAuth: { type: "apiKey", in: "cookie", name: "accessToken" },
		RefreshTokenAuth: {
			type: "apiKey",
			in: "cookie",
			name: "refreshToken",
		},
	},
	schemas: {
		ApiMeta: {
			type: "object",
			properties: {
				startTime: {
					type: "string",
					format: "date-time",
					example: "2026-06-27T13:05:12.429Z",
				},
				endTime: {
					type: "string",
					format: "date-time",
					example: "2026-06-27T13:05:12.431Z",
				},
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
			required: [
				"page",
				"limit",
				"totalPages",
				"totalRecords",
				"hasNext",
				"hasPrev",
			],
		},
		ApiError: {
			type: "object",
			properties: {
				message: {
					type: "string",
					example: "Rate limit exceeded. Please try again later.",
				},
				statusCode: { type: "integer", example: 429 },
				statusText: { type: "string", example: "Too Many Requests" },
				details: { type: "object", nullable: true, example: null },
			},
			required: ["message", "statusCode", "statusText"],
		},
	},
};

/**
 * Wraps a raw data schema inside the standard ApiResponse envelope for use in OpenAPI success responses.
 *
 * @param dataSchemaRefOrObject  OpenAPI schema for the `data` field.
 * @param includePagination      Pass true for paginated list endpoints.
 */
export function createResponseSchema(
	dataSchemaRefOrObject: any,
	includePagination = false,
) {
	return {
		type: "object",
		properties: {
			success: { type: "boolean", example: true },
			statusCode: { type: "integer", example: 200 },
			data: dataSchemaRefOrObject,
			meta: { $ref: "#/components/schemas/ApiMeta" },
			...(includePagination
				? { pagination: { $ref: "#/components/schemas/ApiPagination" } }
				: {}),
		},
		required: ["success", "statusCode", "meta"],
	};
}

/**
 * Returns the standard ApiResponse envelope for error responses.
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
```

### Rules for adding a new feature

1. Create `app/api/{featureName}/openAPI.ts` with `{featureName}Tags` and `{featureName}OpenAPI` exports.
2. Import both in `lib/swagger/registry.ts` and spread into `paths` and `tags`.
3. Do **not** add schemas to the `components.schemas` block for per-feature shapes — inline them inside `createResponseSchema(...)` calls in your `openAPI.ts` file.
4. Do **not** modify `components.securitySchemes` — cookie auth is globally configured in `lib/swagger/index.ts`.

---
