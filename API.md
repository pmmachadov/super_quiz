# 📡 API Documentation

Documentación de la API RESTful de Super Quiz.

**Base URL:** `http://localhost:3000` (desarrollo)

---

## 🏥 Health Check

### GET `/health`
Verifica que el servidor esté funcionando.

**Response:**
```json
{
  "status": "ok"
}
```

---

## 🎯 Quizzes

### GET `/api/quizzes`
Obtiene todos los quizzes disponibles.

**Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Basic Programming",
    "description": "Conceptos fundamentales de programación",
    "category": "tecnologia",
    "difficulty": "easy",
    "timeLimit": 300,
    "questions": [
      {
        "question": "¿Qué es una variable?",
        "options": ["Un valor constante", "Un contenedor de datos", ...],
        "correctAnswer": 1
      }
    ]
  }
]
```

**Nota:** El campo `correctAnswer` se excluye en el listado por seguridad.

---

### GET `/api/quizzes/:id`
Obtiene un quiz específico por ID.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | string | MongoDB ObjectId del quiz |

**Response:**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Basic Programming",
  "description": "Conceptos fundamentales de programación",
  "category": "tecnologia",
  "difficulty": "easy",
  "timeLimit": 300,
  "questions": [...]
}
```

**Error Responses:**
- `400` - ID inválido
- `404` - Quiz no encontrado
- `500` - Error del servidor

---

### POST `/api/quizzes`
Crea un nuevo quiz.

**Request Body:**
```json
{
  "title": "Mi Nuevo Quiz",
  "description": "Descripción del quiz",
  "category": "tecnologia",
  "difficulty": "medium",
  "timeLimit": 600,
  "questions": [
    {
      "question": "¿Pregunta 1?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": 0
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Mi Nuevo Quiz",
  ...
}
```

**Error Responses:**
- `400` - Datos inválidos (ValidationError)
- `500` - Error del servidor

---

### PUT `/api/quizzes/:id`
Actualiza un quiz existente.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | string | MongoDB ObjectId del quiz |

**Request Body:** Mismo formato que POST

**Response:** `200 OK`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Quiz Actualizado",
  ...
}
```

**Error Responses:**
- `400` - ID inválido o datos de validación
- `404` - Quiz no encontrado
- `500` - Error del servidor

---

### DELETE `/api/quizzes/:id`
Elimina un quiz.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | string | MongoDB ObjectId del quiz |

**Response:** `200 OK`
```json
{
  "message": "Quiz eliminado correctamente"
}
```

**Error Responses:**
- `400` - ID inválido
- `404` - Quiz no encontrado
- `500` - Error del servidor

---

## 📊 Game Results

### POST `/api/game-results`
Guarda los resultados de una partida.

**Request Body:**
```json
{
  "quizId": 1,
  "score": 8,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "questionResults": [
    {
      "questionId": "quiz-0",
      "questionText": "¿Qué es...?",
      "selectedAnswer": 1,
      "correctAnswer": 1,
      "isCorrect": true,
      "responseTime": 15
    }
  ]
}
```

**Response:** `201 Created`

---

## 🔢 Modelos

### Quiz Schema
```javascript
{
  title: String (required),
  description: String,
  category: String (enum: ['tecnologia', 'ciencia', 'historia', 'geografia', 'entretenimiento', 'general']),
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  timeLimit: Number (segundos),
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }]
}
```

---

## 🧪 Testing con cURL

```bash
# Health check
curl http://localhost:3000/health

# Obtener todos los quizzes
curl http://localhost:3000/api/quizzes

# Obtener un quiz específico
curl http://localhost:3000/api/quizzes/64a1b2c3d4e5f6g7h8i9j0k1

# Crear un nuevo quiz
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Quiz",
    "description": "Quiz de prueba",
    "category": "general",
    "difficulty": "easy",
    "timeLimit": 60,
    "questions": [{
      "question": "¿2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    }]
  }'
```

---

## 📚 Recursos

- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB CRUD Operations](https://docs.mongodb.com/manual/crud/)
