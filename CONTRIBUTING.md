# 🤝 Guía para Colaboradores

¡Gracias por tu interés en contribuir a Flowvera! Este documento proporciona guías y mejores prácticas para colaborar en el proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Pruebas](#pruebas)
- [Documentación](#documentación)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Comunidad](#comunidad)

---

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a mantener un ambiente abierto y acogedor. Esperamos que todos los colaboradores:

- Sean respetuosos y profesionales
- Acepten críticas constructivas
- Se enfoquen en lo que es mejor para la comunidad
- Muestren empatía hacia otros miembros

### Comportamiento Esperado

✅ **Sí hacer:**
- Usar lenguaje acogedor e inclusivo
- Respetar puntos de vista y experiencias diferentes
- Aceptar críticas constructivas con gracia
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

❌ **No hacer:**
- Usar lenguaje o imágenes sexualizadas
- Hacer comentarios trolling, insultos o ataques personales
- Acosar públicamente o en privado
- Publicar información privada de otros sin permiso
- Conducta que se consideraría inapropiada en un entorno profesional

---

## 🚀 Cómo Contribuir

Hay muchas formas de contribuir a Flowvera:

### 1. 🐛 Reportar Bugs
- Usa las GitHub Issues
- Describe el problema claramente
- Incluye pasos para reproducir
- Menciona tu entorno (OS, Node.js version, etc.)

### 2. 💡 Sugerir Mejoras
- Abre una discusión en GitHub Discussions
- Explica claramente tu idea
- Proporciona contexto y casos de uso
- Considera el alcance del proyecto

### 3. 📝 Mejorar Documentación
- Corrige errores tipográficos
- Aclara instrucciones confusas
- Agrega ejemplos
- Traduce a otros idiomas

### 4. 💻 Contribuir Código
- Corrige bugs
- Implementa nuevas funciones
- Mejora el rendimiento
- Refactoriza código existente

### 5. 🎨 Diseño y UX
- Mejora la interfaz de usuario
- Sugiere mejoras de experiencia
- Crea mockups o prototipos

---

## ⚙️ Configuración del Entorno

### Requisitos Previos

```bash
# Versiones requeridas
Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 14.0
```

### Instalación

1. **Fork y clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/flowvera-saas.git
cd flowvera-saas
```

2. **Instala dependencias:**
```bash
npm run install:all
```

3. **Configura variables de entorno:**
```bash
# Backend
cp backend/.env.example backend/.env
# Edita backend/.env con tus configuraciones

# Frontend
cp frontend/.env.example frontend/.env
# Edita frontend/.env con tus configuraciones
```

4. **Inicia el entorno de desarrollo:**
```bash
# Inicia frontend y backend simultáneamente
npm run dev

# O inícialos por separado
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

---

## 🔄 Proceso de Desarrollo

### Flujo de Trabajo con Git

1. **Crea una nueva rama desde main:**
```bash
git checkout main
git pull origin main
git checkout -b feature/tu-nueva-funcionalidad
```

2. **Haz tus cambios:**
```bash
# Edita archivos
git add .
git commit -m "feat: agrega nueva funcionalidad"
```

3. **Mantén tu rama actualizada:**
```bash
git fetch origin
git rebase origin/main
```

4. **Push y crea Pull Request:**
```bash
git push origin feature/tu-nueva-funcionalidad
# Crea PR en GitHub
```

### Convención de Nombres de Ramas

- `feature/` - Nuevas funcionalidades
- `fix/` - Corrección de bugs
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `test/` - Agregar o actualizar tests
- `chore/` - Mantenimiento y tareas rutinarias

Ejemplo: `feature/add-user-notifications`

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, punto y coma faltantes, etc.
- `refactor`: Refactorización de código
- `test`: Agregar tests
- `chore`: Mantenimiento

**Ejemplos:**
```bash
feat(auth): add password reset functionality
fix(crm): correct contact deletion bug
docs(readme): update installation instructions
refactor(projects): simplify task status logic
test(api): add integration tests for CRM endpoints
```

---

## 📏 Estándares de Código

### TypeScript/JavaScript

**Estilo de Código:**
- Usa ESLint y Prettier (configurados en el proyecto)
- Indentación: 2 espacios
- Comillas: simples para strings
- Punto y coma: requerido

**Ejecutar linters:**
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

**Mejores Prácticas:**
- Usa TypeScript types explícitos
- Evita `any` cuando sea posible
- Nombra variables y funciones descriptivamente
- Mantén funciones pequeñas y enfocadas
- Comenta código complejo
- Usa async/await sobre callbacks

**Ejemplo:**
```typescript
// ❌ Evitar
function f(x: any) {
  return x + 1;
}

// ✅ Preferir
function incrementUserId(userId: number): number {
  return userId + 1;
}
```

### React/Next.js

- Usa componentes funcionales con hooks
- Prefiere composition sobre herencia
- Usa TypeScript para props
- Implementa manejo de errores
- Optimiza rendimiento (useMemo, useCallback)

**Ejemplo:**
```typescript
interface UserCardProps {
  name: string;
  email: string;
  onEdit: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ name, email, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};
```

### NestJS

- Sigue la arquitectura modular de NestJS
- Usa DTOs para validación
- Implementa guards para autenticación
- Usa decoradores apropiadamente
- Maneja errores con excepciones personalizadas

---

## 🧪 Pruebas

### Escribir Tests

Todos los cambios de código deben incluir tests apropiados.

**Frontend (Jest + React Testing Library):**
```bash
cd frontend
npm run test
```

**Backend (Jest):**
```bash
cd backend
npm run test
```

### Cobertura de Tests

Mantenemos una cobertura mínima del 80%:
```bash
npm run test:cov
```

### Tipos de Tests

1. **Unit Tests:** Funciones y componentes individuales
2. **Integration Tests:** Múltiples componentes/módulos
3. **E2E Tests:** Flujos completos de usuario

**Ejemplo de Test:**
```typescript
describe('UserService', () => {
  it('should create a new user', async () => {
    const userData = { email: 'test@test.com', password: 'pass123' };
    const user = await userService.create(userData);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // hashed
  });
});
```

---

## 📚 Documentación

### Documentar Código

- Agrega JSDoc/TSDoc a funciones públicas
- Documenta parámetros complejos
- Explica lógica no obvia
- Mantén comentarios actualizados

**Ejemplo:**
```typescript
/**
 * Calcula el total de una factura incluyendo impuestos
 * @param subtotal - Subtotal antes de impuestos
 * @param taxRate - Tasa de impuesto (ej: 0.16 para 16%)
 * @returns Total con impuestos incluidos
 */
function calculateTotal(subtotal: number, taxRate: number): number {
  return subtotal * (1 + taxRate);
}
```

### Documentación de Usuario

Actualiza la documentación relevante cuando:
- Agregas una nueva funcionalidad
- Cambias el comportamiento existente
- Modificas APIs o interfaces

Documentos a considerar:
- `README.md` - Información general
- `ONBOARDING.md` - Guía de usuario
- `docs/AUTHENTICATION.md` - API de autenticación
- `docs/HOSTING.md` - Guía de despliegue

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que no sea un bug ya reportado
2. Intenta reproducir en la última versión
3. Recopila información relevante

### Template de Bug Report

```markdown
## Descripción
[Descripción clara del bug]

## Pasos para Reproducir
1. Ve a '...'
2. Haz clic en '...'
3. Observa el error

## Comportamiento Esperado
[Qué debería suceder]

## Comportamiento Actual
[Qué sucede actualmente]

## Capturas de Pantalla
[Si aplica]

## Entorno
- OS: [ej: macOS 13.0]
- Navegador: [ej: Chrome 120]
- Node.js: [ej: v18.17.0]
- Versión: [ej: 1.0.0]

## Información Adicional
[Cualquier contexto adicional]
```

---

## 💡 Sugerir Mejoras

### Template de Feature Request

```markdown
## Problema/Necesidad
[Describe el problema que esta funcionalidad resolvería]

## Solución Propuesta
[Describe cómo funcionaría la funcionalidad]

## Alternativas Consideradas
[Otras formas de resolver el problema]

## Beneficios
- Beneficio 1
- Beneficio 2

## Casos de Uso
1. Como [tipo de usuario], quiero [objetivo] para [beneficio]
2. ...

## Mockups/Ejemplos
[Si aplica, imágenes o código de ejemplo]
```

---

## 🔀 Pull Requests

### Antes de Crear un PR

- [ ] Código sigue las guías de estilo
- [ ] Tests pasan localmente
- [ ] Agregaste nuevos tests si es necesario
- [ ] Actualizaste documentación
- [ ] Commit messages siguen convenciones
- [ ] Sin conflictos con main
- [ ] Probaste cambios en localhost

### Template de Pull Request

```markdown
## Descripción
[Qué cambios introduce este PR]

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Issue Relacionado
Closes #[número]

## Cómo Probar
1. Paso 1
2. Paso 2
3. ...

## Checklist
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Sin warnings de linter
- [ ] Probado en localhost

## Capturas de Pantalla
[Si aplica]
```

### Proceso de Review

1. **Automated Checks:** CI/CD ejecuta tests y linters
2. **Code Review:** Al menos un maintainer revisa
3. **Feedback:** Implementa cambios solicitados
4. **Merge:** Una vez aprobado, será merged

### Tiempo de Respuesta

- Issues: 48-72 horas
- PRs: 3-5 días laborables
- Bugs críticos: 24 horas

---

## 👥 Comunidad

### Comunicación

- **GitHub Issues:** Bugs y features
- **GitHub Discussions:** Preguntas y discusión
- **Pull Requests:** Revisión de código

### Reconocimiento

Todos los colaboradores son reconocidos en:
- Lista de contributors en GitHub
- Releases notes
- Documentación (cuando aplique)

### Niveles de Colaboración

🌱 **Contributor:** Ha hecho al menos 1 PR aceptado
⭐ **Active Contributor:** 5+ PRs aceptados
💎 **Core Contributor:** 20+ PRs y participación activa
🔧 **Maintainer:** Acceso de escritura al repositorio

---

## 📞 Necesitas Ayuda?

- 📧 Email: contribute@flowvera.com
- 💬 GitHub Discussions: [Haz una pregunta](https://github.com/verbosd-star/flowvera-saas/discussions)
- 📖 Documentación: Consulta los docs en `/docs`

---

## 📝 Licencia

Al contribuir a Flowvera, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto (ver [LICENSE](LICENSE)).

---

## 🙏 Agradecimientos

Gracias a todos los colaboradores que ayudan a hacer Flowvera mejor cada día!

Para ver la lista completa de colaboradores, visita: [Contributors](https://github.com/verbosd-star/flowvera-saas/graphs/contributors)

---

*Última actualización: Enero 2026*

