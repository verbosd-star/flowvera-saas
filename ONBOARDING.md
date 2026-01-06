# Flujo de activación

## Requisitos previos
- Asegúrate de tener la aplicación corriendo en tu entorno local
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Paso 1: Registro sencillo
- Visita http://localhost:3000
- Haz clic en "Get Started" o "Create Account"
- Completa el formulario de registro con:
  - Nombre y apellido
  - Correo electrónico
  - Contraseña (mínimo 8 caracteres)
  - Confirmación de contraseña
- Haz clic en "Create Account"
- Serás redirigido automáticamente al Dashboard

## Paso 2: Bienvenida al Dashboard
- Visualiza tu información de usuario
- Conoce las tres áreas principales:
  - **Projects**: Gestión de proyectos estilo Monday
  - **CRM**: Gestión de contactos y empresas
  - **Settings**: Configuración de perfil y contraseña

## Paso 3: Creación del primer proyecto
- Navega a la sección "Projects" o visita http://localhost:3000/projects
- Haz clic en "Create New Project"
- Ingresa:
  - Nombre del proyecto
  - Descripción breve
- Haz clic en "Create Project"
- Accede al proyecto para ver el tablero de tareas

## Paso 4: Gestión de tareas
- Dentro del proyecto, visualiza las columnas:
  - To Do
  - In Progress
  - In Review
  - Done
- Crea tu primera tarea haciendo clic en "Add Task"
- Completa los detalles de la tarea
- Arrastra y suelta tareas entre columnas para cambiar su estado

## Paso 5: Configuración del CRM
- Navega a la sección "CRM" o visita http://localhost:3000/crm
- Explora dos opciones:
  - **Contacts** (http://localhost:3000/crm/contacts): Gestión de contactos individuales
  - **Companies** (http://localhost:3000/crm/companies): Gestión de empresas
- Crea tu primer contacto con:
  - Información básica (nombre, email, teléfono)
  - Tipo de contacto (Lead, Prospect, Client)
  - Asociación con empresa (opcional)
- Crea tu primera empresa con:
  - Nombre y detalles
  - Industria y tamaño
  - Lista de contactos asociados

## Paso 6: Configuración de Usuario
- Navega a "Settings" o visita http://localhost:3000/settings
- Explora dos secciones:
  - **Profile** (Perfil): Actualiza tu nombre y apellido
  - **Password** (Contraseña): Cambia tu contraseña de forma segura
- Actualiza tu información de perfil:
  - Primer nombre (First Name)
  - Apellido (Last Name)
  - El email no se puede cambiar por seguridad
- Cambia tu contraseña:
  - Ingresa tu contraseña actual
  - Ingresa nueva contraseña (mínimo 8 caracteres)
  - Confirma la nueva contraseña
- Los cambios se guardan automáticamente

## Paso 7: Flujo de trabajo diario
- Revisa tu Dashboard para ver un resumen
- Actualiza el estado de tus tareas en Projects
- Gestiona la información de clientes en CRM
- Mantén tu perfil actualizado en Settings
- Invita a miembros del equipo (próximamente)
- Explora funciones de reportes y análisis (próximamente)

## Próximos pasos
- **Suscripción**: Selecciona un plan (Básico $10/mes o Premium $30/mes)
- **Colaboración**: Invita a tu equipo a colaborar
- **Personalización**: Configura tu workspace según tus necesidades
- **Integraciones**: Conecta con tus herramientas favoritas (próximamente)

## Recursos adicionales
- Consulta la [documentación de autenticación](docs/AUTHENTICATION.md)
- Revisa el [roadmap del producto](ROADMAP.md)
- Lee la [guía de contribución](CONTRIBUTING.md)
