import { NextRequest, NextResponse } from "next/server";
import { jwtService, TokenPayload } from "@/lib/auth/jwt.service";
import { ApiErrorCode, ApiErrorRegistry, ApiResponse } from "@/lib/api-service/api.types";

export interface AuthContext {
  user: TokenPayload;
  [key: string]: unknown;
}

export type AuthenticatedHandler<T> = (
  request: NextRequest,
  context: AuthContext
) => Promise<T | ApiResponse<T> | Response> | T | ApiResponse<T> | Response;

/**
 * Higher-order middleware function to authenticate requests using cookies.
 * Automatically handles token expiration and cookie renewal.
 * 
 * @param handler The downstream API route handler.
 */
export function withAuth<T>(handler: AuthenticatedHandler<T>) {
  return async (request: NextRequest, context: unknown): Promise<Response> => {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const unauthorizedResponse = (): Response => {
      const errorBody: ApiResponse<null> = {
        success: false,
        statusCode: ApiErrorRegistry[ApiErrorCode.UNAUTHORIZED].statusCode,
        error: {
          message: ApiErrorRegistry[ApiErrorCode.UNAUTHORIZED].messageKey,
          statusCode: ApiErrorRegistry[ApiErrorCode.UNAUTHORIZED].statusCode,
          statusText: ApiErrorRegistry[ApiErrorCode.UNAUTHORIZED].statusText,
        },
      };
      return NextResponse.json(errorBody, {
        status: ApiErrorRegistry[ApiErrorCode.UNAUTHORIZED].statusCode,
      });
    };

    if (!accessToken && !refreshToken) {
      return unauthorizedResponse();
    }

    let payload: TokenPayload | null = null;

    // 1. Try to validate access token
    if (accessToken) {
      try {
        payload = jwtService.verifyAccessToken(accessToken);
      } catch (err: unknown) {
        // Access token is invalid or expired
        payload = null;
      }
    }

    // 2. If access token validation succeeded, pass through with context user payload
    if (payload) {
      const authContext: AuthContext = {
        ...((context as Record<string, unknown>) || {}),
        user: payload,
      };

      const result = await handler(request, authContext);
      return result instanceof Response ? result : NextResponse.json(result);
    }

    // 3. If access token expired but refresh token is present, validate refresh token
    if (refreshToken) {
      try {
        const refreshPayload = jwtService.verifyRefreshToken(refreshToken);

        // Valid refresh token -> regenerate both access and refresh tokens
        const cleanPayload: TokenPayload = {
          userId: refreshPayload.userId,
          email: refreshPayload.email,
        };

        const newTokens = jwtService.generateTokens(cleanPayload);

        // Inject user context and execute handler
        const authContext: AuthContext = {
          ...((context as Record<string, unknown>) || {}),
          user: cleanPayload,
        };

        const result = await handler(request, authContext);

        const nextResponse = (result instanceof Response 
          ? result 
          : NextResponse.json(result)) as NextResponse;

        // Set regenerated access and refresh token cookies
        const isProduction = process.env.NODE_ENV === "production";
        
        nextResponse.cookies.set("accessToken", newTokens.accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          path: "/",
        });

        nextResponse.cookies.set("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          path: "/",
        });

        return nextResponse;
      } catch (err: unknown) {
        // Both tokens are invalid or expired
        return unauthorizedResponse();
      }
    }

    return unauthorizedResponse();
  };
}
