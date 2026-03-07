# StockPro Perú

### Plataforma B2B SaaS para la Gestión Inteligente de Inventarios y Ventas

**StockPro Perú** es una solución SaaS desarrollada por **Datamark** para profesionalizar la gestión de pequeños comercios de **ropa y calzado en las provincias del Perú**.

La plataforma conecta la operación diaria de las tiendas con **herramientas de análisis de datos en la nube**, permitiendo transformar registros manuales o desorganizados en **información clara para la toma de decisiones**.

El sistema centraliza la información del negocio y la presenta mediante **dashboards simples e intuitivos**, permitiendo a los comerciantes comprender el estado de su negocio sin necesidad de conocimientos técnicos.

---

# 🚀 Problema y Solución

## 📉 El Problema

Muchos pequeños comercios del sector minorista gestionan su operación mediante:

- registros manuales  
- planillas aisladas  
- control limitado del inventario  
- baja visibilidad sobre ventas y stock  

Esta situación provoca:

- errores en el registro de información  
- pérdida de control sobre el inventario  
- decisiones basadas en intuición  
- ineficiencias operativas  
- pérdidas económicas evitables  

---

## 💡 Nuestra Solución

**StockPro Perú** ofrece una plataforma digital que centraliza la información clave del negocio y la transforma en **datos accionables**.

Las principales capacidades del sistema son:

### 📦 Centralización de Información

Toda la información del negocio se encuentra integrada en una única plataforma:

- ventas  
- inventario  
- productos  
- clientes  

Esto elimina la dispersión de datos y permite tener una visión completa del negocio.

---

### 🎯 Gestión Precisa de Inventario

El sistema permite gestionar productos a nivel de **variantes**, lo que facilita el control detallado del stock.

Cada producto puede diferenciarse por:

- tallas  
- colores  
- SKU (Stock Keeping Unit)  

Esto permite un control mucho más preciso del inventario real de la tienda.

---

### 📊 Democratización de Datos

La plataforma incorpora **dashboards visuales e intuitivos** que permiten a los comerciantes comprender rápidamente el estado del negocio.

Entre las métricas disponibles se encuentran:

- ventas totales  
- productos más vendidos  
- niveles de stock  
- alertas de stock crítico  

El objetivo es que **cualquier usuario pueda interpretar la información sin conocimientos técnicos**.

---

### 🔍 Trazabilidad de Productos

El sistema permite seguir el recorrido completo de cada producto dentro del negocio: Proveedor → Inventario → Venta → Cliente

Esto mejora la transparencia de la operación y facilita auditorías o revisiones internas.

---

# 🛠️ Stack Tecnológico

## Frontend

Tecnologías utilizadas para construir la interfaz de usuario:

- **Vite + Vue.js**  
  Framework moderno para construir interfaces rápidas, reactivas y escalables.

- **Tailwind CSS**  
  Framework de estilos que permite construir interfaces responsivas y consistentes de manera eficiente.

- **Dashboards Analíticos**  
  Visualización de métricas clave mediante componentes gráficos.

---

## Backend & Datos

Infraestructura encargada de la lógica del sistema y la gestión de datos.

- **NestJS**  
  Framework backend basado en Node.js que permite construir APIs modulares y escalables.

- **Supabase (PostgreSQL)**  
  Plataforma backend que provee base de datos, autenticación y servicios en la nube.

- **Prisma ORM**  
  Herramienta para gestionar el acceso a datos, modelos de base de datos y migraciones.

---

## DevOps & Infraestructura

Herramientas utilizadas para garantizar calidad y estabilidad en el desarrollo.

- **Docker**  
  Permite contenerizar la aplicación para asegurar consistencia entre entornos de desarrollo y producción.

- **Jenkins**  
  Orquestador de integración continua que automatiza pruebas y validaciones del código.

---

## Testing Stack

El proyecto incorpora diferentes tipos de pruebas automatizadas:

- **Jest** → pruebas unitarias  
- **Testing Library** → pruebas de componentes de interfaz  
- **Cypress** → pruebas end-to-end que simulan el comportamiento del usuario  

Esto permite asegurar la calidad del sistema durante su evolución.

---

# 📊 Modelo de Datos

El sistema se basa en un **Snowflake Schema**, un modelo de datos que facilita la organización de información compleja y permite escalar el sistema a medida que crece el negocio.

Las principales áreas del modelo son:

---

## 🔴 Gestión de Identidad

