# 🏛️ UIC Exam Prep

**Simulador de examen de admisión a Medicina — Universitat Internacional de Catalunya**

<p align="center">
  <img src="https://img.shields.io/badge/Preguntas-600-D62828?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Biología-200-2D6A4F?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Química-200-7B2CBF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Matemáticas-200-0077B6?style=for-the-badge" />
</p>

---

## ¿Qué es esto?

Una aplicación web para practicar el examen de admisión de Medicina de la UIC Barcelona. Simula las condiciones reales del examen:

- **100 preguntas** tipo test (45 Bio + 40 Quím + 15 Mat)
- **100 minutos** de tiempo
- **Sin calculadora** — los números son manejables a mano
- **Sin penalización** por respuestas incorrectas

## ✨ Funcionalidades

| Feature | Descripción |
|---------|-------------|
| 📝 **Examen estándar** | Simula el examen real: 100 preguntas, 100 minutos |
| 🔄 **Repaso de errores** | Genera exámenes priorizando las preguntas que fallaste antes |
| ⚙️ **Examen personalizado** | Elige materias, cantidad y temas específicos |
| 📊 **Historial** | Guarda resultados, evolución y temas débiles |
| 🎯 **Análisis de debilidades** | Identifica automáticamente los temas a reforzar |

## 🎨 Diseño

Estilo **constructivismo** — inspirado en El Lissitzky y Rodchenko:
- Colores primarios (rojo, azul, amarillo)
- Formas geométricas bold
- Tipografía potente (Bebas Neue, Oswald, JetBrains Mono)
- Bordes gruesos negros con sombras geométricas

## 🚀 Cómo usar

```bash
npm install
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## 📚 Banco de preguntas

Las 600 preguntas cubren el temario de **1º de Bachillerato** (con algo de 2º en Biología), tal como aparece en el examen real:

### Biología (200)
- Biología celular · Biomoléculas · Genética
- Microbiología · Histología y fisiología humana
- Ecología y evolución · Historia de la biología

### Química (200)
- Estructura atómica · Tabla periódica · Enlace químico
- Formulación y nomenclatura · Estequiometría
- Disoluciones · Termodinámica y cinética · Química orgánica

### Matemáticas (200)
- Álgebra · Funciones · Derivadas · Trigonometría
- Estadística y probabilidad · Geometría analítica
- Límites y continuidad · Logaritmos y exponenciales

## 🛠️ Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4
- LocalStorage para persistencia
- Zero backend — 100% estático, desplegable en GitHub Pages

## 📋 Sobre el examen UIC

El examen de admisión a Medicina de la UIC consta de:

1. **Examen de conocimientos** — 100 preguntas test en 100 min (sin calculadora, sin penalización)
2. **Test de aptitudes emocionales** — perfil psicológico
3. **Entrevista escrita** — comprensión lectora + preguntas abiertas

Esta app cubre la preparación para la parte **A** (conocimientos).

---

*Built with ❤️ para aprobar a la primera.*
