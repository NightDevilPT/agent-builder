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
	[key: string]: any;
}

export interface ApiError {
	message: string;
	statusCode: number;
	statusText: string;
	details?: any;
}

export interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	data?: T;
	pagination?: ApiPagination;
	meta?: ApiMeta;
	error?: ApiError;
}
