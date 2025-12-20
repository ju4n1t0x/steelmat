# Configuración de EmailJS para los Formularios

Este proyecto usa EmailJS para enviar emails desde el frontend sin necesidad de un servidor backend.

## Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS
- Registrate en [https://www.emailjs.com/](https://www.emailjs.com/)
- Es gratis hasta 200 emails por mes

### 2. Conectar tu servicio de email
- En el dashboard, ve a **Email Services**
- Click en **Add New Service**
- Elige tu proveedor (Gmail, Outlook, etc.)
- Sigue las instrucciones para conectarlo
- **Guarda el Service ID** que aparece

### 3. Crear templates para cada formulario

#### Template para Cotizaciones
1. Ve a **Email Templates** → **Create New Template**
2. Usa este contenido:

**Subject:** Nueva Solicitud de Cotización - {{nombreApellido}}

**Content:**
```
Nueva solicitud de cotización recibida:

Nombre y Apellido: {{nombreApellido}}
Email: {{email}}
Teléfono: {{telefono}}
Ubicación: {{ubicacion}}

¿Tiene terreno?: {{terreno}}
Metros cuadrados deseados: {{metros}}
¿Tiene proyecto?: {{proyecto}}

Comentarios adicionales:
{{comentarios}}

---
Fecha de envío: {{fecha}}
```

3. **Guarda el Template ID**

#### Template para Capacitaciones
1. Crea otro template
2. Usa este contenido:

**Subject:** Nueva Inscripción a Capacitaciones - {{nombreApellido}}

**Content:**
```
Nueva persona interesada en capacitaciones:

Nombre y Apellido: {{nombreApellido}}
Email: {{email}}
Teléfono: {{telefono}}

---
Fecha de envío: {{fecha}}
```

3. **Guarda el Template ID**

### 4. Obtener tu Public Key
- Ve a **Account** en el menú
- Copia tu **Public Key** (también llamado User ID)

### 5. Actualizar la configuración en el proyecto

Abrí el archivo `src/utils/emailConfig.js` y reemplazá los placeholders:

```javascript
export const EMAIL_CONFIG = {
  publicKey: 'TU_PUBLIC_KEY_AQUI',  // ← El Public Key de la sección Account
  serviceId: 'TU_SERVICE_ID_AQUI',   // ← El Service ID del paso 2
  templates: {
    cotizacion: 'TU_TEMPLATE_ID_COTIZACION',      // ← Template ID del paso 3
    capacitaciones: 'TU_TEMPLATE_ID_CAPACITACIONES', // ← Template ID del paso 3
  }
};
```

### 6. Probar los formularios

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Navega a las páginas con formularios:
   - `/solicitar-cotizacion` - Formulario de cotización
   - `/capacitaciones` - Formulario de capacitaciones

3. Llena y envía un formulario de prueba
4. Revisa tu email para confirmar que llegó correctamente

## Seguridad en Producción

⚠️ **IMPORTANTE**: El Public Key de EmailJS es seguro exponer en el frontend, pero para mayor seguridad puedes:

1. Usar variables de entorno de Astro:
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega: `PUBLIC_EMAILJS_KEY=tu_key_aqui`
   - En `emailConfig.js` usa: `import.meta.env.PUBLIC_EMAILJS_KEY`

2. Habilitar reCAPTCHA en EmailJS (recomendado):
   - Ve a **Security** en tu cuenta de EmailJS
   - Activa reCAPTCHA para prevenir spam

## Estructura del Sistema de Formularios

```
src/utils/
├── formHandler.js          # Clase genérica para manejar formularios
├── validationSchemas.js    # Schemas de validación Zod
└── emailConfig.js          # Configuración de EmailJS

src/components/
├── solicitarCotizacion/
│   └── formularioCotizacion.astro    # Formulario con validación integrada
└── capacitacionesComponents/
    └── formularioCapacitaciones.astro # Formulario con validación integrada
```

## Validaciones Implementadas

### Formulario de Cotización
- ✅ Nombre y apellido (mínimo 3 caracteres)
- ✅ Email válido
- ✅ Teléfono (solo números, espacios, paréntesis, guiones)
- ✅ Ubicación (ciudad y provincia)
- ✅ Selección obligatoria: ¿Tiene terreno?
- ✅ Metros cuadrados (solo números)
- ✅ Selección obligatoria: ¿Tiene proyecto?
- ✅ Comentarios (opcional)

### Formulario de Capacitaciones
- ✅ Nombre y apellido (mínimo 3 caracteres)
- ✅ Email válido
- ✅ Teléfono (solo números, espacios, paréntesis, guiones)

## Troubleshooting

### Error: "EmailJS serviceId/templateId no configurados"
- Verificá que hayas actualizado `emailConfig.js` con tus credenciales reales

### Los emails no llegan
- Revisá la consola del navegador para ver errores
- Verificá que el servicio de email esté correctamente conectado en EmailJS
- Asegurate de no haber superado el límite mensual (200 emails en plan gratuito)
- Revisa la carpeta de spam

### Errores de validación no se muestran
- Abrí la consola del navegador (F12)
- Verificá que los atributos `name` de los inputs coincidan con los del schema de validación

## Soporte

Para más información, consultá la documentación oficial:
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Zod Documentation](https://zod.dev/)
