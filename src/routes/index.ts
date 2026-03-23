import { Router, } from 'express';
import chatRoutes from './chat.routes.js';

const router = Router();

router.use('/chat', chatRoutes,);

router.get('/health', (req, res,) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString(), },);
},);

export default router;
