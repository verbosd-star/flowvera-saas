# Modo de Simulación de Pagos (Mock Mode)

Esta guía explica cómo usar el modo de simulación para probar el flujo de pagos sin necesidad de configurar Stripe.

## ¿Qué es el Modo de Simulación?

El modo de simulación (Mock Mode) te permite probar todo el flujo de suscripciones y pagos sin necesitar una cuenta de Stripe. Es perfecto para:
- Desarrollo y pruebas locales
- Demostrar el sistema a clientes
- Probar la interfaz de usuario antes de configurar Stripe
- Entrenar al equipo en el flujo de trabajo

## Activar el Modo de Simulación

### 1. Configurar el archivo `.env`

En `backend/.env`, asegúrate de tener:

```env
STRIPE_MOCK_MODE=true
```

Eso es todo! No necesitas configurar ninguna otra variable de Stripe.

### 2. Reiniciar el Backend

```bash
cd backend
npm run start:dev
```

Verás en los logs: `🎭 [MOCK MODE] ...` cuando se usen las funcionalidades simuladas.

## ¿Cómo Funciona?

### Cuando seleccionas un plan de pago:

1. **Frontend**: Muestra "🎭 Modo simulación activado - redirigiendo..."
2. **Backend**: Actualiza la suscripción directamente en la base de datos
3. **Redirección**: Te lleva de vuelta a `/subscription?success=true&mock=true`
4. **Mensaje**: "🎭 [MODO SIMULACIÓN] Pago simulado exitoso! Tu suscripción ha sido actualizada. (Sin cargo real)"

### Cuando accedes al portal de facturación:

1. **Frontend**: Muestra mensaje de simulación
2. **Backend**: Simula el acceso al portal
3. **Redirección**: Te regresa a la página de suscripción con mensaje informativo

## Flujo de Prueba

### 1. Registrar un Usuario

```
http://localhost:3000/register
Email: test@example.com
Password: Test123!
```

### 2. Ver Planes Disponibles

```
http://localhost:3000/pricing
```

### 3. Seleccionar Plan Basic o Premium

- Click en "Get Started"
- Verás el mensaje de modo simulación
- La suscripción se actualiza automáticamente
- ✅ No se cobra nada

### 4. Gestionar Suscripción

```
http://localhost:3000/subscription
```

- Click en "Manage Billing"
- Verás simulación del portal
- Puedes cambiar planes o cancelar

## Diferencias con Stripe Real

| Característica | Modo Simulación | Stripe Real |
|---------------|-----------------|-------------|
| Pago | ❌ No requiere | ✅ Requiere tarjeta |
| Webhooks | ❌ No disponibles | ✅ Eventos en tiempo real |
| Portal de facturación | 🎭 Simulado | ✅ Portal real de Stripe |
| Base de datos | ✅ Actualiza | ✅ Actualiza |
| Emails | ✅ Envía (si configurado) | ✅ Envía |

## Cambiar a Stripe Real

Cuando estés listo para usar Stripe de verdad:

### 1. Crear cuenta en Stripe
- Ir a https://stripe.com y registrarse
- Obtener API keys del Dashboard

### 2. Crear productos
```bash
stripe products create --name "Flowvera Basic" --description "Perfect for small teams"
stripe prices create --product <PRODUCT_ID> --unit-amount 1000 --currency usd --recurring interval=month
```

### 3. Actualizar `.env`
```env
STRIPE_MOCK_MODE=false  # O eliminar esta línea
STRIPE_SECRET_KEY=sk_test_tu_clave_real
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_real
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_real
STRIPE_BASIC_PRICE_ID=price_id_real_basic
STRIPE_PREMIUM_PRICE_ID=price_id_real_premium
```

### 4. Configurar webhook
- Dashboard de Stripe → Developers → Webhooks
- Añadir endpoint: `https://tu-dominio.com/stripe/webhook`
- Seleccionar eventos necesarios

### 5. Reiniciar backend
```bash
cd backend
npm run start:dev
```

¡Listo! Ahora usarás Stripe real.

## Solución de Problemas

### No veo el mensaje de simulación
- Verifica que `STRIPE_MOCK_MODE=true` esté en `backend/.env`
- Reinicia el backend

### La suscripción no se actualiza
- Verifica que la base de datos esté funcionando
- Revisa los logs del backend para errores

### Quiero probar emails sin Stripe
- El modo simulación funciona independientemente de la configuración de emails
- Configura SendGrid o SMTP para recibir emails de prueba

## Logs del Modo Simulación

Busca estos mensajes en los logs del backend:

```
🎭 [MOCK MODE] Simulating Stripe checkout for user test@example.com, plan: basic
🎭 [MOCK MODE] Simulating billing portal for user test@example.com
```

## Conclusión

El modo de simulación te permite:
- ✅ Probar todo el flujo sin Stripe
- ✅ Desarrollar y demostrar el sistema
- ✅ Cambiar a Stripe real cuando estés listo
- ✅ Sin riesgos ni costos durante el desarrollo

Para más información sobre la configuración completa de Stripe, consulta `SUBSCRIPTION_CONFIGURATION.md`.
