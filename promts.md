# Registro de Prompts y Depuración del Proyecto Full Stack

## 1. Configuración de Docker y Orquestación

### Prompt 1: Corrección de errores de build en Docker Compose
> "asi lo tengo y me da lo mismo de no es la contraseña [Imágenes del error FAILED package.json not found y DBeaver]"

* **Diagnóstico:** El contenedor buscaba `package.json` en la raíz.
* **Solución generada:** 
  - Eliminación del `Dockerfile` raíz.
  - Creación de `backend/Dockerfile` y `frontend/Dockerfile` independientes.
  - Actualización de `compose.yaml` asignando los builds a `./backend` y `./frontend`.

### Prompt 2: Ajuste de variables de entorno y base de datos
> "en que parte lo pongo [Contenido de compose.yaml por defecto]"

* **Solución generada:** Reemplazo total de la plantilla de Docker por una estructura con servicio `postgres_db`, `backend` y `frontend`, mapeando volúmenes y variables `POSTGRES_DB=bibliotecaDB`.

---

## 2. Depuración del Backend (ES Modules y Sequelize)

### Prompt 3: Solución de script "dev" faltante
> "PS ...\backend> npm run: Lifecycle scripts included in backend@1.0.0: test, start"

* **Diagnóstico:** El archivo `backend/package.json` no poseía el script `"dev"`.
* **Solución generada:** Adición de `"dev": "node server.js"` y `"type": "module"` en `backend/package.json`.

### Prompt 4: Corrección de ERR_MODULE_NOT_FOUND
> "Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/services/reserva.service.js'"

* **Diagnóstico:** Discrepancia entre el archivo real `reservationService.js` y la ruta especificada en el controlador.
* **Solución generada:** Corrección del import en `reservationControllers.js` hacia `../services/reservationService.js`.

### Prompt 5: Corrección en Repositorios (Modelos y Rutas)
> "Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/repositories/reservationRepository'"

* **Diagnóstico:** Importación circular y falta de importación del modelo `Reserva` en la capa de datos.
* **Solución generada:** Incorporación explícita de `import { Reserva } from '../models/reservationModel.js';` y adición de la extensión `.js`.

---

## 3. Integración de Autenticación, CORS y Frontend

### Prompt 6: Desbloqueo de Políticas CORS
> "Access to fetch at 'http://localhost:3000/api/login' from origin 'http://localhost:5174' has been blocked by CORS policy"

* **Diagnóstico:** El navegador asignó el puerto `5174` a Vite, bloqueando la comunicación con Express.
* **Solución generada:** Actualización del middleware `cors` en `server.js` permitiendo arreglos de orígenes locales (`http://localhost:5173` y `http://localhost:5174`).

### Prompt 7: Integración de Credenciales en React
> "App.jsx:66 POST http://localhost:3000/api/login 401 (Unauthorized)"

* **Diagnóstico:** El componente `App.jsx` requería sincronizar `credentials: 'include'` en los métodos `fetch` para la persistencia de cookies de sesión Express (`connect.sid`).
* **Solución generada:** Abstracción mediante la función helper `fetchConAuth` y ajuste en la rendición del mapeo de reservas (`reservas.map`).