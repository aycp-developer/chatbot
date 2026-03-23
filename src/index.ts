import express from 'express';
import cors from 'cors';
import { config, } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, } from './middleware/index.js';

/**
 * Instancia principal de la aplicación Express.
 * Configura el servidor con middleware y rutas.
 */
const app = express();

/**
 * Middleware para habilitar CORS (Cross-Origin Resource Sharing).
 * Permite solicitudes desde diferentes orígenes.
 */
app.use(cors(),);

/**
 * Middleware para analizar cuerpos de solicitud en formato JSON.
 * Habilita el parsing de JSON en las peticiones entrantes.
 */
app.use(express.json(),);

/**
 * Monta las rutas de la API bajo el prefijo '/api'.
 * Todas las rutas definidas estarán disponibles en /api/ruta.
 */
app.use('/api', routes,);

/**
 * Middleware global para manejo de errores.
 * Captura y procesa todos los errores no manejados.
 */
app.use(errorHandler,);

/**
 * Inicia el servidor HTTP en el puerto configurado.
 * Imprime en consola el puerto y el entorno de ejecución.
 */
app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`,);
	console.log(`Environment: ${config.nodeEnv}`,);
},);

export default app;
