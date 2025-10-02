# User Store API - REST API con TypeScript

API RESTful completa para gestión de usuarios, productos y categorías con autenticación JWT, validación de email y arquitectura limpia basada en principios de Clean Architecture.

## 🚀 Características

- ✅ **Autenticación JWT** - Sistema completo de registro, login y validación de tokens
- ✅ **Validación de Email** - Confirmación de cuenta mediante email con Nodemailer
- ✅ **Gestión de Usuarios** - Registro con encriptación de contraseñas (bcryptjs)
- ✅ **CRUD de Productos** - Crear y listar productos (requiere autenticación)
- ✅ **CRUD de Categorías** - Crear y listar categorías (requiere autenticación)
- ✅ **Arquitectura Limpia** - Separación en capas: Domain, Data, Presentation
- ✅ **TypeScript** - Tipado estático para mayor seguridad y mantenibilidad
- ✅ **MongoDB** - Base de datos NoSQL con Mongoose ODM
- ✅ **Docker** - Configuración lista para MongoDB con docker-compose
- ✅ **Seed Database** - Script para poblar la base de datos con datos de prueba

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Lenguaje**: TypeScript 5.2.2
- **Base de Datos**: MongoDB 6.0.6 + Mongoose 8.18.1
- **Autenticación**: JWT (jsonwebtoken 9.0.2)
- **Encriptación**: bcryptjs 3.0.2
- **Email**: Nodemailer 7.0.6
- **Validación de Variables**: env-var 7.4.1
- **Dev Tools**: ts-node-dev 2.0.0, rimraf 5.0.5

## 📁 Estructura del Proyecto

```
user-store/
├── public/                    # Archivos estáticos (index.html)
├── src/
│   ├── config/               # Configuración y adaptadores
│   │   ├── bcrypt.adapter.ts # Adaptador para encriptación de contraseñas
│   │   ├── jwt.adapter.ts    # Adaptador para generación/validación de JWT
│   │   ├── envs.ts           # Variables de entorno validadas
│   │   ├── validators.ts     # Validadores personalizados
│   │   └── regular-exp.ts    # Expresiones regulares
│   ├── data/                 # Capa de datos
│   │   ├── mongo/
│   │   │   ├── models/       # Modelos de Mongoose (User, Product, Category)
│   │   │   └── mongo-database.ts # Conexión a MongoDB
│   │   └── seed/             # Scripts para poblar la BD
│   │       ├── seed.ts       # Script principal de seed
│   │       └── data.ts       # Datos de prueba
│   ├── domain/               # Lógica de negocio
│   │   ├── dtos/             # Data Transfer Objects
│   │   │   ├── auth/         # DTOs de autenticación
│   │   │   ├── category/     # DTOs de categorías
│   │   │   ├── product/      # DTOs de productos
│   │   │   └── shared/       # DTOs compartidos (paginación)
│   │   ├── entities/         # Entidades del dominio
│   │   └── errors/           # Errores personalizados
│   ├── presentation/         # Capa de presentación
│   │   ├── auth/             # Rutas y controladores de autenticación
│   │   ├── category/         # Rutas y controladores de categorías
│   │   ├── products/         # Rutas y controladores de productos
│   │   ├── middlewares/      # Middlewares (AuthMiddleware)
│   │   ├── services/         # Servicios de negocio
│   │   │   ├── auth.service.ts     # Lógica de autenticación
│   │   │   ├── category.service.ts # Lógica de categorías
│   │   │   ├── product.service.ts  # Lógica de productos
│   │   │   └── email.service.ts    # Servicio de envío de emails
│   │   ├── routes.ts         # Enrutador principal
│   │   └── server.ts         # Configuración del servidor Express
│   └── app.ts                # Punto de entrada de la aplicación
├── .env.template             # Plantilla de variables de entorno
├── docker-compose.yml        # Configuración de Docker
├── package.json              # Dependencias y scripts
└── tsconfig.json             # Configuración de TypeScript
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

# JWT - Semilla para firmar tokens
JWT_SEED=tu_clave_secreta_super_segura

# Email (Nodemailer)
MAILER_SERVICE=gmail
MAILER_EMAIL=tu_email@gmail.com
MAILER_SECRET_KEY=tu_app_password_de_gmail
WEBSERVICE_URL=http://localhost:3000
SEND_EMAIL=false  # Cambiar a true para enviar emails reales
```

> ⚠️ **Importante**: 
> - Cambia `JWT_SEED` por una clave segura en producción
> - Para usar el envío de emails, necesitas generar una **App Password** en tu cuenta de Google
> - Si `SEND_EMAIL=false`, los emails se mostrarán en consola en lugar de enviarse

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

## 🗄️ Modelos de Datos

### User (Usuario)

```typescript
{
  id: string,              // ID único
  name: string,            // Nombre del usuario
  email: string,           // Email (único)
  emailValidated: boolean, // Si el email fue validado
  password: string,        // Contraseña encriptada
  role: string[]          // Roles: ['USER_ROLE'] o ['ADMIN_ROLE']
}
```

### Category (Categoría)

```typescript
{
  id: string,      // ID único
  name: string,    // Nombre de la categoría
  available: boolean, // Si está disponible (default: false)
  user: string     // ID del usuario que la creó (referencia a User)
}
```

### Product (Producto)

```typescript
{
  id: string,          // ID único
  name: string,        // Nombre del producto (único)
  available: boolean,  // Si está disponible (default: false)
  price: number,       // Precio (default: 0)
  description: string, // Descripción opcional
  user: string,        // ID del usuario que lo creó (referencia a User)
  category: string     // ID de la categoría (referencia a Category)
}
```

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture** con separación clara de responsabilidades:

