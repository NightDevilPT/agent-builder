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
        └── 📁 [{featureId}]/                  # Dynamic route segment (e.g., [agentId])
            ├── 📄 route.ts                    # GET (details), PUT (update) & DELETE endpoints
            └── 📁 status/                     # Nested action endpoint (e.g., status, executions)
                └── 📄 route.ts                # GET/PUT for specific sub-resource
                
📁 lib/
└── 📁 {featureName}/
    ├── 📄 index.ts                            # Service Layer: DB queries, arithmetic, logic (No HTTP direct references)
    ├── 📄 types.ts                            # Types Layer: Shared TS interfaces between client and server
    └── 📄 validation.ts                       # Validation Layer: Zod schemas for input validation
```

---

## 2. Coding Patterns per Layer

### A. The Validation Layer (`lib/{featureName}/validation.ts`)
*   Every API input (payload body, URL search queries, or path parameters) must be validated.
*   **Schema Naming Convention**: Use camelCase starting with the action verb, followed by the feature name and ending in `Schema`:
    *   `create{FeatureName}Schema` (e.g. `createAgentSchema`)
    *   `update{FeatureName}Schema` (e.g. `updateAgentSchema`)
    *   `get{FeatureName}Schema` / `delete{FeatureName}Schema` (if query params are required)
*   *Example (`lib/agent/validation.ts`):*
    ```typescript
    import { z } from "zod";

    export const createAgentSchema = z.object({
      name: z.string().min(3).max(100),
      modelProvider: z.string(),
      temperature: z.number().min(0).max(2),
      systemPrompt: z.string().optional(),
    });

    export const updateAgentSchema = z.object({
      name: z.string().min(3).max(100).optional(),
      modelProvider: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
      systemPrompt: z.string().optional(),
    });
    ```

### B. The Types Layer (`lib/{featureName}/types.ts`)
*   Define strongly-typed TypeScript interfaces to type the response payloads returned to the frontend.
*   **Request Type Naming Convention**: Use `create{FeatureName}Request` and `update{FeatureName}Request` for types derived from Zod schemas:
    *   `export type createAgentRequest = z.infer<typeof createAgentSchema>;`
*   **Do not use DTO (Data Transfer Object) terminology**.
*   **No `any` Types**: Never use `any` in your type declarations. Use explicit interfaces or fall back to `unknown` / `Record<string, unknown>`.
*   **Response Naming Convention**: Use `{featureName}Response` (e.g. `AgentResponse`, `AgentStatusResponse`).
*   *Example (`lib/agent/types.ts`):*
    ```typescript
    import { z } from "zod";
    import { createAgentSchema, updateAgentSchema } from "./validation";

    // Request Types derived from schemas
    export type createAgentRequest = z.infer<typeof createAgentSchema>;
    export type updateAgentRequest = z.infer<typeof updateAgentSchema>;

    // Response Types (strictly typed without "any")
    export interface AgentResponse {
      id: string;
      name: string;
      modelProvider: string;
      temperature: number;
      systemPrompt: string | null;
      createdAt: string;
      updatedAt: string;
    }

    export interface AgentStatusResponse {
      id: string;
      status: "idle" | "running" | "success" | "failure";
      lastExecutedAt: string | null;
    }
    ```

### C. The Core Business Logic Layer (`lib/{featureName}/index.ts`)
*   Handles database mutations, third-party integrations, and workflows.
*   **Class Service Pattern**: Implement business logic inside a class named `{FeatureName}Service` and export a singleton instance named `{featureName}Service`:
    *   `export const agentService = new AgentService();`
*   **Zero HTTP References**: Do not read directly from `NextRequest`, nor write to `NextResponse`. The logic should receive standard TypeScript variables (using your defined `create{FeatureName}Request` or `update{FeatureName}Request` types) and return strongly-typed `{featureName}Response` structures.
*   *Example (`lib/agent/index.ts`):*
    ```typescript
    import { 
      AgentResponse, 
      AgentStatusResponse, 
      createAgentRequest, 
      updateAgentRequest 
    } from "./types";

    class AgentService {
      async createAgent(data: createAgentRequest): Promise<AgentResponse> {
        // 1. Perform database insertion using createAgentRequest attributes
        // 2. Return strongly-typed AgentResponse
      }

      async updateAgent(agentId: string, data: updateAgentRequest): Promise<AgentResponse> {
        // 1. Perform database update using updateAgentRequest attributes
        // 2. Return strongly-typed AgentResponse
      }

      async getAgentStatus(agentId: string): Promise<AgentStatusResponse> {
        // 1. Fetch status details
        // 2. Return strongly-typed AgentStatusResponse
      }
    }

    // Export service singleton instance
    export const agentService = new AgentService();
    ```

### D. The Routing Layer (`app/api/{featureName}/route.ts`)
*   Exposes endpoints by nesting middleware wrappers:
    1.  **`withResponseWrapper`** (Inner): Standardizes success outputs to `ApiResponse<T>`, injects server-execution `meta`, and translates exceptions to the uniform error shape.
    2.  **`withRateLimit`** (Outer): Controls API traffic, applying custom limits or falling back to defaults.
*   **Rules for Route Handlers**:
    1.  Always wrap the internal body of the route handler with a `try/catch` block to handle exceptions locally.
    2.  If an exception is caught, log it or format it, then **re-throw the error** so that `withResponseWrapper` can catch it and return a standardized JSON response.
*   *Example Dynamic Segment Route (`app/api/agent/[agentId]/route.ts`):*
    ```typescript
    import { NextRequest } from "next/server";
    import { withRateLimit } from "@/middleware/rate-limit.middleware";
    import { withResponseWrapper } from "@/middleware/response-wrapper.middleware";
    import { config } from "@/config";
    import { updateAgentSchema } from "@/lib/agent/validation";
    import { agentService } from "@/lib/agent";

    // Dynamic routes receive params in context object
    export const PUT = withRateLimit(
      withResponseWrapper(async (request: NextRequest, context: { params: Promise<{ agentId: string }> }) => {
        try {
          const { agentId } = await context.params;
          const body = await request.json();
          
          // Zod validation check
          const validation = updateAgentSchema.safeParse(body);
          if (!validation.success) {
            const error = new Error("Validation Failed");
            (error as any).statusCode = 400;
            (error as any).details = validation.error.format();
            throw error; 
          }

          // Return raw data; response wrapper turns this into ApiResponse<AgentResponse>
          return await agentService.updateAgent(agentId, validation.data);
        } catch (error: any) {
          console.error(`Error in PUT /api/agent/${agentId}:`, error);
          
          // Re-throw so withResponseWrapper standardizes it into ApiResponse format
          throw error;
        }
      }),
      config.rateLimits.workflows // Fallback to custom limit or default
    );
    ```

---

## 3. Standard API Response Structure

All endpoints wrapped in `withResponseWrapper` yield a response matching the `ApiResponse<T>` interface:

```typescript
export interface ApiResponse<T> {
  success: boolean;       // true if request processed successfully
  statusCode: number;     // HTTP status code (e.g., 200, 429, 500)
  data?: T;               // Target response payload (e.g., AgentResponse or AgentResponse[])
  pagination?: {          // Pagination details (if list data)
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {                // Performance metrics computed on the server
    startTime: string;
    endTime: string;
    executionTimeMs: number;
  };
  error?: {               // Detail payload (only present on failures)
    message: string;
    statusCode: number;
    statusText: string;
    details?: any;
  };
}
```

---

## 4. Rate Limiting Guidelines

Every API endpoint must configure its traffic thresholds.
*   Read rate limit thresholds from the central `config` object in [config/index.ts](file:///c:/Users/Pawan/Desktop/FullStackProject/agent-builder/config/index.ts).
*   If no custom limits are defined for the endpoint, pass `config.rateLimits.default`:
    ```typescript
    export const GET = withRateLimit(
      withResponseWrapper(async () => {
        return { status: "OK" };
      }),
      config.rateLimits.default
    );
    ```

---

## 5. Configuration & Environment Variables

*   **Never** use `process.env` directly in feature files or routers.
*   Retrieve environment parameters strictly from the central `config` import (`import { config } from "@/config"`):
    *   **Database URL**: `config.db.url`
    *   **JWT Secrets**: `config.jwt.secret`
    *   **Access Token Expiry**: `config.jwt.accessExpiry`
    *   **Site API Base URL**: `config.api.baseUrl`
