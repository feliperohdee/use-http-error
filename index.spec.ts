import { describe, expect, it } from 'vitest';
import HttpError from './index';

HttpError.setIncludeStack(false);

describe('/index', () => {
	it('should create an HttpError with default message', () => {
		const error = new HttpError(404);

		expect(error.status).toEqual(404);
		expect(error.message).toEqual('Not Found');
		expect(error.httpError).toBeTruthy();
	});

	it('should create an HttpError corrent status', () => {
		const error1 = new HttpError(0);
		const error2 = new HttpError(1000);

		expect(error1.status).toEqual(400);
		expect(error1.message).toEqual('Bad Request');
		expect(error1.httpError).toBeTruthy();

		expect(error2.status).toEqual(599);
		expect(error2.message).toEqual('Network Connect Timeout Error');
		expect(error2.httpError).toBeTruthy();
	});

	it('should create an HttpError with custom message', () => {
		const error = new HttpError(400, 'Custom Bad Request');

		expect(error.status).toEqual(400);
		expect(error.message).toEqual('Custom Bad Request');
	});

	it('should create an HttpError with context and headers', () => {
		const error = new HttpError(500, 'Internal Server Error', {
			context: { foo: 'bar' },
			headers: new Headers({ 'edge-foo': 'bar' })
		});

		expect(error.context).toEqual({ foo: 'bar' });
		expect(error.headers.get('edge-foo')).toEqual('bar');
	});

	it('should correctly identify HttpError instances', () => {
		const httpError = new HttpError(500);
		const regularError = new Error('Regular error');

		expect(HttpError.is(httpError)).toBeTruthy();
		expect(HttpError.is(regularError)).toBeFalsy();
	});

	it('should wrap number into HttpErrors', () => {
		const wrappedError = HttpError.wrap(400);

		expect(wrappedError).toBeInstanceOf(HttpError);
		expect(wrappedError.status).toEqual(400);
		expect(wrappedError.message).toEqual('Bad Request');
	});

	it('should wrap string into HttpErrors', () => {
		const wrappedError = HttpError.wrap('Bad Request', 400);

		expect(wrappedError).toBeInstanceOf(HttpError);
		expect(wrappedError.status).toEqual(400);
		expect(wrappedError.message).toEqual('Bad Request');
	});

	it('should wrap empty string into HttpErrors', () => {
		const wrappedError = HttpError.wrap('');

		expect(wrappedError).toBeInstanceOf(HttpError);
		expect(wrappedError.status).toEqual(500);
		expect(wrappedError.message).toEqual('Internal Server Error');
	});

	it('should wrap regular errors into HttpErrors', () => {
		const regularError = new Error('Regular error');
		const wrappedError = HttpError.wrap(regularError, 400);

		expect(wrappedError).toBeInstanceOf(HttpError);
		expect(wrappedError.status).toEqual(400);
		expect(wrappedError.message).toEqual('Regular error');
	});

	it('should convert HttpError to JSON', () => {
		const error = new HttpError(403, 'Forbidden Access', {
			context: { foo: 'bar' },
			headers: new Headers({ 'edge-foo': 'bar' })
		});

		expect(error.toJson()).toEqual({
			context: { foo: 'bar' },
			message: 'Forbidden Access',
			stack: [],
			status: 403
		});
	});

	it('should create HttpError from JSON', () => {
		const json = {
			context: { foo: 'bar' },
			message: 'Unauthorized Access',
			stack: [],
			status: 401
		};

		const error = HttpError.fromJson(json);

		expect(error).toBeInstanceOf(HttpError);
		expect(error.context).toEqual({ foo: 'bar' });
		expect(error.status).toEqual(401);
		expect(error.message).toEqual('Unauthorized Access');
	});

	it('should convert HttpError to Response', async () => {
		const error = new HttpError(500, 'Internal Server Error', {
			context: { foo: 'bar' },
			headers: new Headers({ 'edge-foo': 'bar' })
		});

		const res = error.toResponse();

		expect(res).toBeInstanceOf(Response);
		expect(await res.json()).toEqual({
			context: { foo: 'bar' },
			message: 'Internal Server Error',
			stack: [],
			status: 500
		});
		expect(res.headers).toEqual(
			new Headers({
				'content-type': 'application/json',
				'edge-foo': 'bar'
			})
		);
		expect(res.status).toEqual(500);
	});

	it('should convert HttpError to string', () => {
		const error = new HttpError(404, 'Not Found');

		expect(error.toString()).toEqual('404 - Not Found');
	});

	it('should create HttpError with defaultContext', () => {
		HttpError.setDefaultContext({ env: 'test' });
		const error = new HttpError(500);

		expect(error.context).toEqual({ env: 'test' });

		// Clean up
		HttpError.setDefaultContext(null);
	});

	it('should merge defaultContext with provided context', () => {
		HttpError.setDefaultContext({ env: 'test', version: '1.0.0' });
		const error = new HttpError(500, 'Error', {
			context: { requestId: '123', env: 'prod' }
		});

		expect(error.context).toEqual({
			env: 'prod', // overridden value
			version: '1.0.0', // from defaultContext
			requestId: '123' // from provided context
		});

		// Clean up
		HttpError.setDefaultContext(null);
	});

	it('should handle null defaultContext', () => {
		HttpError.setDefaultContext(null);
		const error = new HttpError(500, 'Error', {
			context: { requestId: '123' }
		});

		expect(error.context).toEqual({ requestId: '123' });
	});

	it('should set context to HttpError', () => {
		const error = new HttpError(500, 'Error', {
			context: { requestId: '123' }
		});

		expect(error.context).toEqual({ requestId: '123' });
		error.setContext({ env: 'prod' });
		expect(error.context).toEqual({ requestId: '123', env: 'prod' });
	});
});