### Capas

1. **Domain** (Dominio)
   - **DTOs**: Validación y transformación de datos de entrada
   - **Entities**: Entidades del dominio (User, Product, Category)
   - **Errors**: Errores personalizados del dominio

2. **Data** (Datos)
   - **Modelos de Mongoose**: Esquemas y modelos de MongoDB
   - **Conexión a MongoDB**: Gestión de la conexión a la base de datos
   - **Scripts de seed**: Población de datos de prueba

3. **Presentation** (Presentación)
   - **Controladores**: Manejan las peticiones HTTP
   - **Rutas**: Definen los endpoints de la API
   - **Services**: Lógica de negocio (AuthService, ProductService, CategoryService, EmailService)
   - **Middlewares**: Validación JWT, manejo de errores

### Adaptadores

Los adaptadores en `config/` permiten cambiar fácilmente las implementaciones:
- **bcrypt.adapter.ts**: Encriptación y comparación de contraseñas
- **jwt.adapter.ts**: Generación y validación de tokens JWT
- **validators.ts**: Validaciones personalizadas (email, etc.)
- **regular-exp.ts**: Expresiones regulares reutilizables

## 🔒 Seguridad

- **Contraseñas encriptadas** con bcryptjs (10 rounds de salt)
- **Tokens JWT** firmados con semilla secreta
- **Validación de email** antes de activar cuenta (campo `emailValidated`)
- **Middleware de autenticación** para rutas protegidas
- **Variables de entorno** para datos sensibles (nunca en el código)
- **Validación de DTOs** en todas las entradas de usuario

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia en modo desarrollo con hot-reload
npm run build    # Compila TypeScript a JavaScript (output en /dist)
npm start        # Compila y ejecuta en modo producción
npm run seed     # Pobla la base de datos con datos de prueba
```

### Script de Seed

Para poblar la base de datos con datos de prueba (usuarios, categorías y productos):

```bash
npm run seed
```

Este script:
- Limpia las colecciones existentes
- Crea usuarios de prueba con contraseñas encriptadas
- Crea categorías asociadas a usuarios aleatorios
- Crea productos asociados a categorías y usuarios aleatorios

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

1. **Configura una cuenta de Gmail**
2. **Genera una App Password**:
   - Ve a tu cuenta de Google → Seguridad
   - Activa la verificación en dos pasos
   - Genera una contraseña de aplicación
3. **Actualiza las variables en `.env`**:
   ```env
   MAILER_SERVICE=gmail
   MAILER_EMAIL=tu_email@gmail.com
   MAILER_SECRET_KEY=tu_app_password_generada
   WEBSERVICE_URL=http://localhost:3000
   SEND_EMAIL=true
   ```

Cuando un usuario se registra, recibirá un email con un enlace de validación:
```
http://localhost:3000/api/auth/validate-email/:token
```

### Variables de entorno en producción

Asegúrate de configurar las siguientes variables en tu servicio de hosting:

- `PORT`: Puerto del servidor
- `MONGO_URL`: URL de MongoDB (ej: MongoDB Atlas)
- `MONGO_DB_NAME`: Nombre de la base de datos
- `JWT_SEED`: Clave secreta segura (mínimo 32 caracteres)
- `MAILER_SERVICE`, `MAILER_EMAIL`, `MAILER_SECRET_KEY`: Configuración de email
- `WEBSERVICE_URL`: URL pública de tu API
- `SEND_EMAIL`: `true` para enviar emails reales

### Build para producción

```bash
npm run build
```

El código compilado estará en la carpeta `dist/`.

## 📚 Características Técnicas Adicionales

### Validación de DTOs

Todos los endpoints validan los datos de entrada usando DTOs personalizados:
- **RegisterUserDto**: Valida nombre, email y contraseña en el registro
- **LoginUserDto**: Valida credenciales de login
- **CreateCategoryDto**: Valida datos de categoría
- **CreateProductDto**: Valida datos de producto con precio y categoría
- **PaginationDto**: Valida parámetros de paginación (page, limit)

### Manejo de Errores

El proyecto incluye errores personalizados para diferentes casos:
- Errores de validación
- Errores de autenticación
- Errores de autorización
- Errores de base de datos

### Transformación de Respuestas

Los modelos de Mongoose están configurados para:
- Convertir `_id` a `id` en las respuestas JSON
- Eliminar el campo `__v` (versionKey)
- Usar virtuals para campos calculados

### Middleware de Autenticación

El `AuthMiddleware` valida:
- Presencia del token JWT en el header `Authorization`
- Validez del token
- Existencia del usuario en la base de datos
- Inyecta el usuario autenticado en `req.body.user`

## 🤝 Contribución

Este proyecto es parte de un curso de desarrollo backend con Node.js y TypeScript. Siéntete libre de usarlo como base para tus propios proyectos.

### Posibles Mejoras

- [ ] Implementar paginación en todos los endpoints de listado
- [ ] Agregar filtros y búsqueda en productos y categorías
- [ ] Implementar roles y permisos más granulares
- [ ] Agregar tests unitarios e integración
- [ ] Implementar rate limiting
- [ ] Agregar documentación con Swagger/OpenAPI
- [ ] Implementar upload de imágenes para productos
- [ ] Agregar soft delete en lugar de eliminación física

## 📄 Licencia

ISC License

---

**Desarrollado con ❤️ usando TypeScript, Express y MongoDB**
