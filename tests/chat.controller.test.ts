import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import express from 'express';
import { chatController } from '../src/controllers/chat.controller.js';
import { errorHandler } from '../src/middleware/error.middleware.js';

vi.mock('../src/services/gemini.service.js', () => ({
	geminiService: {
		chat: vi.fn(),
	},
}));

vi.mock('../src/config/index.js', () => ({
	config: {
		nodeEnv: 'test',
	},
}));

import { geminiService } from '../src/services/gemini.service.js';

describe('ChatController', () => {
	let app: Express;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.post('/api/chat', (req, res, next) => chatController.chat(req, res, next));
		app.use(errorHandler);
		vi.clearAllMocks();
	});

	describe('POST /api/chat', () => {
		const validRequest = {
			messages: [{ role: 'user', content: 'Hello' }],
		};

		it('should return 200 with successful response', async () => {
			const mockResponse = {
				id: 'chatcmpl-123',
				object: 'chat.completion',
				created: 1234567890,
				model: 'gemini',
				choices: [{
					index: 0,
					message: { role: 'assistant', content: 'Hi there!' },
					finishReason: 'stop',
				}],
			};

			vi.mocked(geminiService.chat).mockResolvedValueOnce(mockResponse);

			const response = await request(app)
				.post('/api/chat')
				.send(validRequest)
				.expect(200);

			expect(response.body).toEqual({
				success: true,
				data: mockResponse,
			});
		});

		it('should return 400 for validation error - missing messages', async () => {
			const response = await request(app)
				.post('/api/chat')
				.send({})
				.expect(400);

			expect(response.body).toEqual({
				success: false,
				error: {
					message: 'Validation error',
					details: expect.any(Array),
				},
			});
		});

		it('should return 400 for validation error - invalid role', async () => {
			const response = await request(app)
				.post('/api/chat')
				.send({
					messages: [{ role: 'invalid', content: 'Hello' }],
				})
				.expect(400);

			expect(response.body.success).toBe(false);
			expect(response.body.error.message).toBe('Validation error');
		});

		it('should return 400 for validation error - empty content', async () => {
			const response = await request(app)
				.post('/api/chat')
				.send({
					messages: [{ role: 'user', content: '' }],
				})
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it('should return 400 for validation error - empty messages array', async () => {
			const response = await request(app)
				.post('/api/chat')
				.send({ messages: [] })
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it('should accept request with optional temperature', async () => {
			const mockResponse = {
				id: 'chatcmpl-123',
				object: 'chat.completion',
				created: 1234567890,
				model: 'gemini',
				choices: [],
			};
			vi.mocked(geminiService.chat).mockResolvedValueOnce(mockResponse);

			await request(app)
				.post('/api/chat')
				.send({
					messages: [{ role: 'user', content: 'Hello' }],
					temperature: 0.5,
				})
				.expect(200);

			expect(geminiService.chat).toHaveBeenCalledWith({
				messages: [{ role: 'user', content: 'Hello' }],
				temperature: 0.5,
				maxTokens: undefined,
			});
		});

		it('should accept request with optional maxTokens', async () => {
			const mockResponse = {
				id: 'chatcmpl-123',
				object: 'chat.completion',
				created: 1234567890,
				model: 'gemini',
				choices: [],
			};
			vi.mocked(geminiService.chat).mockResolvedValueOnce(mockResponse);

			await request(app)
				.post('/api/chat')
				.send({
					messages: [{ role: 'user', content: 'Hello' }],
					maxTokens: 1000,
				})
				.expect(200);

			expect(geminiService.chat).toHaveBeenCalledWith({
				messages: [{ role: 'user', content: 'Hello' }],
				temperature: undefined,
				maxTokens: 1000,
			});
		});

		it('should return 500 when service throws error', async () => {
			vi.mocked(geminiService.chat).mockRejectedValueOnce(new Error('Service error'));

			const response = await request(app)
				.post('/api/chat')
				.send(validRequest)
				.expect(500);

			expect(response.body).toEqual({
				success: false,
				error: {
					message: 'Service error',
				},
			});
		});
	});
});
