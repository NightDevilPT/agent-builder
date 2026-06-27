import { NextRequest } from "next/server";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { withResponseWrapper } from "@/middleware/response-wrapper.middleware";
import { config } from "@/config";
import { createUserSchema } from "@/lib/user/validation";
import { userService } from "@/lib/user";
import { UserResponse } from "@/lib/user/types";
import { ApiResponse, ApiErrorCode, ApiErrorRegistry } from "@/lib/api-service/api.types";

export const POST = withRateLimit(
  withResponseWrapper(async (request: NextRequest): Promise<ApiResponse<UserResponse>> => {
    try {
      const body = await request.json();

      const validation = createUserSchema.safeParse(body);
      if (!validation.success) {
        return {
          success: false,
          statusCode: ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].statusCode,
          error: {
            message: ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].messageKey,
            statusCode: ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].statusCode,
            statusText: ApiErrorRegistry[ApiErrorCode.VALIDATION_FAILED].statusText,
            details: validation.error.format(),
          },
        };
      }

      const result = await userService.createUser(validation.data);
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
      console.error("Error in POST /api/user:", error);
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
  }),
  config.rateLimits.default
);
