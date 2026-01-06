# Vercel Deployment Guide

Este proyecto está configurado para deployar el frontend en Vercel.

## Configuración en Vercel Dashboard

### 1. Importar el proyecto
1. Ve a https://vercel.com/new
2. Importa el repositorio `verbosd-star/flowvera-saas`
3. Selecciona el proyecto

### 2. Configuración del proyecto

**Root Directory:**
- Configura `frontend` como el Root Directory en Project Settings

**Framework Preset:**
- Next.js (detectado automáticamente)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
.next
```

**Install Command:**
```bash
npm install
```

### 3. Variables de Entorno

Agrega las siguientes variables de entorno en el dashboard de Vercel (Settings → Environment Variables):

**Para Production:**
```
NEXT_PUBLIC_API_URL=https://tu-backend-api.com
```

**Para Preview:**
```
NEXT_PUBLIC_API_URL=https://tu-backend-staging.com
```

**Para Development:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Deployments

- **Production:** Se deploya automáticamente desde la rama `main`
- **Preview:** Se deploya automáticamente desde pull requests y otras ramas

## Solución de Problemas

### Error: "Build failed"

Si el build falla en Vercel:

1. **Verifica que Root Directory está configurado a `frontend`**
2. **Revisa las variables de entorno**
3. **Verifica los logs de build en Vercel**

### Error: "Cannot connect to API"

Si la aplicación se deploya pero no puede conectarse al backend:

1. Verifica que `NEXT_PUBLIC_API_URL` está configurado correctamente
2. Asegúrate de que el backend está accesible públicamente
3. Verifica CORS en el backend

### Deployar una rama específica

Para deployar una rama específica:

```bash
# Haz push a la rama
git push origin <nombre-rama>

# Vercel creará un preview deployment automáticamente
```

## Archivos de Configuración

- `vercel.json` - Configuración de build para Vercel
- `.vercelignore` - Archivos a ignorar en el deployment

## Monorepo Structure

Este proyecto tiene una estructura de monorepo:

```
flowvera-saas/
├── backend/          # NestJS API (no se deploya en Vercel)
├── frontend/         # Next.js App (se deploya en Vercel)
├── vercel.json       # Configuración de Vercel
└── .vercelignore     # Archivos ignorados por Vercel
```

Solo el frontend se deploya en Vercel. El backend debe desplegarse por separado (por ejemplo, en Railway, Render, o un servidor VPS).

## URL de Deployment

- **Production:** https://flowvera-saas.vercel.app
- **Preview:** https://flowvera-saas-<branch-name>-<hash>.vercel.app

## Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno en Vercel](https://vercel.com/docs/projects/environment-variables)
