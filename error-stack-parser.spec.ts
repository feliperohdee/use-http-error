import { describe, expect, it } from 'vitest';

import parseErrorStack from './error-stack-parser.js';

describe('/error-stack-parser', () => {
	it('should parse', () => {
		const error = new Error();
		const result = parseErrorStack(error);

		expect(result).toBeInstanceOf(Array);
	});

	it('should parse empty', () => {
		const result = parseErrorStack({} as Error);

		expect(result).toBeInstanceOf(Array);
	});
});