Controla el acceso al sistema mediante:

- usuarios  
- roles  
- sucursales  

Esto permite definir distintos niveles de acceso dentro de la organización.

---

## 🟢 Catálogo Maestro

Organiza la información base de los productos mediante una estructura jerárquica:

- marcas  
- categorías  
- productos  
- variantes  

Este catálogo es la base para el resto de las operaciones del sistema.

---

## 🟣 Núcleo de Inventario

Es el componente central del sistema y se encarga de la gestión del stock.

Incluye:

- control de variantes de producto  
- registro de movimientos de stock  
- historial de inventario (Kardex)  

Esto permite mantener trazabilidad completa del inventario.

---

## 🟠 Ciclo de Ventas

Gestiona las operaciones comerciales del negocio:

- registro de ventas  
- clientes  
- métodos de pago  
- detalle de transacciones  

Cada venta impacta automáticamente en el inventario.

---

## 🔵 Abastecimiento

Módulo que gestiona la relación con proveedores y el ingreso de mercadería al inventario.

Permite:

- registrar proveedores  
- controlar costos de compra  
- registrar entradas de stock  

---

# ⚙️ Pipeline de Integración Continua

El proyecto utiliza **Jenkins** para automatizar procesos de integración continua y garantizar la calidad del código.

El flujo del pipeline es el siguiente:

```
COMMIT
↓
BUILD
↓
TEST
↓
DEPLOY
```

## Etapas del Pipeline

### COMMIT

Cada cambio enviado al repositorio activa automáticamente el pipeline mediante **GitHub Webhooks**.

### BUILD

Se construyen las imágenes Docker necesarias para ejecutar el sistema.

### TEST

Se ejecuta la suite de pruebas automatizadas:

- pruebas unitarias  
- pruebas de integración  
- smoke tests  

Solo si todas las pruebas son exitosas el pipeline continúa.

### DEPLOY

Cuando las validaciones finalizan correctamente, el sistema puede ser desplegado automáticamente al entorno correspondiente.

---

# 📈 Logros del MVP

Durante el desarrollo del MVP se lograron implementar las siguientes capacidades:

- ✅ Centralización de ventas, inventarios y clientes  
- ✅ Implementación de dashboards operativos  
- ✅ Migración de entorno local (Docker) a infraestructura en la nube (Supabase)  
- ✅ Sistema de **Health Checks** para monitoreo del sistema  
- ✅ Base de datos preparada para escalar con el crecimiento del negocio  

---

# 🌐 Enlaces del Proyecto

- [Repositorio del proyecto](https://github.com/No-Country-simulation/S02-26-Equipo-41-Data-Science)
- [Frontend](https://s02-26-equipo-41-data-science.vercel.app/)
- [Backend](https://nocountry-backend-production-4a70.up.railway.app/)
- [Documentación del proyecto](https://docs.google.com/document/d/1y8R8tjP4dwtCEHf75e68zsJ26PesLyWv/edit?usp=drive_link&ouid=112834332168303501124&rtpof=true&sd=true)

---

# 🔮 Futuras Mejoras

El roadmap del proyecto contempla futuras funcionalidades para ampliar las capacidades del sistema.

## 💰 Módulo de Caja

Gestión completa de la operación diaria de caja:

- apertura de caja  
- cierre de caja  
- arqueo diario  

---

## 🧾 Desglose Tributario

Soporte para obligaciones fiscales:

- cálculo automático de IGV  
- generación de reportes tributarios  

---

## 🔐 Seguridad Avanzada

Implementación de un sistema completo de **RBAC (Role-Based Access Control)** para gestionar permisos y accesos por rol.

---

## 🔄 Gestión de Devoluciones

Proceso estructurado para:

- devoluciones  
- cambios de productos  
- auditoría de movimientos de stock  

---

# 👥 Equipo — Datamark

Proyecto desarrollado en el marco de **NoCountry** por:

| Rol | Integrante |
|-----|-----------|
| PMO / QA Automation | Enzo Zambon |
| CX / UX Designer | Claudia Rivero |
| Frontend Engineer | Franco Kumichel |
| Backend Engineer | Francisco Lledo |
| Data & Analytics | Gonzalo Sagredo |
| Data & Analytics | Giselle Cifuentes |
| QA Automation | Johanna Procopio |

---

# 🎯 Visión

> *"Nuestra meta es que cada negocio, sin importar su tamaño, tenga el poder de los datos a su favor."*  
> — **Datamark**
