import { describe, it, expect } from 'vitest';
import { chatRequestSchema } from '../src/types/validators.js';

describe('Validators', () => {
	describe('chatRequestSchema', () => {
		it('should validate a valid chat request with messages', () => {
			const request = {
				messages: [{ role: 'user', content: 'Hello' }],
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(true);
		});

		it('should validate a chat request with optional fields', () => {
			const request = {
				messages: [{ role: 'user', content: 'Hello' }],
				temperature: 0.5,
				maxTokens: 1000,
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(true);
		});

		it('should validate a valid user message', () => {
			const request = {
				messages: [{ role: 'user', content: 'Hello' }],
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(true);
		});

		it('should validate a valid system message', () => {
			const request = {
				messages: [{ role: 'system', content: 'You are a helpful assistant' }],
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(true);
		});

		it('should validate a valid assistant message', () => {
			const request = {
				messages: [{ role: 'assistant', content: 'I can help you' }],
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(true);
		});

		it('should reject invalid role', () => {
			const request = {
				messages: [{ role: 'invalid', content: 'Hello' }],
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject empty content', () => {
			const request = {
				messages: [{ role: 'user', content: '' }],
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject missing content', () => {
			const request = {
				messages: [{ role: 'user' }],
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject empty messages array', () => {
			const request = { messages: [] };
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject missing messages', () => {
			const request = {};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject temperature out of range (negative)', () => {
			const request = {
				messages: [{ role: 'user', content: 'Hello' }],
				temperature: -1,
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject temperature out of range (over 2)', () => {
			const request = {
				messages: [{ role: 'user', content: 'Hello' }],
				temperature: 3,
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject maxTokens out of range (0)', () => {
			const request = {
				messages: [{ role: 'user', content: 'Hello' }],
				maxTokens: 0,
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});

		it('should reject maxTokens out of range (over 4096)', () => {
			const request = {
				messages: [{ role: 'user', content: 'Hello' }],
				maxTokens: 5000,
			};
			const result = chatRequestSchema.safeParse(request);
			expect(result.success).toBe(false);
		});
	});
});
