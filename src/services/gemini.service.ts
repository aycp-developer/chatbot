import { config, } from '../config/index.js';
import type { GeminiResponse, ApiError, } from '../types/index.js';
import type { Message, } from '../types/index.js';

/**
 * Servicio para interactuar con la API de Google Gemini.
 * Maneja la comunicación con el modelo de lenguaje y el formateo de mensajes.
 */
export class GeminiService {
	/** Clave API de Gemini para autenticar las solicitudes. */
	private apiKey: string;
	/** URL base de la API de Gemini. */
	private baseUrl: string;
	/** Nombre del modelo de Gemini a utilizar. */
	private model: string | undefined;

	/**
	 * Inicializa el servicio con la configuración de Gemini.
	 * Carga la API key, la URL base y el modelo desde la configuración.
	 */
	constructor() {
		this.apiKey = config.gemini.apiKey;
		this.baseUrl = config.gemini.baseUrl;
		this.model = config.gemini.model;
	}

	/**
	 * Convierte el formato de mensajes interno al formato requerido por la API de Gemini.
	 * Transforma los roles 'assistant' a 'model' y filtra mensajes de sistema.
	 * 
	 * @param messages - Array de mensajes en formato interno.
	 * @returns Array de contenidos formateados para la API de Gemini.
	 */
	convertToGeminiFormat(messages: Message[],) {
		const contents: { role: string; parts: { text: string }[] }[] = [];

		for (const message of messages) {
			if (message.role == 'system') continue;

			contents.push({
				role: message.role == 'assistant' ? 'model' : 'user',
				parts: [{ text: message.content, },],
			},);
		}

		return contents;
	}

	/**
	 * Envía una solicitud de chat al modelo de Gemini y retorna la respuesta.
	 * Configura los parámetros de generación como temperatura y tokens máximos.
	 * 
	 * @param request - Objeto que contiene los mensajes, temperatura opcional y límite de tokens.
	 * @returns Respuesta formateada en estilo OpenAI con el ID, modelo y choices.
	 * @throws Error si la API de Gemini retorna un código de error.
	 */
	async chat(request: { messages: Message[]; temperature?: number; maxTokens?: number },): Promise<{
		id: string;
		object: string;
		created: number;
		model: string;
		choices: {
			index: number;
			message: Message;
			finishReason: string;
		}[];
		usage?: {
			promptTokens: number;
			completionTokens: number;
			totalTokens: number;
		};
	}> {
		const contents = this.convertToGeminiFormat(request.messages,);

		const body = {
			contents,
			generationConfig: {
				temperature: request.temperature ?? 0.7,
				maxOutputTokens: request.maxTokens ?? 2048,
			},
		};

		const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body,),
		},);

		const data = await response.json();

		if (!response.ok) {
			const error = data as ApiError;
			throw new Error(error.error?.message || 'Gemini API error',);
		}

		const result = data as GeminiResponse;
		const candidate = result.candidates?.[0];
		const text = candidate?.content?.parts?.[0]?.text || '';

		return {
			id: `chatcmpl-${Date.now()}`,
			object: 'chat.completion',
			created: Math.floor(Date.now() / 1000,),
			model: this.model || 'gemini',
			choices: [{
				index: 0,
				message: {
					role: 'assistant',
					content: text,
				},
				finishReason: candidate?.finishReason || 'stop',
			},],
		};
	}
}

export const geminiService = new GeminiService();
