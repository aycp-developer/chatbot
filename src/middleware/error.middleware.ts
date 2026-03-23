import { Request, Response, NextFunction, } from 'express';
import { config, } from '../config/index.js';

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
