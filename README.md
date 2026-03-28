# 🎮 Super Quiz

[![Vercel](https://img.shields.io/badge/Vercel-deployed-success?style=flat&logo=vercel)](https://my-s-q.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Aplicación web full-stack de cuestionarios interactivos con sistema de repaso espaciado (Spaced Repetition) para aprendizaje eficiente.**

🔗 **Demo en vivo:** [https://my-s-q.vercel.app](https://my-s-q.vercel.app)

![Super Quiz Screenshot](./screenshot.png)

---

## ✨ Características

### 🎯 Cuestionarios Interactivos
- **Múltiples categorías**: Tecnología, Ciencia, Historia, Geografía, Entretenimiento
- **Sistema de puntuación**: Seguimiento de puntajes y porcentajes de acierto
- **Temporizador**: Límite de tiempo configurable por pregunta
- **Resultados detallados**: Retroalimentación inmediata con explicaciones

### 🧠 Sistema de Repaso Espaciado (Spaced Repetition)
- Implementación del **algoritmo SM-2** para memorización óptima
- **219 flashcards** organizadas en 14 decks temáticos (Full Stack Open)
- **Calificación de dificultad** (0-5) para ajustar intervalos de repaso
- Seguimiento de progreso por deck y tarjetas individuales
- Modos de estudio: *Nuevas*, *Revisión*, *Mixto*

### 📊 Panel de Analytics
- Historial completo de partidas jugadas
- Análisis de rendimiento por pregunta
- Estadísticas de precisión y tiempo de respuesta
- Exportación de resultados

### ⚙️ Funcionalidades Adicionales
- Creación de cuestionarios personalizados
- Interfaz responsive (móvil/desktop)
- Tema claro/oscuro
- Persistencia de datos en JSON (sin base de datos requerida)

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 19.0 | Biblioteca UI con hooks y functional components |
| **React Router** | 7.5 | Enrutamiento SPA con HashRouter para GitHub Pages |
| **Vite** | 6.2 | Build tool ultrarrápido con HMR |
| **Material UI** | 7.0 | Componentes de interfaz estilizados |
| **Highlight.js** | 11.11 | Syntax highlighting para código en flashcards |

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 5.1 | Framework web para APIs REST |
| **Vercel Serverless** | - | Funciones serverless para deploy sin servidor |

### DevOps & Deploy
- **Vercel**: Hosting frontend + serverless functions
- **GitHub Actions**: CI/CD para deploy automático
- **GitHub Pages**: Alternativa de hosting estático

---

## 🏗️ Arquitectura

```
super_quiz/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── analytics/    # Dashboard de estadísticas
│   │   │   ├── spaced-repetition/  # Sistema SM-2
│   │   │   └── *.jsx         # Componentes principales
│   │   ├── utils/            # Helpers y config API
│   │   └── App.jsx           # Router y layout
│   └── package.json
├── api/                      # Vercel Serverless Functions
│   ├── quizzes.js            # CRUD de cuestionarios
│   ├── spaced-repetition/    # Endpoints SM-2
│   └── analytics.js          # Estadísticas de juego
├── backend/                  # Datos JSON
│   └── data/
│       ├── quizzes.json      # Cuestionarios
│       └── gameResults.json  # Resultados de partidas
└── vercel.json               # Configuración de deploy
```

### Flujo de Datos
1. **Frontend** (React) consume APIs REST
2. **API Serverless** (Vercel Functions) procesa requests
3. **JSON Storage** persiste datos en archivos (sin DB)
4. **SPA Routing** con HashRouter para GitHub Pages

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### 1. Clonar repositorio
```bash
git clone https://github.com/tuusuario/super_quiz.git
cd super_quiz
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
# Opción A: Usando Vercel CLI (recomendado)
npx vercel dev

# Opción B: Frontend y backend por separado
npm run dev:frontend  # localhost:5173
npm run dev:backend   # localhost:3000
```

### 4. Build para producción
```bash
npm run build
```

### 5. Deploy
```bash
# Deploy en Vercel
npx vercel --prod

# O deploy en GitHub Pages
npm run deploy
```

---

## 📁 Estructura del Proyecto

<details>
<summary>Ver árbol completo</summary>

```
super_quiz/
├── frontend/
│   ├── public/              # Assets estáticos
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   │   ├── AnalyticsDashboard.jsx
│   │   │   │   ├── ExportResults.jsx
│   │   │   │   ├── GameHistory.jsx
│   │   │   │   └── QuestionPerformance.jsx
│   │   │   ├── spaced-repetition/
│   │   │   │   ├── DecksOverview.jsx
│   │   │   │   ├── StudySession.jsx
│   │   │   │   └── ProgressDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   └── CreateQuiz.jsx
│   │   ├── utils/
│   │   │   ├── apiConfig.js
│   │   │   └── calculations.js
│   │   └── App.jsx
│   └── vite.config.js
├── api/                     # Serverless functions
│   ├── quizzes.js
│   ├── quiz/[id].js
│   ├── spaced-repetition/
│   │   ├── decks.js
│   │   ├── study.js
│   │   └── answer.js
│   └── analytics.js
├── backend/
│   └── data/
│       ├── quizzes.json
│       └── gameResults.json
├── data/
│   ├── flashcards.json      # 219 tarjetas SM-2
│   └── study-progress.json
├── vercel.json
└── README.md
```
</details>

---

## 🎯 Sistema de Repaso Espaciado (SM-2)

Implementación del algoritmo SuperMemo-2:

```javascript
// Fórmula del intervalo
if (quality >= 3) {
  if (repetitions === 0) interval = 1;
  else if (repetitions === 1) interval = 6;
  else interval = Math.round(interval * easeFactor);
} else {
  repetitions = 0;
  interval = 1;
}

// Ajuste del factor de facilidad
easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
```

**Calidad de respuesta (0-5):**
- 0: Blackout (sin memoria)
- 1: Incorrecto
- 2: Difícil (correcto con dificultad)
- 3: Dudoso (correcto con hesitación)
- 4: Fácil
- 5: Perfecto

---

## 🌐 APIs REST

### Cuestionarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/quizzes` | Listar todos los cuestionarios |
| GET | `/api/quizzes/:id` | Obtener cuestionario por ID |
| POST | `/api/quizzes` | Crear nuevo cuestionario |

### Spaced Repetition
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/spaced-repetition/decks` | Listar decks disponibles |
| GET | `/api/spaced-repetition/study?deckId=&limit=&mode=` | Obtener tarjetas para estudiar |
| POST | `/api/spaced-repetition/answer` | Enviar respuesta (calidad 0-5) |
| GET | `/api/spaced-repetition/stats/:deckId` | Estadísticas del deck |

### Analytics
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/analytics` | Estadísticas generales |
| POST | `/api/game-results/reset` | Resetear datos de juego |

---

## 🖼️ Screenshots

| Home | Quiz | Spaced Repetition | Analytics |
|------|------|-------------------|-----------|
| ![Home](docs/home.png) | ![Quiz](docs/quiz.png) | ![Study](docs/study.png) | ![Analytics](docs/analytics.png) |

---

## 🚧 Roadmap

- [ ] Autenticación de usuarios (JWT)
- [ ] Base de datos MongoDB para escalabilidad
- [ ] Modo multijugador en tiempo real (WebSockets)
- [ ] App móvil con React Native
- [ ] Importar/Exportar cuestionarios (JSON/CSV)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre** - [@tuusuario](https://github.com/tuusuario)

¿Te gusta este proyecto? ⭐ ¡Dale una estrella!

---

<p align="center">Hecho con ❤️ y ☕</p>
