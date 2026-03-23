import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: parseInt(process.env.PORT || '3000', 10,),
	nodeEnv: process.env.NODE_ENV || 'development',
	gemini: {
		apiKey: process.env.GEMINI_API_KEY || '',
		baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
		model: 'gemini-3-flash-preview',
	},
}
