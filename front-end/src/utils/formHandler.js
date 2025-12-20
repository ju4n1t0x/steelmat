import emailjs from '@emailjs/browser';

export class FormHandler {
  constructor(config = {}) {
    this.serviceId = config.serviceId;
    this.templateId = config.templateId;
    this.publicKey = config.publicKey;

    // Inicializar EmailJS si tenemos publicKey
    if (this.publicKey) {
      emailjs.init(this.publicKey);
      console.log('✅ EmailJS inicializado con Public Key:', this.publicKey.substring(0, 10) + '...');
    } else {
      console.error('❌ EmailJS publicKey no configurado');
    }
  }

  async setupForm(formId, schema, options = {}) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error(`❌ Formulario con ID "${formId}" no encontrado`);
      return;
    }

    console.log(`✅ Formulario "${formId}" configurado correctamente`);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');

      try {
        // 1. Limpiar errores previos
        this.clearErrors(form);

        // 2. Obtener datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Agregar fecha actual en formato legible
        data.fecha = new Date().toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        console.log('📋 Datos capturados del formulario:');
        console.table(data);
        console.log('JSON:', JSON.stringify(data, null, 2));

        // 3. Validar con Zod
        const result = schema.safeParse(data);

        if (!result.success) {
          console.error('❌ Errores de validación:', result.error.format());
          this.showErrors(form, result.error);
          return;
        }

        console.log('✅ Validación exitosa');
        console.log('📧 Datos que se enviarán a EmailJS:');
        console.table(result.data);
        console.log('JSON:', JSON.stringify(result.data, null, 2));

        // 4. Deshabilitar botón
        this.setLoadingState(submitButton, true);

        // 5. Preparar configuración
        const serviceId = options.serviceId || this.serviceId;
        const templateId = options.templateId || this.templateId;

        if (!serviceId || !templateId) {
          throw new Error('EmailJS serviceId o templateId no configurados');
        }

        console.log('🔧 Configuración EmailJS:');
        console.log('  - Service ID:', serviceId);
        console.log('  - Template ID:', templateId);
        console.log('  - Public Key:', this.publicKey?.substring(0, 10) + '...');
        
        console.log('\n🚀 Enviando a EmailJS con estos datos:');
        console.log(JSON.stringify(result.data, null, 2));

        // 6. Enviar con EmailJS
        const response = await emailjs.send(
          serviceId,
          templateId,
          result.data
        );

        console.log('✅ Email enviado exitosamente!');
        console.log('Respuesta de EmailJS:', response);

        // 7. Mostrar éxito
        if (options.onSuccess) {
          await options.onSuccess(result.data, form);
        } else {
          this.showSuccess(
            options.successMessage || '¡Formulario enviado con éxito! Nos pondremos en contacto pronto.'
          );
          form.reset();
        }

      } catch (error) {
        console.error('❌ Error al enviar email:', error);
        console.error('Detalles del error:', {
          message: error.message,
          status: error.status,
          text: error.text
        });
        this.showError(
          options.errorMessage || 'Hubo un error al enviar el formulario. Por favor, intenta nuevamente.'
        );
      } finally {
        this.setLoadingState(submitButton, false);
      }
    });
  }

  clearErrors(form) {
    // Remover mensajes de error
    form.querySelectorAll('.form-error').forEach((el) => el.remove());

    // Remover bordes rojos y restaurar grises
    form.querySelectorAll('.border-red-500').forEach((el) => {
      el.classList.remove('border-red-500');
      el.classList.add('border-gray-300');
    });
  }

  showErrors(form, zodError) {
    const errors = zodError.flatten().fieldErrors;

    Object.entries(errors).forEach(([fieldName, messages]) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        // Agregar borde rojo
        field.classList.remove('border-gray-300');
        field.classList.add('border-red-500');

        // Crear mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error text-red-500 text-sm mt-1';
        errorDiv.textContent = messages[0];

        // Insertar después del campo
        if (field.type === 'radio') {
          const fieldset = field.closest('fieldset');
          if (fieldset && !fieldset.querySelector('.form-error')) {
            fieldset.appendChild(errorDiv);
          }
        } else {
          field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
      }
    });
  }

  setLoadingState(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'Enviando...';
      button.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Enviar';
      button.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }

  showSuccess(msg) {
    // simple default: alert
    alert(msg);
  }

  showError(msg) {
    alert(msg);
  }
}
