# ucuDigital - Backend

Breve: backend de la aplicación ucuDigital. Debe desplegarse en Render para que pueda utilizarse públicamente.

## Requisitos
- Node 14+ ó Python 3.8+ (ajustar según implementación)
- Git
- Base de datos (Postgres recomendado) si la app la usa

## Instalación local
1. Clona el repositorio:
    ```bash
    git clone <REPO_URL>
    cd <REPO_DIR>
    ```
2. Instala dependencias:
    - Node:
      ```bash
      npm install
      ```
    - Python:
      ```bash
      python -m venv venv
      source venv/bin/activate     # Windows: venv\Scripts\activate
      pip install -r requirements.txt
      ```

3. Crea archivo de entorno `.env` a partir del ejemplo:
    ```env
    # .env.example
    PORT=8000
    DATABASE_URL=postgres://user:pass@host:5432/dbname
    SECRET_KEY=tu_secreto
    OTHER_VAR=valor
    ```

4. Ejecuta migraciones (si aplica):
    - Node (sequelize/typeorm/etc): ajustar comando
    - Python (Alembic/Django):
    ```bash
    # ejemplo Django
    python manage.py migrate
    ```

5. Levanta la app localmente:
    - Node:
      ```bash
      npm start
      ```
    - Python (Flask/Gunicorn):
      ```bash
      gunicorn main:app --bind 0.0.0.0:$PORT
      ```

## Endpoints (ejemplo)
- GET /health — estado
- POST /auth/login — login
- GET /api/... — rutas de la API

(Añadir la documentación completa de endpoints aquí)

## Despliegue en Render (recomendado — obligatorio para usar)
1. Push del código a GitHub/GitLab.
2. Entra a https://render.com y crea una cuenta o inicia sesión.
3. Crea un nuevo service → Web Service → Connect a repo → selecciona el repositorio.
4. Configura:
    - Branch: main (o la rama elegida)
    - Environment: Node / Python (según tu proyecto)
    - Build Command:
      - Node: `npm install && npm run build` (ajustar si no hay build)
      - Python: `pip install -r requirements.txt`
    - Start Command:
      - Node: `npm start` (o `node index.js`, `npm run start:prod`)
      - Python: `gunicorn main:app --bind 0.0.0.0:$PORT`
    - Port: Render provee $PORT automáticamente (no forzar puerto fijo)
5. Variables de entorno: añade las mismas claves que en tu `.env` (DATABASE_URL, SECRET_KEY, etc.) desde la sección Environment en Render.
6. Base de datos: si necesitas Postgres, crea un Add-on Database en Render y usa la URL que te proveen en `DATABASE_URL`.
7. Health Check: configura ruta `/health` o `/` para que Render verifique que la app está viva.
8. Deploy: guarda y Render lanzará el primer deploy automáticamente. Revisa logs para errores.

Opcional: agregar `render.yaml` para despliegues reproducibles. Ejemplo básico:
```yaml
services:
  - type: web
     name: ucuDigital-backend
     env: node  # o python
     plan: free
     buildCommand: npm install && npm run build
     startCommand: npm start
```

## Notas
- Asegúrate de no commitear `.env`.
- Ajusta comandos según framework real (Express, FastAPI, Django, etc).
- Incluye documentación de API (OpenAPI/Swagger) en el repo si está disponible.

## Licencia
Indica la licencia del proyecto en LICENSE (ej. MIT).

Contacto: LuisChito ツ
