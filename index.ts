import errorStackParser, { ErrorStackParser } from './error-stack-parser.js';

namespace HttpError {
	export type Context = Record<string, any> | null;
	export type Json = {
		context: Context;
		message: string;
		stack: ErrorStackParser.StackFrame[];
		status: number;
	};
}

const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};

class HttpError extends Error {
	public static includeStack: boolean = true;

	public context?: HttpError.Context | null = null;
	public headers: Headers;
	public httpError: boolean;
	public status: number;

	static fromJson(obj: Partial<HttpError.Json>): HttpError {
		const error = new HttpError(obj?.status || 500, obj?.message || 'HttpError', {
			context: obj?.context
		});

		if (obj.stack && obj.stack.length > 0) {
			error.stack = obj.stack
				.map(frame => {
					return `    at ${frame.functionName} (${frame.fileName}:${frame.lineNumber}:${frame.columnNumber})`;
				})
				.join('\n');
		}

		return error;
	}

	static is(error: Error | HttpError): error is HttpError {
		return 'httpError' in error && error.httpError === true;
	}

	static json(errorOrStatus: Error | HttpError | number | string, status: number = 500): HttpError.Json {
		return HttpError.wrap(errorOrStatus, status).toJson();
	}

	static response(errorOrStatus: Error | HttpError | number | string, status: number = 500): Response {
		return HttpError.wrap(errorOrStatus, status).toResponse();
	}

	static string(errorOrStatus: Error | HttpError | number | string, status: number = 500): string {
		return HttpError.wrap(errorOrStatus, status).toString();
	}

	static wrap(errorOrStatus: Error | HttpError | number | string, status: number = 500): HttpError {
		if (typeof errorOrStatus === 'number') {
			return new HttpError(errorOrStatus);
		}

		if (typeof errorOrStatus === 'string') {
			return new HttpError(status, errorOrStatus);
		}

		if (HttpError.is(errorOrStatus)) {
			return errorOrStatus;
		}

		const httpError = new HttpError(status, errorOrStatus.message);
		httpError.stack = errorOrStatus.stack;

		return httpError;
	}

	private static getDefaultMessage(status: number): string {
		switch (status) {
			case 400:
				return 'Bad Request';
			case 401:
				return 'Unauthorized';
			case 403:
				return 'Forbidden';
			case 404:
				return 'Not Found';
			case 409:
				return 'Conflict';
			case 410:
				return 'Gone';
			case 500:
				return 'Internal Server Error';
			case 599:
				return 'Network Connect Timeout Error';
			default:
				return 'Error';
		}
	}

	constructor(
		status: number,
		message?: string,
		opts?: {
			context?: HttpError.Context;
			headers?: Headers;
		}
	) {
		status = clamp(status, 400, 599);
		super(message || HttpError.getDefaultMessage(status));

		this.context = opts?.context;
		this.headers = opts?.headers || new Headers();
		this.httpError = true;
		this.status = status;
		this.name = 'HttpError';
	}

	toJson(): HttpError.Json {
		return {
			context: this.context || null,
			message: this.message,
			stack: HttpError.includeStack ? errorStackParser(this) : [],
			status: this.status
		};
	}

	toResponse(): Response {
		return Response.json(this.toJson(), {
			headers: this.headers,
			status: this.status
		});
	}

	toString(): string {
		return `${this.status} - ${this.message}`;
	}
}

export default HttpError;
