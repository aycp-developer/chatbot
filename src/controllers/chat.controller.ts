import { Request, Response, NextFunction, } from 'express';
import { geminiService, } from '../services/index.js';
import { chatRequestSchema, } from '../types/index.js';
import { ZodError, } from 'zod';

/**
 * Controlador para manejar las solicitudes del chat.
 * Procesa los mensajes del usuario y los envía al servicio de Gemini.
 */
export class ChatController {
	/**
	 * Maneja las solicitudes de chat entrantes.
	 * Valida el cuerpo de la petición, envía los mensajes a Gemini y retorna la respuesta.
	 * 
	 * @param req - Objeto de solicitud de Express que contiene el cuerpo con los mensajes.
	 * @param res - Objeto de respuesta de Express para enviar la respuesta al cliente.
	 * @param next - Función para pasar el control al siguiente middleware en caso de error.
	 * 
	 * @returns Respuesta JSON con los datos de Gemini o error de validación.
	 */
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

/** Instancia única del controlador de chat para usar en las rutas. */
export const chatController = new ChatController();
