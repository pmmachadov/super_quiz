# 🎯 Super Quiz

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![Material UI](https://img.shields.io/badge/MUI-7-007FFF?logo=mui)](https://mui.com/)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-222222?logo=github)](https://pages.github.com/)

Aplicación full-stack de cuestionarios interactivos con sistema de aprendizaje espaciado (SRS), panel de analytics en tiempo real y diseño responsive.

<!-- TODO: Añadir screenshot o GIF de la app en funcionamiento -->
<!-- ![Demo](docs/demo.gif) -->

🔗 **[Ver Demo en Vivo](https://pmmachadov.github.io/super_quiz/)**

---

## ✨ Features Destacadas

| Feature                      | Descripción                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| ⏱️ **Timer Interactivo**     | Cuenta regresiva con barra de progreso animada y cambio de color por tiempo restante |
| 📊 **Analytics Dashboard**   | Visualización de resultados, historial de partidas y exportación de datos            |
| 🧠 **Spaced Repetition**     | Sistema SRS integrado para aprendizaje eficiente basado en Full Stack Open           |
| ⚡ **Caché Cliente**         | Optimización de performance con Map para evitar llamadas redundantes a la API        |
| 🎨 **UI/UX Pulida**          | Animaciones CSS, efectos visuales (bubbles), diseño responsive con Material UI       |
| 🛡️ **Validación de Datos**   | Validación de inputs con express-validator en el backend                             |
| 🔄 **Modo Offline-Friendly** | Fallback a datos locales si la API no está disponible                                |

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 19** - UI library con hooks modernos
- **React Router 7** - Navegación SPA
- **Material UI 7** - Componentes y diseño consistente
- **Vite 6** - Build tool rápido con HMR
- **Emotion** - CSS-in-JS para estilos dinámicos

### Backend

- **Node.js** + **Express 5** - API RESTful
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **express-validator** - Validación de requests
- **CORS** - Configuración de políticas cross-origin

### DevOps & Tools

- **GitHub Actions** - CI/CD para deploy automático
- **GitHub Pages** - Hosting del frontend
- **Vercel/Railway** - Hosting del backend (configurado)
- **ESLint** - Linting con reglas de React Hooks

---

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   MongoDB       │
│   (React/Vite)  │     │   (Express)     │     │   (Mongoose)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │     │  Vercel/Railway │
│   (Static)      │     │   (Serverless)  │
└─────────────────┘     └─────────────────┘
```

### Patrones Implementados

- **Component-based Architecture** - Componentes React reutilizables
- **Custom Hooks** - Lógica de estado encapsulada
- **Repository Pattern** - Abstracción de acceso a datos con Mongoose
- **Cache Strategy** - Map en memoria para optimizar requests

---

## 🚀 Cómo Ejecutar Localmente

### Prerrequisitos

- Node.js >= 18.x
- MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/pmachado01/super_quiz.git
cd super_quiz
```

### 2. Configurar variables de entorno

```bash
# En la raíz del proyecto, crear archivo .env
cp .env.example .env  # o crear manualmente
```

Editar `.env` con tus credenciales:

```env
# Backend
PORT=3000
MONGODB_URI=mongodb://localhost:27017/superquiz
# O para Atlas: mongodb+srv://usuario:password@cluster.mongodb.net/superquiz

NODE_ENV=development
```

### 3. Instalar dependencias

```bash
# Instalar dependencias raíz
npm install

# Instalar dependencias backend
cd backend && npm install

# Instalar dependencias frontend (en otra terminal)
cd frontend && npm install
```

### 4. Cargar datos iniciales (opcional)

```bash
cd backend
node loadData.js
```

### 5. Iniciar el proyecto

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/health

---

## 📁 Estructura del Proyecto

```
super_quiz/
├── 📁 frontend/              # React SPA
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── analytics/    # Dashboard de analytics
│   │   │   ├── spaced-repetition/  # Sistema SRS
│   │   │   └── *.jsx         # Componentes principales
│   │   ├── utils/            # Utilidades (API config)
│   │   └── App.jsx           # Entry point con routing
│   └── package.json
│
├── 📁 backend/               # API Express
│   ├── config/               # Configuración DB
│   ├── models/               # Esquemas Mongoose
│   ├── validators/           # Validaciones express-validator
│   ├── server.js             # Entry point del servidor
│   └── package.json
│
├── 📁 api/                   # Serverless functions (Vercel)
├── 📁 data/                  # Datos JSON iniciales
├── 📁 docs/                  # Documentación adicional
└── package.json              # Workspace root
```

---

## 🧪 Scripts Disponibles

### Root

```bash
npm run dev:frontend    # Iniciar frontend en desarrollo
npm run dev:backend     # Iniciar backend en desarrollo
npm run build           # Build de producción (frontend)
npm run deploy          # Deploy a GitHub Pages
```

### Frontend

```bash
npm run dev             # Servidor de desarrollo Vite
npm run build           # Build de producción
npm run preview         # Preview del build
npm run lint            # Ejecutar ESLint
```

### Backend

```bash
npm run dev             # Nodemon con auto-reload
npm start               # Producción (Node)
```

---

## 📝 Decisiones Técnicas

### ¿Por qué React + Vite?

- **Fast HMR** para desarrollo ágil
- **Build optimizado** sin configuración compleja
- **React 19** con features modernas

### ¿Por qué MongoDB?

- Esquema flexible para quizzes dinámicos
- Facilidad para almacenar arrays de preguntas/respuestas
- Integración nativa con Node.js via Mongoose

### Optimizaciones Implementadas

1. **Caché en memoria** (`quizzesCache`) para evitar re-fetching
2. **Lazy loading** de componentes con React Router
3. **CSS animations** en lugar de JS cuando es posible
4. **Selective field querying** en MongoDB (excluir `correctAnswer` en listados)

---

## 🚧 Roadmap

- [ ] Autenticación de usuarios (JWT)
- [ ] Tests unitarios con Vitest
- [ ] Migración progresiva a TypeScript
- [ ] Modo multijugador en tiempo real (WebSockets)
- [ ] PWA con offline support

---

## 👨‍💻 Autor

**Pablo Machado** - Developer Junior Full Stack

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin)](https://linkedin.com/in/tu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github)](https://github.com/pmachado01)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  ⭐ Si te gusta este proyecto, ¡dale una estrella!
</p>
