import { Request, Response, NextFunction, } from 'express';
import { geminiService, } from '../services/index.js';
import { chatRequestSchema, } from '../types/index.js';
import { ZodError, } from 'zod';

export class ChatController {
	async chat(req: Request, res: Response, next: NextFunction,): Promise<void> {
		try {
			console.log('Server received body:', JSON.stringify(req.body, null, 2,),);
			const validatedData = chatRequestSchema.parse(req.body,);

			const response = await geminiService.chat({
				messages: validatedData.messages,
				temperature: validatedData.temperature,
				maxTokens: validatedData.maxTokens,
			},);

			res.json({
				success: true,
				data: response,
			},);
		} catch (error) {
			console.log('Validation error details:', error,);
			if (error instanceof ZodError) {
				res.status(400,).json({
					success: false,
					error: {
						message: 'Validation error',
						details: error.errors,
					},
				},);
				return;
			}
			next(error,);
		}
	}
}

export const chatController = new ChatController();
