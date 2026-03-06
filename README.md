# DATAMARK

**DATAMARK** es una plataforma **B2B SaaS en etapa MVP** orientada a pequeños negocios de **ropa y calzado en provincias del Perú**, cuyo objetivo es **centralizar y visualizar información clave del negocio** como ventas, inventario y clientes.

El sistema busca reemplazar procesos manuales o desorganizados (cuadernos, planillas aisladas o registros dispersos) por una **solución digital simple basada en datos**, permitiendo a los comerciantes tomar decisiones informadas sin necesidad de conocimientos técnicos.

---

# 📌 Problema

Muchos pequeños negocios del sector retail en provincias gestionan su información mediante:

* Registros manuales
* Archivos dispersos
* Planillas de cálculo sin integración

Esto genera:

* Errores en el registro de ventas
* Falta de control sobre el stock
* Información inconsistente
* Decisiones basadas en intuición
* Pérdidas económicas evitables

DATAMARK busca solucionar este problema mediante una **plataforma simple que centralice los datos del negocio y los presente en dashboards claros**.

---

# 🎯 Objetivo del Proyecto

Desarrollar y validar un **Producto Mínimo Viable (MVP)** de una plataforma SaaS que permita a pequeños comercios:

* Centralizar información de **ventas**
* Gestionar **inventarios**
* Registrar **clientes**
* Visualizar **indicadores clave del negocio**

Todo esto mediante **una interfaz simple e intuitiva**.

---

# 🧩 Características del MVP

El MVP contempla las siguientes funcionalidades principales:

* Visualización de **ventas**
* Control de **inventario**
* Registro de **clientes**
* Visualización de **dashboards con métricas clave**
* Interfaz simple orientada a usuarios no técnicos

---

# 🏗️ Arquitectura del Sistema

El sistema se basa en una **arquitectura de tres capas**:

### 1️⃣ Capa de Presentación

Aplicación web que permite a los usuarios:

* Visualizar dashboards
* Consultar información de ventas
* Gestionar inventario

Tecnologías principales:

* Vue.js
* Vite

---

### 2️⃣ Capa de Lógica de Negocio

API que se encarga de:

* Procesar solicitudes del frontend
* Validar datos
* Aplicar reglas de negocio

---

### 3️⃣ Capa de Datos

Base de datos que centraliza la información del sistema:

* Ventas
* Productos
* Inventarios
* Clientes

---

### 4️⃣ Integración y Automatización

Se implementa una capa de integración continua que incluye:

* Control de versiones con Git
* Automatización de pruebas
* Integración continua

---

# ⚙️ Tecnologías Utilizadas

### Frontend

* JavaScript
* Vue.js
* Vite

### Backend

* Node.js
* API REST

### Base de datos

* Supabase

### Testing

* Jest
* Cypress
* Testing Library

### CI/CD

* Jenkins
* Git

### Deploy

* Vercel (frontend)

---

# 📂 Estructura del Proyecto

```
DATAMARK/
│
├── front-end/          # Aplicación Vue
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── package.json
│
├── backend/            # API del sistema
│
├── docs/               # Documentación adicional
│
└── README.md
```

---

# 🚀 Instalación y Ejecución

## 1 Clonar el repositorio

```
git clone https://github.com/usuario/datamark.git
cd datamark
```

---

## 2 Ejecutar el Frontend

```
cd front-end
npm install
npm run dev
```

La aplicación se ejecutará en:

```
http://localhost:5173
```

---

# 🌐 Deploy

El frontend se encuentra desplegado utilizando **Vercel**.

Cada push al repositorio genera automáticamente un nuevo deploy.

---

# 🧪 Testing

El proyecto incluye diferentes tipos de pruebas:

### Tests unitarios

* Jest

### Tests de interfaz

* Testing Library

### Tests end-to-end

* Cypress

---

# 📊 Metodología de Desarrollo

El desarrollo del proyecto se organizó en **5 semanas**:

### Semana 1

* Definición del problema
* Identificación del usuario objetivo
* Definición de roles del equipo

### Semana 2

* Diseño de arquitectura
* Definición de requerimientos
* Diseño inicial de la base de datos

### Semana 3

* Desarrollo inicial del MVP
* Implementación de base de datos
* Desarrollo de API básica
* Primera versión de la interfaz

### Semana 4

* Integración frontend/backend
* Implementación de pruebas automatizadas
* Integración continua

### Semana 5

* Pruebas finales
* Refinamiento de funcionalidades
* Documentación del proyecto
* Presentación del MVP

---

# 👥 Equipo de Trabajo

| Rol                       | Integrante        |
| ------------------------- | ----------------- |
| PMO                       | Enzo Zambón       |
| CX / UX Designer          | Claudia Rivero    |
| Frontend Engineer         | Franco Kumichel   |
| Backend Engineer          | Francisco Lledo   |
| Data / Analytics Engineer | Gonzalo Sagredo   |
| Data / Analytics Engineer | Johanna Procopio  |
| QA Automation             | Giselle Cifuentes |

---

# 📚 Aprendizajes del Proyecto

Durante el desarrollo del MVP se exploraron diferentes aspectos del ciclo de desarrollo de software:

* Diseño de arquitectura de sistemas
* Desarrollo de aplicaciones web modernas
* Automatización de pruebas
* Integración continua
* Trabajo colaborativo en equipo

El resultado es un **prototipo funcional que demuestra la viabilidad técnica y el valor potencial de la solución**.

---

# 📌 Estado del Proyecto

🚧 **MVP en desarrollo / validación**

El proyecto continúa evolucionando con el objetivo de mejorar funcionalidades, experiencia de usuario y capacidad de análisis de datos.

---

# 📄 Licencia

Este proyecto fue desarrollado con fines **académicos y de aprendizaje** en el marco de una simulación laboral.
