import { Request, Response, NextFunction, } from 'express';
import { config, } from '../config/index.js';

/**
 * Middleware global para manejo de errores.
 * Captura cualquier error thrown en la aplicación y retorna una respuesta JSON estructurada.
 * 
 * @param err - Objeto de error capturado durante la ejecución.
 * @param req - Objeto de solicitud de Express con información de la petición.
 * @param res - Objeto de respuesta para enviar el error al cliente.
 * @param _next - Función next de Express (requerida por la firma de errores).
 * 
 * @returns Respuesta JSON con el mensaje de error y código de estado 500.
 */
export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
): void {
	console.error(`[Error] ${err.message}`,);

	if (config.nodeEnv == 'development') {
		console.error(err.stack,);
	}

	res.status(500,).json({
		success: false,
		error: {
			message: err.message || 'Internal server error',
		},
	},);
}
