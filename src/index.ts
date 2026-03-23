import express from 'express';
import cors from 'cors';
import { config, } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, } from './middleware/index.js';

const app = express();

app.use(cors(),);
app.use(express.json(),);

app.use('/api', routes,);

app.use(errorHandler,);

app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`,);
	console.log(`Environment: ${config.nodeEnv}`,);
},);

export default app;
