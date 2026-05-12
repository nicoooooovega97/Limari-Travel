# Travel Limari Backend

API backend para administración de tours y giras de estudio.

## Instalación

```bash
cd backend
npm install
cp .env.example .env
```

## Ejecución

```bash
npm run dev
```

## Endpoints

- `POST /api/auth/login`
- `GET /api/tours`
- `POST /api/tours`
- `PUT /api/tours/:id`
- `DELETE /api/tours/:id`
- `GET /api/study-trips`
- `POST /api/study-trips`
- `PUT /api/study-trips/:id`
- `DELETE /api/study-trips/:id`

> Este backend usa JWT para proteger las rutas de administración.
