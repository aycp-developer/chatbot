import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiService } from '../src/services/gemini.service.js';

vi.mock('../src/config/index.js', () => ({
	config: {
		gemini: {
			apiKey: 'test-api-key',
			baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
			model: 'gemini-1.5-flash',
		},
	},
}));

describe('GeminiService', () => {
	let service: GeminiService;
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		service = new GeminiService();
		fetchSpy = vi.spyOn(global, 'fetch');
	});

	describe('convertToGeminiFormat', () => {
		it('should convert user message correctly', () => {
			const messages = [{ role: 'user', content: 'Hello' }];
			const result = service.convertToGeminiFormat(messages);

			expect(result).toEqual([
				{ role: 'user', parts: [{ text: 'Hello' }] },
			]);
		});

		it('should convert assistant message correctly', () => {
			const messages = [{ role: 'assistant', content: 'Hi there' }];
			const result = service.convertToGeminiFormat(messages);

			expect(result).toEqual([
				{ role: 'model', parts: [{ text: 'Hi there' }] },
			]);
		});

		it('should skip system messages', () => {
			const messages = [
				{ role: 'system', content: 'You are helpful' },
				{ role: 'user', content: 'Hello' },
			];
			const result = service.convertToGeminiFormat(messages);

			expect(result).toEqual([
				{ role: 'user', parts: [{ text: 'Hello' }] },
			]);
		});

		it('should convert multiple messages', () => {
			const messages = [
				{ role: 'user', content: 'Hello' },
				{ role: 'assistant', content: 'Hi' },
				{ role: 'user', content: 'How are you?' },
			];
			const result = service.convertToGeminiFormat(messages);

			expect(result).toEqual([
				{ role: 'user', parts: [{ text: 'Hello' }] },
				{ role: 'model', parts: [{ text: 'Hi' }] },
				{ role: 'user', parts: [{ text: 'How are you?' }] },
			]);
		});
	});

	describe('chat', () => {
		it('should call Gemini API with correct parameters', async () => {
			const mockResponse = {
				candidates: [{
					content: { parts: [{ text: 'Response' }], role: 'model' },
					finishReason: 'STOP',
					index: 0,
				}],
			};

			fetchSpy.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			} as Response);

			const result = await service.chat({
				messages: [{ role: 'user', content: 'Hello' }],
			});

			expect(fetchSpy).toHaveBeenCalledWith(
				'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=test-api-key',
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
						generationConfig: {
							temperature: 0.7,
							maxOutputTokens: 2048,
						},
					}),
				})
			);

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('object', 'chat.completion');
			expect(result.choices[0].message.content).toBe('Response');
			expect(result.choices[0].message.role).toBe('assistant');
		});

		it('should use custom temperature and maxTokens', async () => {
			const mockResponse = {
				candidates: [{
					content: { parts: [{ text: 'Response' }], role: 'model' },
					finishReason: 'STOP',
					index: 0,
				}],
			};

			fetchSpy.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			} as Response);

			await service.chat({
				messages: [{ role: 'user', content: 'Hello' }],
				temperature: 0.5,
				maxTokens: 500,
			});

			expect(fetchSpy).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: JSON.stringify({
						contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
						generationConfig: {
							temperature: 0.5,
							maxOutputTokens: 500,
						},
					}),
				})
			);
		});

		it('should throw error when API call fails', async () => {
			fetchSpy.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({ error: { message: 'API error' } }),
			} as Response);

			await expect(
				service.chat({ messages: [{ role: 'user', content: 'Hello' }] })
			).rejects.toThrow('API error');
		});

		it('should throw generic error when no error message in response', async () => {
			fetchSpy.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve({}),
			} as Response);

			await expect(
				service.chat({ messages: [{ role: 'user', content: 'Hello' }] })
			).rejects.toThrow('Gemini API error');
		});
	});
});
