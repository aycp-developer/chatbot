import { Router, } from 'express';
import chatRoutes from './chat.routes.js';

/**
 * Router principal que agrupa todas las rutas de la API.
 * Monta los sub-routers bajo prefijos específicos.
 */
const router = Router();

/**
 * Monta las rutas de chat bajo el prefijo /chat.
 * Acceso: POST /api/chat
 */
router.use('/chat', chatRoutes,);

/**
 * Endpoint GET /health
 * Retorna el estado del servidor y la marca de tiempo actual.
 * Útil para verificar que la API está funcionando correctamente.
 */
router.get('/health', (req, res,) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString(), },);
},);

export default router;
