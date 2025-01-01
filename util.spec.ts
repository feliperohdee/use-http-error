import { describe, expect, it } from 'vitest';

import util from './util.js';

describe('/util', () => {
	describe('toNumber', () => {
		it('should convert a valid number string to a number', () => {
			expect(util.toNumber('123')).toEqual(123);
			expect(util.toNumber('-45.67')).toEqual(-45.67);
		});

		it('should return the default value for null input', () => {
			expect(util.toNumber(null)).toEqual(0);
			expect(util.toNumber(null, 10)).toEqual(10);
		});

		it('should return the default value for invalid number strings', () => {
			expect(util.toNumber('abc')).toEqual(0);
			expect(util.toNumber('123abc', 5)).toEqual(5);
		});

		it('should handle zero and negative zero', () => {
			expect(util.toNumber('0')).toEqual(0);
			expect(util.toNumber('-0')).toEqual(-0);
		});

		it('should handle very large and very small numbers', () => {
			expect(util.toNumber('1e100')).toEqual(1e100);
			expect(util.toNumber('1e-100')).toEqual(1e-100);
		});
	});
});
