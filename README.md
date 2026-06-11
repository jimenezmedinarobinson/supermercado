# Sistema de Administración de Supermercado

Sistema integral de gestión para supermercados con arquitectura de tres niveles (Administrador, Gerente de Sucursal, Empleados).

## 📋 Características

- **Gestión de Productos**: Crear, actualizar, eliminar y listar productos
- **Seguimiento de Inventario**: Control de stock en tiempo real
- **Generación de Facturas**: Creación automática de facturas de ventas
- **Autenticación por Niveles**: Admin, Gerente, Empleado
- **Reportes**: Análisis de ventas e inventario

## 🏗️ Arquitectura

```
Frontend (React)
    ↓
Backend (Node.js/Express)
    ↓
Base de Datos (PostgreSQL)
```

## 📁 Estructura del Proyecto

```
supermercado/
├── frontend/          # Aplicación React
├── backend/           # API Node.js/Express
├── database/          # Scripts SQL
└── docs/              # Documentación
```

## 🚀 Inicio Rápido

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📝 Niveles de Acceso

1. **Administrador**: Acceso total al sistema
2. **Gerente de Sucursal**: Gestión de su sucursal
3. **Empleado**: Operaciones básicas de ventas

## 📊 Tecnologías

- **Frontend**: React, Axios, Material-UI
- **Backend**: Node.js, Express, Sequelize
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT

## 📄 Licencia

MIT
