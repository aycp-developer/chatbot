import dotenv from 'dotenv';

/**
 * Carga las variables de entorno desde el archivo .env.
 * Debe llamarse al inicio antes de usar cualquier variable de entorno.
 */
dotenv.config();

/**
 * Configuración global de la aplicación.
 * Carga las variables de entorno y define los valores por defecto.
 */
export const config = {
	/** Puerto del servidor HTTP. Por defecto 3000. */
	port: parseInt(process.env.PORT || '3000', 10,),
	/** Entorno de ejecución (development, production, etc). */
	nodeEnv: process.env.NODE_ENV || 'development',
	/** Configuración de la API de Gemini. */
	gemini: {
		/** Clave API de Gemini. */
		apiKey: process.env.GEMINI_API_KEY || '',
		/** URL base de la API de Gemini. */
		baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
		/** Modelo de Gemini a utilizar. */
		model: 'gemini-3-flash-preview',
	},
}
