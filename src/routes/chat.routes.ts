import { Router, } from 'express';
import { chatController, } from '../controllers/index.js';

/**
 * Router para las rutas relacionadas con el chat.
 * Define los endpoints disponibles para interactuar con el chatbot.
 */
const router = Router();

/**
 * Endpoint POST /chat
 * Recibe mensajes del usuario y retorna la respuesta del modelo Gemini.
 * Delega la lógica al método 'chat' del ChatController.
 */
router.post('/', (req, res, next,) => chatController.chat(req, res, next,),);

export default router;
