import { Router, } from 'express';
import { chatController, } from '../controllers/index.js';

const router = Router();

router.post('/', (req, res, next,) => chatController.chat(req, res, next,),);

export default router;
