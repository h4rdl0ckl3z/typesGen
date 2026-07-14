# typesGen

A simple full-stack app with an Elysia backend and a Next.js frontend. The backend exposes a REST API for managing users, and the frontend provides a CRUD interface for interacting with that API.

## Project structure

- backend: Elysia server with OpenAPI support and in-memory user storage
- frontend: Next.js app that consumes the backend API using generated client code

## Tech stack

- Backend: Bun, Elysia, TypeScript
- Frontend: Next.js, React, TypeScript, Tailwind CSS

## Prerequisites

- Node.js 20+
- Bun

## Setup

1. Install backend dependencies:
   ```bash
   cd backend
   bun install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Run the app

### Backend

```bash
cd backend
bun run dev
```

The API will be available at:
- http://localhost:4000/users
- http://localhost:4000/openapi

### Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 to view the UI.

## API overview

The backend supports these user routes:

- GET /users
- GET /users/:id
- POST /users
- PATCH /users/:id
- DELETE /users/:id

## Development notes

- The frontend uses generated API helpers from the frontend source under the API client folder.
- The backend uses in-memory storage, so data resets when the server restarts.
