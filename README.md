# User Store API - REST API con TypeScript

API RESTful completa para gestión de usuarios, productos y categorías con autenticación JWT, validación de email y arquitectura limpia.

## 🚀 Características

- ✅ **Autenticación JWT** - Sistema completo de registro, login y validación de tokens
- ✅ **Validación de Email** - Confirmación de cuenta mediante email
- ✅ **Gestión de Usuarios** - Registro con encriptación de contraseñas (bcrypt)
- ✅ **CRUD de Productos** - Crear y listar productos (requiere autenticación)
- ✅ **CRUD de Categorías** - Crear y listar categorías (requiere autenticación)
- ✅ **Arquitectura Limpia** - Separación en capas: Domain, Data, Presentation
- ✅ **TypeScript** - Tipado estático para mayor seguridad
- ✅ **MongoDB** - Base de datos NoSQL con Mongoose
- ✅ **Docker** - Configuración lista para MongoDB

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT (jsonwebtoken)
- **Encriptación**: bcryptjs
- **Email**: Nodemailer
- **Validación**: env-var
- **Dev Tools**: ts-node-dev, rimraf

## 📁 Estructura del Proyecto

```
src/
├── config/           # Configuración y variables de entorno
├── data/            # Capa de datos (MongoDB, modelos)
├── domain/          # Lógica de negocio (DTOs, entidades, errores)
├── presentation/    # Capa de presentación (controladores, rutas, servicios)
│   ├── auth/       # Autenticación (login, register, validate-email)
│   ├── category/   # Gestión de categorías
│   ├── products/   # Gestión de productos
│   ├── middlewares/# Middlewares (validación JWT)
│   └── services/   # Servicios de negocio
└── app.ts          # Punto de entrada
```

## 📦 Instalación

### 1. Clonar el repositorio e instalar dependencias

```bash
npm install
# o
pnpm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.template` a `.env` y configura las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# MongoDB
MONGO_URL=mongodb://mongo-user:123456@localhost:27017
MONGO_DB_NAME=mystore

# JWT
JWT_SEED=tu_clave_secreta_super_segura

# Email (Nodemailer)
MAILER_SERVICE=gmail
MAILER_EMAIL=tu_email@gmail.com
MAILER_SECRET_KEY=tu_app_password_de_gmail
WEBSERVICE_URL=http://localhost:3000
SEND_EMAIL=false  # Cambiar a true para enviar emails reales
```

> ⚠️ **Importante**: Cambia `JWT_SEED` por una clave segura en producción.

### 3. Levantar MongoDB con Docker

```bash
docker-compose up -d
```

Esto levantará MongoDB en el puerto `27017` con las credenciales configuradas.

### 4. Iniciar el servidor

**Modo desarrollo** (con hot-reload):
```bash
npm run dev
```

**Modo producción**:
```bash
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/validate-email/:token` | Validar email | No |

**Ejemplo - Registro**:
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta**:
```json
{
  "user": {
    "id": "...",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ejemplo - Login**:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta**:
```json
{
  "user": {
    "id": "...",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 📦 Categorías (`/api/categories`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Listar todas las categorías | No |
| POST | `/api/categories` | Crear nueva categoría | **Sí (JWT)** |

**Ejemplo - Crear categoría**:
```json
POST /api/categories
Content-Type: application/json
Authorization: Bearer TU_TOKEN_JWT

{
  "name": "Electrónica"
}
```

**Respuesta**:
```json
{
  "id": "...",
  "name": "Electrónica",
  "available": true
}
```

### 🛍️ Productos (`/api/products`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Listar todos los productos | No |
| POST | `/api/products` | Crear nuevo producto | **Sí (JWT)** |

**Ejemplo - Crear producto**:
```json
POST /api/products
Content-Type: application/json
Authorization: Bearer TU_TOKEN_JWT

{
  "name": "Laptop",
  "price": 999.99,
  "description": "Laptop de alta gama",
  "category": "ID_DE_CATEGORIA"
}
```

**Respuesta**:
```json
{
  "id": "...",
  "name": "Laptop",
  "price": 999.99,
  "description": "Laptop de alta gama",
  "available": true,
  "category": {
    "id": "...",
    "name": "Electrónica"
  },
  "user": "ID_DEL_USUARIO"
}
```

## 🔒 Seguridad

- **Contraseñas encriptadas** con bcryptjs (10 rounds)
- **Tokens JWT** con expiración configurable
- **Validación de email** antes de activar cuenta
- **Middleware de autenticación** para rutas protegidas
- **Variables de entorno** para datos sensibles

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia en modo desarrollo con hot-reload
npm run build    # Compila TypeScript a JavaScript
npm start        # Inicia en modo producción (requiere build)
```

## 🐳 Docker

El proyecto incluye `docker-compose.yml` con:
- **MongoDB 6.0.6** en puerto 27017
- **PostgreSQL 15.3** (comentado, disponible si lo necesitas)

Para detener los contenedores:
```bash
docker-compose down
```

## 🧪 Configuración de Email

Para habilitar el envío de emails de validación:

1. Configura una cuenta de Gmail
2. Genera una **App Password** en tu cuenta de Google
3. Actualiza las variables en `.env`:
   ```env
   MAILER_SERVICE=gmail
   MAILER_EMAIL=tu_email@gmail.com
   MAILER_SECRET_KEY=tu_app_password
   SEND_EMAIL=true
   ```

## 🤝 Contribución

Este proyecto es parte de un curso de desarrollo backend. Siéntete libre de usarlo como base para tus propios proyectos.

## 📄 Licencia

ISC License

---

**Desarrollado con ❤️ usando TypeScript, Express y MongoDB**
