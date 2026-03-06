🇵🇪 StockPro Perú
Plataforma B2B SaaS para la Gestión Inteligente de Inventarios y Ventas

StockPro Perú es una solución integral desarrollada por Datamark para profesionalizar el sector minorista de ropa y calzado en las provincias del Perú.

La plataforma conecta la operación física de las tiendas con inteligencia de datos en la nube, transformando registros manuales en decisiones estratégicas basadas en datos.

👥 Equipo — Datamark

Proyecto desarrollado para NoCountry por:

Rol	Integrante
PMO / QA Automation	Enzo Zambon
CX / UX Designer	Claudia Rivero
Frontend Engineer	Franco Kumichel
Backend Engineer	Francisco Lledo
Data & Analytics	Gonzalo Sagredo
Data & Analytics	Giselle Cifuentes
QA Automation	Johanna Procopio
🚀 Problema y Solución
El Problema

Muchos pequeños comercios en provincias operan con:

registros manuales

control limitado de inventario

poca visibilidad sobre ventas

decisiones sin datos

Esto genera pérdidas económicas, falta de control y baja eficiencia operativa.

Nuestra Solución

StockPro Perú ofrece:

📦 Centralización

Toda la información del negocio en una única plataforma.

🎯 Control Milimétrico

Gestión por variantes de producto:

tallas

colores

SKUs

📊 Democratización de Datos

Dashboards intuitivos para que cualquier comerciante pueda entender su negocio sin conocimientos técnicos.

🔍 Trazabilidad Total

Auditoría completa de cada unidad:
Proveedor → Inventario → Venta → Cliente

🛠️ Stack Tecnológico
Frontend

Vite + React
Interfaz moderna, rápida y reactiva.

Tailwind CSS
Framework de estilos ágil y responsivo.

Dashboards Analíticos
Visualización de métricas clave como:

ventas totales

productos más vendidos

stock crítico

Backend & Datos

NestJS
Arquitectura modular y escalable para el backend.

Supabase (PostgreSQL)
Base de datos, autenticación y almacenamiento en la nube.

Prisma ORM
Gestión de modelos de datos y migraciones.

DevOps & Calidad (CI/CD)

Jenkins
Orquestación de pipelines de integración continua.

Docker
Contenerización para garantizar paridad entre entornos.

Testing Stack

Jest → pruebas unitarias

Testing Library → pruebas de componentes

Cypress → pruebas end-to-end

📊 Modelo de Datos

El sistema utiliza un Snowflake Schema para garantizar escalabilidad y consistencia del negocio.

🔴 Gestión de Identidad

Control de acceso basado en:

sucursales

roles de usuario

🟢 Catálogo Maestro

Organización jerárquica de productos:

marcas

categorías

🟣 Núcleo de Inventario

El corazón del sistema:

gestión de variantes

movimientos de stock

Kardex

🟠 Ciclo de Ventas

Registro de:

transacciones

clientes

métodos de pago

🔵 Abastecimiento

Relación con proveedores y control de costos.

⚙️ Pipeline de Integración Continua

El pipeline automatizado en Jenkins actúa como garante de calidad del código.

COMMIT
   ↓
BUILD
   ↓
TEST
   ↓
DEPLOY
Etapas

COMMIT

Activación automática vía GitHub Webhooks

BUILD

Construcción de imágenes Docker

TEST

Ejecución de:

tests unitarios

tests de integración

smoke tests

DEPLOY

Despliegue automático cuando todos los tests pasan exitosamente

📈 Logros del MVP

✅ Centralización de ventas, inventarios y clientes

✅ Implementación de dashboards operativos

✅ Migración de entorno local (Docker) a la nube (Supabase)

✅ Sistema de Health Checks en tiempo real

✅ Base de datos escalable para crecimiento del negocio

🔮 Futuras Mejoras
💰 Módulo de Caja

apertura de caja

cierre de caja

arqueo diario

🧾 Desglose Tributario

cálculo automático de IGV

cumplimiento fiscal

🔐 Seguridad Avanzada

Sistema RBAC (Role-Based Access Control)

🔄 Gestión de Devoluciones

Proceso formal para:

devoluciones

cambios

auditoría de stock

🎯 Visión

"Nuestra meta es que cada negocio, sin importar su tamaño, tenga el poder de los datos a su favor."

— Datamark
