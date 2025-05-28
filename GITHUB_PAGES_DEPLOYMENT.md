# Despliegue en GitHub Pages

Este proyecto está configurado para ser desplegado automáticamente en GitHub Pages mediante GitHub Actions.

## Cómo funciona el despliegue

1. Cuando se hace un push a la rama `main`, se activa el workflow de GitHub Actions definido en `.github/workflows/deploy.yml`.
2. El workflow realiza las siguientes acciones:
   - Instala las dependencias
   - Compila la aplicación frontend
   - Despliega los archivos compilados en GitHub Pages

## Configuración del routing

Para que las rutas funcionen correctamente en GitHub Pages, hemos implementado las siguientes soluciones:

1. Uso de HashRouter en producción para permitir la navegación del lado del cliente sin recargar la página
2. Archivo 404.html para redirigir a la aplicación principal cuando se ingresa directamente a una URL

## Backend

Para el entorno de producción en GitHub Pages, los datos se obtienen desde archivos JSON estáticos ubicados en el directorio `public/api/` que se sirven junto con la aplicación.

Archivos clave:

- `public/api/quizzes.json`: Lista completa de quizzes
- `public/api/quizzes/1.json`: Detalle del quiz ID 1
- `public/api/quizzes/2.json`: Detalle del quiz ID 2

## Desarrollo local

Para desarrollo local, el frontend se comunica con el backend local ejecutándose en `http://localhost:3000`.

Para ejecutar el proyecto localmente:

```bash
# Terminal 1: Iniciar el backend
cd backend
npm install
npm start

# Terminal 2: Iniciar el frontend
cd frontend
npm install
npm run dev
```

## Diferencias entre entornos

- **Desarrollo**: Usa BrowserRouter y se conecta al backend local
- **Producción (GitHub Pages)**: Usa HashRouter y se conecta a la API estática
