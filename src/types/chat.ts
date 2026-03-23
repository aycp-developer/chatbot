export interface Message {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface ChatRequest {
	messages: Message[];
	temperature?: number;
	maxTokens?: number;
}

export interface ChatResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Choice[];
	usage?: Usage;
}

export interface Choice {
	index: number;
	message: Message;
	finishReason: string;
}

export interface Usage {
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
}

export interface ApiError {
	error?: {
		message: string;
		type?: string;
		code?: string;
	};
}

export interface GeminiResponse {
	candidates?: {
		content: {
			parts: { text: string }[];
			role: string;
		};
		finishReason: string;
		index: number;
		safetyRatings?: unknown[];
	}[];
	promptFeedback?: {
		safetyRatings?: unknown[];
		blockReason?: string;
	};
}
