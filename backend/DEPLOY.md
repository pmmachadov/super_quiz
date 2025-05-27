# Instrucciones para desplegar el backend de Super Quiz

## Despliegue en Render

1. Crea una cuenta en [Render](https://render.com/) si aún no tienes una
2. Haz clic en "New" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub o sube directamente esta carpeta backend

### Configuración importante
4. Configura los siguientes ajustes:
   - **Name**: super-quiz-backend (o el nombre que prefieras)
   - **Environment**: Node
   - **Root Directory**: backend (¡importante si estás desplegando desde el repositorio raíz!)
   - **Build Command**: npm install
   - **Start Command**: node server.js
   - **Runtime Environment**: Node
   - **Branch**: main (o la rama donde esté tu código)

5. En la sección "Advanced":
   - Asegúrate que "Auto-Deploy" esté habilitado
   - En caso de error con Yarn, haz clic en "Environment" y añade variable:
     - **Key**: PACKAGE_MANAGER
     - **Value**: npm

6. Haz clic en "Create Web Service"

## Variables de entorno

No se requieren variables de entorno específicas para el funcionamiento básico.

## Verificar el despliegue

Una vez desplegado, verifica que el backend funcione correctamente accediendo a:
`https://tu-servicio-render.onrender.com/api/quizzes`

Si ves la lista de quizzes, significa que el despliegue fue exitoso.

## Configuración de CORS

El backend ya está configurado para permitir solicitudes desde:
- localhost:5173 (desarrollo)
- mysuperquiz.netlify.app (producción)

Si necesitas añadir más dominios, edita la configuración CORS en server.js.
