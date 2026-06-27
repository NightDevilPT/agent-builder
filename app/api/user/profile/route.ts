import { NextRequest } from "next/server";
import { withRateLimit } from "@/middleware/rate-limit.middleware";
import { withResponseWrapper } from "@/middleware/response-wrapper.middleware";
import { withAuth } from "@/middleware/auth.middleware";
import { config } from "@/config";
import { userService } from "@/lib/user";
import { updateUserSchema } from "@/lib/user/validation";
import { UserResponse } from "@/lib/user/types";
import { ApiResponse, ApiErrorCode, ApiErrorRegistry } from "@/lib/api-service/api.types";

export const GET = withRateLimit(
  withAuth(
    withResponseWrapper(async (request: NextRequest, context: any): Promise<ApiResponse<UserResponse>> => {
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
          statusCode: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusCode,
          error: {
            message: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].messageKey,
            statusCode: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusCode,
            statusText: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusText,
            details: message ? { error: message } : null,
          },
        };
      }
    })
  ),
  config.rateLimits.default
);

export const PUT = withRateLimit(
  withAuth(
    withResponseWrapper(async (request: NextRequest, context: any): Promise<ApiResponse<UserResponse>> => {
      try {
        const userId = context.user.userId;
        const body = await request.json();
        const validation = updateUserSchema.safeParse(body);
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

        const result = await userService.updateUser(userId, validation.data);
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
          statusCode: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusCode,
          error: {
            message: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].messageKey,
            statusCode: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusCode,
            statusText: ApiErrorRegistry[ApiErrorCode.INTERNAL_ERROR].statusText,
            details: message ? { error: message } : null,
          },
        };
      }
    })
  ),
  config.rateLimits.default
);
