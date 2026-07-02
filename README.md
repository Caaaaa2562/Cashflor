# 💰 Cashflor

Aplicación móvil de finanzas personales desarrollada con React Native + Expo + TypeScript como Trabajo Práctico Integrador de la materia Desarrollo de Aplicaciones para Dispositivos Móviles.

## Descripción

Cashflor permite al usuario llevar un control completo de sus finanzas personales: registrar ingresos y gastos (fijos y variables), visualizar su balance en tiempo real, establecer metas de ahorro y recibir consejos financieros personalizados según su situación.

## Funcionalidades

- Registro e inicio de sesión con usuario y contraseña
- Dashboard con resumen financiero en tiempo real
- CRUD de movimientos (ingresos y gastos, fijos y variables)
- Validaciones en formularios con feedback visual
- Metas de ahorro con barra de progreso y depósitos
- Consejos financieros dinámicos según el balance del usuario
- Persistencia de datos con AsyncStorage

## Tecnologías utilizadas

- React Native con Expo SDK 54
- TypeScript
- React Navigation (Bottom Tabs)
- AsyncStorage
- Context API para manejo de estado global

## Estructura de carpetas

cashflor/
├── App.tsx               → punto de entrada y navegación
├── context/
│   └── FinanzasContext.tsx  → estado global de movimientos
├── screens/
│   ├── BienvenidaScreen.tsx → login y registro
│   ├── DashboardScreen.tsx  → resumen financiero
│   ├── MovimientosScreen.tsx → CRUD de movimientos
│   ├── AhorroScreen.tsx     → metas de ahorro
│   └── ConsejosScreen.tsx   → consejos financieros
└── assets/               → íconos e imágenes

## Instalación y ejecución

1. Clonar el repositorio:
git clone https://github.com/Caaaaa2562/Cashflor.git
2. Instalar dependencias:
cd cashflor
npm install
3. Iniciar el proyecto:
npx expo start
4. Escanear el QR con la app Expo Go en el celular.

## Uso de IA

Durante el desarrollo se utilizó Claude (Anthropic) como asistente para la generación y corrección de código. Todo el código fue revisado, comprendido y adaptado por la desarrolladora.

## Autora

Carla — Desarrollo de Aplicaciones para Dispositivos Móviles