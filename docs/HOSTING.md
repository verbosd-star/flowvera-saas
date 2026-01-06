# 🚀 Guía de Hosting y Despliegue

Esta guía proporciona información completa sobre cómo desplegar y alojar Flowvera en diferentes entornos.

## 📋 Requisitos Previos

Antes de desplegar Flowvera, asegúrate de tener:

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm o yarn
- Un dominio (para producción)
- Certificados SSL (recomendado para producción)

---

## 🏠 Desarrollo Local

Para desarrollo local, consulta el [README principal](../README.md) para instrucciones de instalación.

**URLs de desarrollo:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

**Módulos disponibles:**
- Autenticación (Login/Registro)
- Dashboard
- Proyectos
- CRM (Contactos y Empresas)
- Configuración de Usuario (Perfil y Contraseña)

---

## ☁️ Opciones de Hosting

### 1. 🔷 Vercel (Frontend - Recomendado)

Vercel es la opción más simple para desplegar el frontend Next.js.

**Pasos:**
1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://tu-api.ejemplo.com
   ```
4. Despliega automáticamente con cada push

**Ventajas:**
- Despliegue automático desde GitHub
- CDN global
- Certificados SSL gratis
- Escalamiento automático

### 2. 🔶 Railway / Render (Backend - Recomendado)

Para el backend NestJS y PostgreSQL.

**Railway:**
1. Crea una cuenta en [Railway](https://railway.app)
2. Crea un nuevo proyecto
3. Agrega PostgreSQL desde el marketplace
4. Despliega el backend desde GitHub
5. Configura variables de entorno:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=tu_secreto_jwt
   PORT=3001
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```

**Render:**
1. Crea una cuenta en [Render](https://render.com)
2. Crea una base de datos PostgreSQL
3. Crea un nuevo Web Service desde GitHub
4. Configura el build command: `cd backend && npm install && npm run build`
5. Configura el start command: `cd backend && npm run start:prod`

### 3. 🔹 DigitalOcean / AWS / Google Cloud

Para implementaciones más personalizadas y escalables.

**DigitalOcean App Platform:**
- Frontend: App estática desde el directorio `frontend/`
- Backend: App Node.js desde el directorio `backend/`
- Base de datos: Managed PostgreSQL

**AWS:**
- Frontend: S3 + CloudFront o Amplify
- Backend: EC2, ECS o Lambda
- Base de datos: RDS PostgreSQL

**Google Cloud:**
- Frontend: Cloud Run o App Engine
- Backend: Cloud Run o Compute Engine
- Base de datos: Cloud SQL

---

## 🔧 Configuración de Variables de Entorno

### Frontend (.env.production)

```bash
# URL de la API backend
NEXT_PUBLIC_API_URL=https://api.flowvera.com

# Ambiente
NODE_ENV=production
```

### Backend (.env.production)

```bash
# Base de datos
DATABASE_URL=postgresql://usuario:password@host:5432/flowvera

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRATION=7d

# Servidor
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://flowvera.com

# (Opcional) Stripe para pagos
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🗄️ Configuración de Base de Datos

### PostgreSQL en Producción

1. **Crear base de datos:**
   ```sql
   CREATE DATABASE flowvera_production;
   ```

2. **Ejecutar migraciones:**
   ```bash
   cd backend
   npm run migration:run
   ```

3. **Seed inicial (opcional):**
   ```bash
   npm run seed:prod
   ```

### Backup y Restauración

**Backup:**
```bash
pg_dump -U usuario -h host flowvera_production > backup.sql
```

**Restauración:**
```bash
psql -U usuario -h host flowvera_production < backup.sql
```

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad

- [ ] Variables de entorno configuradas correctamente
- [ ] JWT_SECRET único y seguro (mínimo 32 caracteres)
- [ ] HTTPS/SSL habilitado
- [ ] CORS configurado correctamente
- [ ] Rate limiting activado
- [ ] Validación de entrada en todos los endpoints
- [ ] Helmet.js configurado en NestJS
- [ ] Contraseñas hasheadas con bcrypt
- [ ] Logs configurados (sin información sensible)
- [ ] Backups automáticos de base de datos
- [ ] Monitoreo de errores (Sentry, etc.)

### Configuración de CORS

En `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

---

## 📊 Monitoreo y Logs

### Herramientas Recomendadas

**Monitoreo de Aplicación:**
- [Sentry](https://sentry.io) - Tracking de errores
- [LogRocket](https://logrocket.com) - Session replay
- [New Relic](https://newrelic.com) - APM

**Monitoreo de Infraestructura:**
- [Datadog](https://datadoghq.com)
- [Grafana](https://grafana.com)
- Herramientas nativas del proveedor (AWS CloudWatch, etc.)

**Analytics:**
- [Google Analytics](https://analytics.google.com)
- [Plausible](https://plausible.io)
- [PostHog](https://posthog.com)

---

## 🚦 CI/CD

### GitHub Actions

Ejemplo de workflow para despliegue automático:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
```

---

## 🔄 Actualización y Mantenimiento

### Proceso de Actualización

1. **Backup de base de datos** antes de actualizar
2. **Probar en ambiente de staging** primero
3. **Ejecutar migraciones** de base de datos
4. **Desplegar backend** primero
5. **Desplegar frontend** después
6. **Verificar** que todo funcione correctamente

### Rollback

Si algo sale mal:
1. Revertir al deployment anterior en Vercel/Railway
2. Restaurar backup de base de datos si es necesario
3. Verificar logs para identificar el problema

---

## 💰 Costos Estimados

### Plan Básico (hasta 100 usuarios)

| Servicio | Proveedor | Costo Mensual |
|----------|-----------|---------------|
| Frontend | Vercel Pro | $20 USD |
| Backend | Railway Starter | $5 USD |
| Base de datos | Railway PostgreSQL | $5 USD |
| **Total** | | **~$30 USD/mes** |

### Plan Premium (hasta 1000 usuarios)

| Servicio | Proveedor | Costo Mensual |
|----------|-----------|---------------|
| Frontend | Vercel Pro | $20 USD |
| Backend | Railway Pro | $20 USD |
| Base de datos | Railway PostgreSQL | $20 USD |
| Monitoreo | Sentry | $26 USD |
| **Total** | | **~$86 USD/mes** |

### Plan Enterprise (personalizado)

Consulta con el equipo de ventas para opciones empresariales con:
- Alojamiento dedicado
- SLA garantizado
- Soporte 24/7
- Infraestructura personalizada

---

## 🆘 Soporte y Ayuda

### Problemas Comunes

**Error de conexión a base de datos:**
- Verifica la variable `DATABASE_URL`
- Asegúrate de que la base de datos esté activa
- Revisa las reglas de firewall

**Error de CORS:**
- Verifica la variable `FRONTEND_URL` en el backend
- Asegúrate de que coincida con la URL real del frontend

**Build fallando:**
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build para errores específicos
- Asegúrate de que la versión de Node.js sea compatible

### Recursos Adicionales

- [Documentación de Autenticación](AUTHENTICATION.md)
- [Guía de Onboarding](../ONBOARDING.md)
- [Precios y Planes](../PRICING.md)
- [Roadmap del Producto](../ROADMAP.md)

### Contacto

Para soporte empresarial o consultas sobre hosting dedicado:
- 📧 Email: soporte@flowvera.com
- 💬 Chat: Disponible en la aplicación web

---

*Última actualización: Enero 2026*
