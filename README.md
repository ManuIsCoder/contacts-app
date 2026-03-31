# Contacts App

Aplicación web para gestionar contactos (crear, listar, editar, buscar y eliminar).

## Requisitos previos

- Node.js v20 (via NVM)
- Docker

## Cómo correr el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/ManuIsCoder/contacts-app.git
cd contacts-app
```

### 2. Levantar la base de datos
```bash
docker compose up -d
```

### 3. Backend
```bash
cd backend
nvm use 20
npm install
```

Creá un archivo `.env` dentro de `backend` con:
```env
DATABASE_URL="postgresql://test:test@localhost:5432/test"
```
```bash
npx prisma@5 migrate dev --name init
npm run start:dev
```

### 4. Frontend

En una nueva terminal:
```bash
cd frontend
nvm use 20
npm install
npm run dev
```

### 5. Abrir la app

Entrá a [http://localhost:3001](http://localhost:3001)

## Funcionalidades

- Crear un contacto (nombre + email)
- Listar todos los contactos
- Editar un contacto
- Buscar contactos por nombre o email
- Eliminar un contacto
- Validaciones en formularios