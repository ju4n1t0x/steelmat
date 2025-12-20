/**
 * Configuración centralizada de EmailJS
 * 
 * IMPORTANTE: No subas estas credenciales a repositorios públicos.
 * Usa variables de entorno en producción.
 * 
 * Para obtener estas credenciales:
 * 1. Regístrate en https://www.emailjs.com/
 * 2. Crea un servicio de email (Gmail, Outlook, etc.)
 * 3. Crea templates para cada tipo de formulario
 * 4. Obtén tu Public Key desde la sección "Account"
 */

export const EMAIL_CONFIG = {
  // Tu Public Key de EmailJS (antes llamado User ID)
  publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY,
  
  // Service ID (el servicio de email que configuraste)
  serviceId: import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
  
  // Template IDs para cada tipo de formulario
  templates: {
    cotizacion: import.meta.env.PUBLIC_EMAILJS_TEMPLATE_COTIZACION,
    capacitaciones: import.meta.env.PUBLIC_EMAILJS_TEMPLATE_CAPACITACIONES,
  }
};
