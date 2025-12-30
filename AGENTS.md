Agent Guidelines for SteelMat Front-End
Build/Dev Commands

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- No test suite configured
  Tech Stack
- Astro 5.16+ with Tailwind CSS 4.1+
- TypeScript (strict mode)
- Zod for validation
- Resend for email API
  Code Style
- **Imports**: Use `@/*` path alias for src imports (e.g., `@/components/...`)
- **Components**: Astro components in `.astro` files, organized by page/feature
- **Types**: Use TypeScript with strict mode, prefer `type` over `interface`
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Validation**: Define Zod schemas in `src/validation/` directory
- **API Routes**: Place in `src/pages/api/`, use `prerender = false` for dynamic routes
- **Error Handling**: Use try-catch with typed errors, return JSON responses with status codes
- **Formatting**: 2-space indentation, single quotes for strings
- **Images**: Use Astro's Image component from `astro:assets`, store in `src/assets/`

---

🚀 Plan de Optimización de Performance - Imágenes
**Fecha de análisis:** 29 Diciembre 2025  
**Estado actual:** 83 imágenes WebP, 14MB assets, sin optimización configurada
📊 Métricas Actuales

- **Total imágenes:** 83 WebP
- **Peso total assets:** 14MB
- **Imagen más pesada:** 442KB (SteelMat-hero.webp)
- **Componentes con imágenes:** 27 archivos
- **Sistema actual:** Astro Image component (✅ correcto) + configuración default
  🎯 Objetivos de Mejora
  | Métrica | Actual | Objetivo | Mejora |
  |---------|--------|----------|--------|
  | First Load Desktop | ~3.5 MB | 1.2 MB | -66% |
  | First Load Mobile | ~3.5 MB | 0.8 MB | -77% |
  | LCP Hero | ~2.5s | 1.2s | -52% |
  | Lighthouse Score | 65-75 | 90-95 | +25-30 |

---

📋 Plan de Implementación
FASE 1: Quick Wins (2-3 horas) ⚡
**Prioridad:** ALTA | **Impacto:** ALTO | **Esfuerzo:** BAJO
1.1 Configurar Optimización de Imágenes en Astro
**Archivo:** `astro.config.mjs`
**Cambios:**
export default defineConfig({
output: 'server',
adapter: vercel({
imageService: true, // Habilitar Vercel Image Optimization
}),

// Agregar configuración de imágenes
image: {
service: {
entrypoint: 'astro/assets/services/sharp'
},
remotePatterns: [],
},

// Habilitar responsive images
experimental: {
responsiveImages: true
},

vite: {
// ... resto de config existente
},
});
1.2 Optimizar Ícono de WhatsApp
Archivo: src/components/whatsappicon.astro
Problema actual:

- Usa <img> sin optimización
- Sin dimensiones explícitas (causa CLS)
- Imagen en /public no optimizada
  Solución:

---

import { Image } from 'astro:assets';
import WhatsappIcon from '@/assets/icons/whatsapp.webp'; // Mover de /public a /src/assets

---

<a
href="https://api.whatsapp.com/send/?phone=5493425524299&text&type=phone_number&app_absent=0"
aria-label="Contactar por WhatsApp"

> <Image

    src={WhatsappIcon}
    alt="WhatsApp"
    width={48}
    height={48}
    loading="lazy"
    class="absolute bottom-0 right-4 w-12 h-12 translate-y-1/2"

/>
</a>
Acción requerida:

- Mover /public/icons/whatsapp.webp → /src/assets/icons/whatsapp.webp
  1.3 Optimizar Imágenes Hero (8 componentes)
  Componentes a modificar:
- src/components/homeComponents/hero.astro
- src/components/modelosComponents/essentiaComponents/heroEssentia.astro
- src/components/modelosComponents/habitatComponents/heroHabitat.astro
- src/components/modelosComponents/nativaComponents/heroNativa.astro
- src/components/modelosComponents/seccionPrincipalComponents/heroModelos.astro
- src/components/porQueElegirnosComponents/hero.astro
- src/components/proyectosAMedidasComponents/hero.astro
- src/components/ConsultoriaParaProfesionales/hero.astro
  Patrón actual:
  <Image
    src={HeroImage}
    alt="..."
    loading="eager"
    class="..."
  />
  Patrón optimizado:
  <Image
  src={HeroImage}
  alt="..."
  width={1920}
  height={730}
  loading="eager"
  fetchpriority="high"
  quality={75}
  widths={[640, 750, 828, 1080, 1200, 1920]}
  sizes="100vw"
  class="..."
  />
  Resultado esperado Fase 1:
- ✅ Reducción 30-40% peso inicial
- ✅ Mejora LCP en 0.5-1s
- ✅ Eliminación de CLS
- ✅ Mejor priorización de recursos

---

FASE 2: Responsive Images (4-6 horas) 📱
Prioridad: ALTA | Impacto: MUY ALTO | Esfuerzo: MEDIO
2.1 Configurar Sizes por Tipo de Imagen
Estrategia de calidad:

