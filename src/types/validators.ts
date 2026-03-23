import { z, } from 'zod';

/**
 * Esquema de validación para un mensaje individual.
 * Define la estructura que debe tener cada mensaje en una conversación.
 */
const messageSchema = z.object({
	/** Rol del mensaje: system, user o assistant. */
	role: z.enum(['system', 'user', 'assistant',],),
	/** Contenido textual del mensaje. Debe tener al menos 1 carácter. */
	content: z.string().min(1,),
},);

/**
 * Esquema de validación para las solicitudes de chat.
 * Valida el cuerpo de la petición que llega al endpoint de chat.
 */
export const chatRequestSchema = z.object({
	/** Array de mensajes que conforman la conversación. Debe tener al menos 1 mensaje. */
	messages: z.array(messageSchema,).min(1,),
	/** Temperatura para la generación (0-2). Opcional, por defecto 0.7. */
	temperature: z.number().min(0,).max(2,).optional(),
	/** Límite máximo de tokens en la respuesta (1-4096). Opcional. */
	maxTokens: z.number().min(1,).max(4096,).optional(),
},);

/** Tipo inferido del esquema de chatRequestSchema. */
export type ValidatedChatRequest = z.infer<typeof chatRequestSchema>;
