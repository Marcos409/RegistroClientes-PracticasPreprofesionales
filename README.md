🐔 Plataforma de Gestión de Clientes - Empresa Avícola Huancayo
Desarrollo Full Stack | Prácticas Preprofesionales

Este software ha sido diseñado para centralizar y optimizar el registro de clientes de la Empresa Avícola Huancayo. La solución permite un control exhaustivo de los datos, garantizando integridad y seguridad mediante un análisis profundo de código y pruebas de calidad.

🚀 Funcionalidades del Software
Gestión de Clientes: Registro, edición y visualización de perfiles (DNI, RUC, contacto, zona).

Validación Inteligente: Lógica de negocio para asegurar que el DNI (8 dígitos) y RUC (11 dígitos) sean correctos.

Buscador Avanzado: Filtrado de clientes en tiempo real para optimizar la atención.

Seguridad: Protección contra inyecciones SQL mediante consultas parametrizadas.

Mantenibilidad: Código analizado cuantitativamente para reducir la complejidad.

🛠️ Stack Tecnológico
Frontend
React: Interfaz modular, dinámica y reutilizable.

Axios: Gestión eficiente de peticiones HTTP al servidor.

Bootstrap (React): Diseño adaptativo (responsive) y estilizado.

Backend
Node.js: Entorno de ejecución de alto rendimiento.

Express: Framework para la creación de la API RESTful.

PostgreSQL: Base de datos relacional robusta.

Sequelize: ORM para la interacción segura y estructurada con los datos.

Herramientas y Metodología
Control de Versiones: Git + GitHub.

Análisis Técnico: SciTools Understand (Análisis cuantitativo de complejidad).

Gestión de Tareas: Trello (Organización bajo flujo Kanban).

Metodología: Modelo Incremental (entregas funcionales por etapas).

🛡️ Calidad y Pruebas (QA)
Se aplicó un enfoque de Caja Blanca / Pruebas Dirigidas:

Pruebas Unitarias: Validación de lógica en el backend con Jest/Mocha.

Análisis Cuantitativo: Uso de Understand para medir métricas de complejidad ciclomática y acoplamiento.

Auditoría de Seguridad: Verificación de parámetros en Sequelize para blindar la base de datos PostgreSQL.

⚙️ Cómo levantar el Software (Instalación)
1. Requisitos Previos
Node.js instalado.

PostgreSQL configurado y corriendo.

Git instalado.

2. Configuración de la Base de Datos
Crea una base de datos en PostgreSQL llamada avicola_huancayo.

Configura las credenciales en el archivo .env del backend (DB_USER, DB_PASSWORD, DB_HOST).