- Hero images: quality={75}
- Renders/productos: quality={80}
- Carousels decorativos: quality={65}
- Thumbnails: quality={60}
  2.2 Implementar Responsive Widths y Sizes
  Para imágenes full-width (heroes, covers):
  widths={[640, 750, 828, 1080, 1200, 1920]}
  sizes="100vw"
  Para imágenes de contenido (2 columnas en desktop):
  widths={[640, 750, 828, 1080, 1200]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
  Para carousels:
  widths={[640, 828, 1080, 1200]}
  sizes="(max-width: 768px) 100vw, 80vw"
  2.3 Optimizar Componente Carousel
  Archivo: src/components/carrouselComponents.astro
  Cambios:
  <!-- Línea 62-67: Agregar widths y sizes -->
  <Image
  src={it.src as ImageMetadata}
  alt={it.alt ?? ""}
  widths={[640, 828, 1080, 1200]}
  sizes="(max-width: 768px) 100vw, 80vw"
  quality={65}
  loading="lazy"
  decoding="async"
  class={`absolute block w-full h-full ${imgClass} ...`}
  />
  2.4 Componentes a Actualizar (19 archivos)
  Componentes de modelos:
- src/components/modelosComponents/essentiaComponents/renderEssentiaUno.astro
- src/components/modelosComponents/essentiaComponents/renderEssentiaDos.astro
- src/components/modelosComponents/essentiaComponents/renderEssentiaTres.astro
- src/components/modelosComponents/essentiaComponents/descripcionEssentia.astro
- src/components/modelosComponents/habitatComponents/renderHabitat.astro
- src/components/modelosComponents/habitatComponents/descripcionHabitat.astro
- src/components/modelosComponents/nativaComponents/renderNativa.astro
- src/components/modelosComponents/nativaComponents/descripcionNativa.astro
  Componentes de carousels:
- src/components/homeComponents/carrouselModelos.astro
- src/components/homeComponents/carrouselProyectosAMedida.astro
- src/components/modelosComponents/seccionPrincipalComponents/carrousel-modelos/\*
- src/components/porQueElegirnosComponents/carrousels/\*
- src/components/proyectosAMedidasComponents/carrousel/\*
  Otros componentes:
- src/components/homeComponents/consultoriaProfesionales.astro
- src/components/porQueElegirnosComponents/obraGris.astro
- src/components/proyectosAMedidasComponents/SteelFrameIndustrial.astro
- src/components/ConsultoriaParaProfesionales/comoPodemosColaborar.astro
  Resultado esperado Fase 2:
- ✅ Reducción 60-70% peso en móviles
- ✅ Carga inicial < 1MB
- ✅ Mejor experiencia en conexiones lentas
- ✅ Puntuación Lighthouse 85-90

---

FASE 3: Lazy Loading Estratégico (3-4 horas) ⏱️
Prioridad: MEDIA | Impacto: MEDIO | Esfuerzo: MEDIO
3.1 Auditar Below-the-Fold Images
Verificar que tengan loading="lazy":

- Todas las imágenes después del primer viewport
- Imágenes en secciones de contenido
- Imágenes en modales (si existen)
  3.2 Optimizar Carga de Carousels
  Estrategia:
- Primera imagen: loading="eager" (solo si above-the-fold)
- Segunda imagen: loading="eager" (precarga)
- Resto: loading="lazy"
  Considerar: Implementar carga condicional con IntersectionObserver para carousels con muchas imágenes (>5).
  3.3 Agregar Decoding Async
  Agregar decoding="async" a todas las imágenes lazy:
  <Image
    src={image}
    alt="..."
    loading="lazy"
    decoding="async"
  />
  Resultado esperado Fase 3:
- ✅ Reducción 40-50% imágenes en carga inicial
- ✅ Mejor Time to Interactive
- ✅ Menos bloqueo del thread principal

---

FASE 4: Optimizaciones Avanzadas (6-8 horas) 🔮
Prioridad: BAJA | Impacto: MEDIO | Esfuerzo: ALTO
4.1 Soporte Multi-Formato (AVIF + WebP)
<Image
src={image}
alt="..."
formats={['avif', 'webp']}
fallbackFormat="webp"
/>
Beneficio: 20-30% reducción adicional vs solo WebP.
4.2 Preload para Hero Images
Archivo: src/layouts/MainLayout.astro

<head>
  <!-- Preload hero image crítico -->
  <link
    rel="preload"
    as="image"
    href="/path-to-optimized-hero.webp"
    fetchpriority="high"
    imagesrcset="..."
  />
</head>
4.3 Blur Placeholders (LQIP)
Implementar Low Quality Image Placeholders para mejor UX durante carga.
4.4 Preconnect para Recursos Externos
<link rel="preconnect" href="https://openpanel.dev">
<link rel="dns-prefetch" href="https://openpanel.dev">
4.5 Re-optimizar Imágenes Source
Imágenes a revisar (>200KB):
- src/assets/home/SteelMat-hero.webp - 442KB → objetivo 150-200KB
- src/assets/home/proyectosAmedida.webp - 196KB → objetivo 100-150KB
- src/assets/modelos/essentia/hero-essentia.webp - 181KB → objetivo 120-150KB
Herramientas sugeridas:
- Squoosh.app
- Sharp CLI: npx @squoosh/cli --webp quality=75
---
🔍 Issues Identificados por Componente
Críticos
1. whatsappicon.astro:8-12 - Usar <img> sin optimización, sin width/height
2. hero.astro:8 - Sin fetchpriority, sin responsive images
3. carrouselComponents.astro:66 - Sin responsive widths
Medios
4. MainLayout.astro:44 - Script Flowbite cargado globalmente
5. MainLayout.astro:46-56 - Código comentado a limpiar
6. Sin preconnect para dominios externos
---
✅ Checklist de Implementación
Fase 1 - Quick Wins
- [ ] Actualizar astro.config.mjs con configuración de imágenes
- [ ] Mover WhatsApp icon a /src/assets/icons/
- [ ] Reescribir whatsappicon.astro con componente Image
- [ ] Agregar fetchpriority="high" a 8 componentes hero
- [ ] Agregar width, height, quality a heroes
- [ ] Testear build y verificar que genera correctamente
- [ ] Verificar en dev que no hay errores de CLS
Fase 2 - Responsive Images
- [ ] Agregar widths y sizes a 8 componentes hero
- [ ] Actualizar carrouselComponents.astro con responsive config
- [ ] Actualizar 19 componentes restantes con widths apropiados
- [ ] Configurar calidad por tipo de imagen
- [ ] Build y verificar tamaño de assets generados
- [ ] Testear en diferentes viewports (375px, 768px, 1920px)
Fase 3 - Lazy Loading
- [ ] Auditar todas las imágenes below-the-fold
- [ ] Agregar loading="lazy" donde corresponda
- [ ] Agregar decoding="async" a imágenes lazy
- [ ] Optimizar estrategia de carga en carousels
- [ ] Testear con Network throttling (Fast 3G)
Fase 4 - Avanzado (Opcional)
- [ ] Implementar formatos AVIF
- [ ] Agregar preload para hero images
- [ ] Implementar blur placeholders
- [ ] Agregar preconnect tags
- [ ] Re-optimizar imágenes source >200KB
- [ ] Configurar Vercel Image Optimization completo
- [ ] Audit final con Lighthouse
---
📊 Testing y Validación
Métricas a Monitorear
Antes de implementar cada fase:
# Build y verificar tamaño
pnpm build
du -sh dist/
# Lighthouse CI
npx lighthouse https://steelmat.com.ar --view
Métricas clave:
- LCP (Largest Contentful Paint) < 2.5s
- CLS (Cumulative Layout Shift) < 0.1
- FCP (First Contentful Paint) < 1.8s
- Total Blocking Time < 200ms
- Lighthouse Performance Score > 90
Testing Manual
Viewports a testear:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full HD)
Conexiones a testear:
- Fast 3G (DevTools throttling)
- Slow 4G
- Desktop (sin throttling)
Comandos Útiles
# Ver tamaño de imágenes optimizadas después del build
find dist/_astro -name "*.webp" -exec ls -lh {} \;
# Verificar que srcset se generó correctamente
grep -r "srcset" dist/home/home.html
# Analizar bundle size
npx vite-bundle-visualizer
---
📚 Referencias
- Astro Images Guide (https://docs.astro.build/en/guides/images/)
- Vercel Image Optimization (https://vercel.com/docs/image-optimization)
- Web.dev Image Performance (https://web.dev/fast/#optimize-your-images)
- Core Web Vitals (https://web.dev/vitals/)
- Responsive Images Guide (https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
---
🎯 Resultado Final Esperado
Después de implementar las 3 fases principales:
- ✅ Performance Score: 90-95 (Lighthouse)
- ✅ LCP: < 1.5s (desde ~2.5s)
- ✅ CLS: < 0.05 (desde ~0.15)
- ✅ First Load: < 1MB mobile, < 1.5MB desktop
- ✅ Imágenes optimizadas: Reducción 60-70% en peso
- ✅ Core Web Vitals: Todos en verde
- ✅ User Experience: Carga perceptiblemente más rápida
Última actualización: 29 Diciembre 2025
---
¿Te parece bien este formato para el AGENTS.md? Incluye:
- ✅ Todo el plan de acción estructurado por fases
- ✅ Ejemplos de código específicos
- ✅ Checklists ejecutables
- ✅ Métricas y testing
- ✅ Referencias a archivos específicos con números de línea
- ✅ Comandos útiles para validar
¿Quieres que agregue, modifique o quite algo antes de guardarlo?