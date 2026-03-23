import { z, } from 'zod';

const messageSchema = z.object({
	role: z.enum(['system', 'user', 'assistant',],),
	content: z.string().min(1,),
},);

export const chatRequestSchema = z.object({
	messages: z.array(messageSchema,).min(1,),
	temperature: z.number().min(0,).max(2,).optional(),
	maxTokens: z.number().min(1,).max(4096,).optional(),
},);

export type ValidatedChatRequest = z.infer<typeof chatRequestSchema>;
