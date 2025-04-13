# Estructura del Proyecto Kahoot Clone

## Estructura General
```
kahootClone2/
├── frontend/                 # Código del frontend
│   ├── index.html           # Archivo HTML principal
│   ├── vite.config.js       # Configuración de Vite
│   ├── package.json         # Dependencias del frontend
│   ├── package-lock.json    # Lockfile de dependencias
│   ├── .gitignore          # Archivo de configuración de Git
│   ├── src/                 # Código fuente del frontend
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Punto de entrada
│   │   ├── index.css      # Estilos globales
│   │   ├── components/     # Componentes React
│   │   │   ├── CreateQuiz.jsx     # Componente para crear quizzes
│   │   │   ├── CreateQuiz.css     # Estilos para crear quizzes
│   │   │   ├── Home.jsx        # Página principal
│   │   │   ├── Home.css        # Estilos de la página principal
│   │   │   ├── Layout.jsx      # Componente de layout
│   │   │   ├── Layout.css      # Estilos del layout
│   │   │   ├── Quiz.jsx        # Componente de quiz
│   │   │   ├── Quiz.css        # Estilos del quiz
│   │   │   └── Quizzes.jsx     # Lista de quizzes
│   │   └── public/            # Archivos estáticos
├── backend/                 # Código del backend
│   ├── server.js           # Archivo principal del servidor
│   ├── package.json        # Dependencias del backend
│   ├── package-lock.json   # Lockfile de dependencias
│   ├── .gitignore          # Archivo de configuración de Git
│   └── data/               # Datos de la aplicación
│       └── quizzes.json    # Datos de los quizzes
├── docs/                   # Documentación
│   └── architecture/       # Documentación de arquitectura
├── .git/                   # Directorio de Git
└── README.md              # Documentación principal
```

## Componentes del Frontend

### Directorio `src/components/`
- `CreateQuiz.jsx` - Componente para crear quizzes
- `CreateQuiz.css` - Estilos para el componente de creación de quizzes
- `Home.jsx` - Página principal de la aplicación
- `Home.css` - Estilos para la página principal
- `Layout.jsx` - Componente de layout principal
- `Layout.css` - Estilos para el layout
- `Quiz.jsx` - Componente para mostrar y jugar quizzes
- `Quiz.css` - Estilos para el componente de quiz
- `Quizzes.jsx` - Componente para listar quizzes

## Backend

### Directorio `server/`
- `server.js` - Archivo principal del servidor
- `package.json` - Dependencias del backend
- `package-lock.json` - Lockfile de dependencias del backend
- `.gitignore` - Archivo de configuración de Git para el backend

### Directorio `data/`
- `quizzes.json` - Datos de los quizzes

## Documentación

### Directorio `docs/`
- Contiene documentación del proyecto
- `architecture.md` - Documentación de arquitectura
- `project-structure.md` - Documentación de la estructura del proyecto
