# SteelMat - Soluciones en Steel Frame

SteelMat es una aplicación web moderna diseñada para presentar soluciones constructivas en Steel Frame, ofreciendo información sobre modelos de viviendas, proyectos a medida, consultoría para profesionales y capacitaciones.

El proyecto está construido con un enfoque en el rendimiento, la modularidad y una experiencia de usuario fluida, utilizando las últimas tecnologías web.

## 🚀 Tecnologías y Librerías

Este proyecto utiliza un stack tecnológico moderno y eficiente:

- **[Astro](https://astro.build/) (v5.x):** Framework web principal enfocado en el rendimiento y la entrega de menos JavaScript al cliente.
- **[Tailwind CSS](https://tailwindcss.com/) (v4.x):** Framework de CSS utilitario para un diseño rápido, responsivo y altamente personalizable.
- **[Flowbite](https://flowbite.com/):** Biblioteca de componentes UI basada en Tailwind CSS para elementos interactivos como carruseles y formularios.
- **[@midudev/tailwind-animations](https://www.npmjs.com/package/@midudev/tailwind-animations):** Colección de animaciones listas para usar integradas con Tailwind.

## 📂 Estructura del Proyecto

La estructura del proyecto sigue las convenciones de Astro, organizada para facilitar el desarrollo y mantenimiento:

```
src/
├── assets/        # Recursos estáticos como imágenes, fuentes y videos optimizados por Astro.
├── components/    # Componentes reutilizables de la interfaz (UI).
│   ├── capacitacionesComponents/
│   ├── carrouselComponents.astro
│   ├── ConsultoriaParaProfesionales/
│   ├── essentiaComponents/
│   ├── homeComponents/
│   ├── modelosComponents/
│   ├── nativaComponents/
│   ├── navBar.astro
│   ├── porQueElegirnosComponents/
│   ├── proyectosAMedidasComponents/
│   └── ...
├── layouts/       # Plantillas principales que envuelven las páginas (ej. MainLayout).
├── pages/         # Rutas de la aplicación. Cada archivo aquí es una página accesible.
│   ├── index.astro
│   ├── home/
│   ├── modelos/
│   ├── proyectos-a-medida/
│   ├── consultoria-para-profesionales/
│   └── ...
└── styles/        # Archivos CSS globales y configuraciones de estilos.
```

## 🛠️ Instalación y Ejecución

Para ejecutar este proyecto localmente, asegúrate de tener instalado Node.js y pnpm (o npm/yarn).

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd SteelMat/front-end
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

4. **Construir para producción:**
   ```bash
   npm run build
   ```

## ✨ Características Principales

- **Diseño Responsivo:** Adaptado a dispositivos móviles y de escritorio.
- **Navegación Intuitiva:** Estructura clara con secciones definidas para cada servicio.
- **Componentes Interactivos:** Carruseles de imágenes, formularios de contacto y menús dinámicos.
- **Optimización de Recursos:** Carga eficiente de imágenes y fuentes gracias a Astro.

---
Desarrollado por [Tu Nombre/Equipo]
