# ChatBot Server

API REST para chatbot con integración de Google Gemini.

## Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Lenguaje tipado
- **Zod** - Validación de esquemas
- **Google Gemini API** - Modelo de lenguaje

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Agrega tu API key de Google Gemini en el archivo `.env`:
```
GEMINI_API_KEY=tu_api_key_aqui
```

### Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `GEMINI_API_KEY` | Clave API de Gemini | (requerido) |

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Endpoints

### POST /api/chat
Envía un mensaje al chatbot.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hola, ¿cómo estás?" }
  ],
  "temperature": 0.7,
  "maxTokens": 2048
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chatcmpl-...",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "gemini",
    "choices": [{
      "index": 0,
      "message": { "role": "assistant", "content": "¡Hola! Estoy bien..." },
      "finishReason": "stop"
    }]
  }
}
```

### GET /api/health
Verifica que el servidor está funcionando.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Estructura del Proyecto

```
src/
├── config/         # Configuración de variables de entorno
├── controllers/    # Controladores de rutas
├── middleware/     # Middleware de Express
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
├── types/          # Tipos TypeScript
└── index.ts        # Punto de entrada
```