# 🚀 Guía Final: Probar los Formularios

## ✅ Lo que ya está hecho:

1. ✅ `formHandler.js` actualizado con logging detallado
2. ✅ `.env` configurado con tus credenciales
3. ✅ `.env.example` creado como documentación
4. ✅ `.gitignore` protege tu `.env`
5. ✅ Formularios con validación Zod configurados

---

## 🔧 Lo que DEBES hacer ahora en EmailJS:

### **IMPORTANTE: Cambiar las variables en los templates**

En ambos templates de EmailJS, debes cambiar `{{nombre}}` por `{{nombreApellido}}` porque así se llama el campo en el formulario.

### **Template: solicitudCapacitacion**

1. Ve a https://dashboard.emailjs.com/admin/templates
2. Selecciona el template `solicitudCapacitacion`
3. En el **Subject**, cambia:
   ```
   📚 Nueva Solicitud de Capacitación - {{nombreApellido}}
   ```

4. En el **Content (HTML)**, busca y reemplaza **TODAS** las apariciones:
   - `{{nombre}}` → `{{nombreApellido}}`

5. Guarda los cambios

### **Template: solicitudCotizacion**

1. Selecciona el template `solicitudCotizacion`
2. En el **Subject**, cambia:
   ```
   🏠 Nueva Cotización de {{nombreApellido}} - {{ubicacion}}
   ```

3. En el **Content (HTML)**, busca y reemplaza **TODAS** las apariciones:
   - `{{nombre}}` → `{{nombreApellido}}`

4. Guarda los cambios

---

## 🧪 Cómo probar:

### Paso 1: Reiniciar el servidor
```bash
# Detén el servidor (Ctrl+C si está corriendo)
npm run dev
```

### Paso 2: Abrir la consola del navegador
1. Abre tu navegador
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**

### Paso 3: Probar un formulario
1. Navega a `/capacitaciones` o `/solicitar-cotizacion`
2. Llena el formulario con datos de prueba
3. Haz clic en **Enviar**

### Paso 4: Revisar los logs en consola
Deberías ver algo como:

```
✅ EmailJS inicializado con Public Key: fBASP7Avdg...
✅ Formulario "form-capacitaciones" configurado correctamente
📋 Datos capturados del formulario: {nombreApellido: "Juan", email: "...", ...}
✅ Validación exitosa
📧 Datos que se enviarán a EmailJS: {...}
🔧 Configuración EmailJS: {serviceId: "ju4n1t0x", templateId: "solicitudCapacitacion", ...}
✅ Email enviado exitosamente: {...}
```

### Paso 5: Revisar tu email
- El email debe llegar con todos los datos completos
- Los nombres de campo deben mostrarse correctamente
- La fecha debe estar en formato legible

---

## ❌ Si algo falla:

### Error: "Email enviado pero llega vacío"
**Causa:** Las variables en el template de EmailJS no coinciden con los nombres de los campos.

**Solución:** Verifica que en EmailJS uses exactamente:
- `{{nombreApellido}}` (NO `{{nombre}}`)
- `{{email}}`
- `{{telefono}}`
- `{{ubicacion}}` (solo cotización)
- `{{terreno}}` (solo cotización)
- `{{metros}}` (solo cotización)
- `{{proyecto}}` (solo cotización)
- `{{comentarios}}` (solo cotización)
- `{{fecha}}` (se agrega automáticamente)

### Error: "EmailJS serviceId/templateId no configurados"
**Causa:** Variables de entorno no cargadas.

**Solución:**
1. Verifica que `.env` tenga los valores correctos
2. Reinicia el servidor (`npm run dev`)
3. Asegúrate de que las variables empiecen con `PUBLIC_`

### Error en consola: "import.meta.env.PUBLIC_... is undefined"
**Causa:** Variables no definidas o mal nombradas.

**Solución:**
1. Abre `.env` y verifica los nombres:
   - `PUBLIC_EMAILJS_PUBLIC_KEY`
   - `PUBLIC_EMAILJS_SERVICE_ID`
   - `PUBLIC_EMAILJS_TEMPLATE_COTIZACION`
   - `PUBLIC_EMAILJS_TEMPLATE_CAPACITACIONES`
2. Reinicia el servidor completamente

---

## 📧 Mapeo de Variables

### Formulario → EmailJS

**Capacitaciones:**
| Campo HTML | Variable EmailJS |
|------------|------------------|
| `name="nombreApellido"` | `{{nombreApellido}}` |
| `name="email"` | `{{email}}` |
| `name="telefono"` | `{{telefono}}` |
| (automático) | `{{fecha}}` |

**Cotización:**
| Campo HTML | Variable EmailJS |
|------------|------------------|
| `name="nombreApellido"` | `{{nombreApellido}}` |
| `name="email"` | `{{email}}` |
| `name="telefono"` | `{{telefono}}` |
| `name="ubicacion"` | `{{ubicacion}}` |
| `name="terreno"` | `{{terreno}}` |
| `name="metros"` | `{{metros}}` |
| `name="proyecto"` | `{{proyecto}}` |
| `name="comentarios"` | `{{comentarios}}` |
| (automático) | `{{fecha}}` |

---

## 🎯 Checklist Final

- [ ] En EmailJS, cambié `{{nombre}}` por `{{nombreApellido}}` en ambos templates
- [ ] Guardé los cambios en EmailJS
- [ ] Reinicié el servidor (`npm run dev`)
- [ ] Probé el formulario con la consola abierta (F12)
- [ ] Vi los logs de debug en la consola
- [ ] Recibí el email con los datos completos

---

## 💡 Tips

1. **Modo debug permanente:** Los logs en consola te ayudarán a diagnosticar problemas siempre
2. **Test rápido:** Usa "Send Test" en EmailJS dashboard para probar los templates con datos de ejemplo
3. **Revisa SPAM:** Los primeros emails pueden caer ahí hasta que marques como "No es spam"
4. **Límite gratuito:** 200 emails/mes en el plan gratuito de EmailJS

---

¡Todo listo! 🚀 Ahora prueba los formularios siguiendo los pasos de arriba.
