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

export enum ApiErrorCode {
  VALIDATION_FAILED = "VALIDATION_FAILED",
  EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED",
  USERNAME_ALREADY_TAKEN = "USERNAME_ALREADY_TAKEN",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}

export interface ApiErrorDetail {
  statusCode: number;
  statusText: string;
  messageKey: string;
}

export const ApiErrorRegistry: Record<ApiErrorCode, ApiErrorDetail> = {
  [ApiErrorCode.VALIDATION_FAILED]: {
    statusCode: 400,
    statusText: "Bad Request",
    messageKey: "errors.validation_failed"
  },
  [ApiErrorCode.EMAIL_ALREADY_REGISTERED]: {
    statusCode: 400,
    statusText: "Bad Request",
    messageKey: "errors.email_already_registered"
  },
  [ApiErrorCode.USERNAME_ALREADY_TAKEN]: {
    statusCode: 400,
    statusText: "Bad Request",
    messageKey: "errors.username_already_taken"
  },
  [ApiErrorCode.USER_NOT_FOUND]: {
    statusCode: 404,
    statusText: "Not Found",
    messageKey: "errors.user_not_found"
  },
  [ApiErrorCode.UNAUTHORIZED]: {
    statusCode: 401,
    statusText: "Unauthorized",
    messageKey: "errors.unauthorized"
  },
  [ApiErrorCode.INTERNAL_ERROR]: {
    statusCode: 500,
    statusText: "Internal Server Error",
    messageKey: "errors.internal_error"
  },
  [ApiErrorCode.BAD_REQUEST]: {
    statusCode: 400,
    statusText: "Bad Request",
    messageKey: "errors.bad_request"
  },
  [ApiErrorCode.NOT_FOUND]: {
    statusCode: 404,
    statusText: "Not Found",
    messageKey: "errors.not_found"
  },
  [ApiErrorCode.RATE_LIMIT_EXCEEDED]: {
    statusCode: 429,
    statusText: "Too Many Requests",
    messageKey: "errors.rate_limit_exceeded"
  }
};
