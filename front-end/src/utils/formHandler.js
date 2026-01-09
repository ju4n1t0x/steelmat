/**
 * FormHandler with reCAPTCHA v2 Invisible + Cooldown (localStorage) + Anti-double-submit
 */

const COOLDOWN_KEY = 'steelmat_form_cooldown';
const COOLDOWN_DURATION_MS = 40 * 1000; // 40 seconds

// Error messages in Spanish (Argentina)
const ERROR_MESSAGES = {
  captcha_failed: 'No pudimos verificar que sos una persona real. Por favor, intentá de nuevo.',
  captcha_expired: 'La verificación expiró. Por favor, intentá enviar el formulario nuevamente.',
  captcha_missing: 'Hubo un problema con la verificación. Recargá la página e intentá de nuevo.',
  cooldown_active: 'Por favor, esperá antes de enviar otro formulario.',
  rate_limited: 'Demasiados envíos. Por favor, esperá un momento antes de intentar de nuevo.',
  network_error: 'Error de conexión. Verificá tu internet e intentá de nuevo.',
  server_error: 'Hubo un error al enviar el formulario. Por favor, intentá nuevamente.',
};

export class FormHandler {
  constructor(config = {}) {
    this.serviceId = config.serviceId;
    this.templateId = config.templateId;
    this.publicKey = config.publicKey;
    this.recaptchaWidgets = new Map(); // formId -> widgetId
  }

  /**
   * Check if cooldown is active (persisted in localStorage)
   */
  isCooldownActive() {
    try {
      const cooldownEnd = localStorage.getItem(COOLDOWN_KEY);
      if (!cooldownEnd) return false;
      
      const endTime = parseInt(cooldownEnd, 10);
      if (Date.now() < endTime) {
        return true;
      }
      // Cooldown expired, clean up
      localStorage.removeItem(COOLDOWN_KEY);
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Start cooldown timer (persisted in localStorage)
   */
  startCooldown() {
    try {
      const endTime = Date.now() + COOLDOWN_DURATION_MS;
      localStorage.setItem(COOLDOWN_KEY, endTime.toString());
    } catch {
      // localStorage not available, continue without persistence
    }
  }

  /**
   * Update button state based on cooldown
   */
  updateButtonCooldownState(button, isInCooldown) {
    if (!button) return;

    if (isInCooldown) {
      button.disabled = true;
      button.classList.add('opacity-75', 'cursor-not-allowed');
      button.setAttribute('title', ERROR_MESSAGES.cooldown_active);
    } else {
      button.disabled = false;
      button.classList.remove('opacity-75', 'cursor-not-allowed');
      button.removeAttribute('title');
    }
  }

  /**
   * Initialize reCAPTCHA widget for a form
   */
  initRecaptcha(form, siteKey, onSuccess) {
    // Check if grecaptcha is loaded
    if (typeof grecaptcha === 'undefined') {
      console.error('❌ reCAPTCHA not loaded');
      return null;
    }

    // Create a container for the invisible recaptcha
    const recaptchaContainer = document.createElement('div');
    recaptchaContainer.id = `recaptcha-${form.id}`;
    form.appendChild(recaptchaContainer);

    // Render invisible reCAPTCHA
    const widgetId = grecaptcha.render(recaptchaContainer.id, {
      sitekey: siteKey,
      size: 'invisible',
      callback: onSuccess,
      'expired-callback': () => {
        this.showError(ERROR_MESSAGES.captcha_expired);
        grecaptcha.reset(widgetId);
      },
      'error-callback': () => {
        this.showError(ERROR_MESSAGES.captcha_failed);
      },
    });

    return widgetId;
  }

  async setupForm(formId, schema, options = {}) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error(`❌ Formulario con ID "${formId}" no encontrado`);
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const siteKey = form.dataset.recaptchaSiteKey;

    // Check initial cooldown state
    if (this.isCooldownActive()) {
      this.updateButtonCooldownState(submitButton, true);
    }

    // Set up interval to check cooldown status
    const cooldownCheckInterval = setInterval(() => {
      const inCooldown = this.isCooldownActive();
      this.updateButtonCooldownState(submitButton, inCooldown);
      if (!inCooldown) {
        // Don't clear interval - keep checking for future cooldowns
      }
    }, 1000);

    // Flag to prevent double submission
    let isSubmitting = false;

    // Wait for grecaptcha to be ready
    const waitForRecaptcha = () => {
      return new Promise((resolve) => {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
          resolve();
        } else {
          const checkInterval = setInterval(() => {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
          }, 10000);
        }
      });
    };

    await waitForRecaptcha();

    // Store validated data for use in callback
    let pendingFormData = null;

    // Initialize reCAPTCHA if site key is available
    let widgetId = null;
    if (siteKey && typeof grecaptcha !== 'undefined') {
      widgetId = this.initRecaptcha(form, siteKey, async (token) => {
        // This callback is called when reCAPTCHA is verified
        if (pendingFormData) {
          await this.submitForm(form, pendingFormData, token, options, submitButton);
          pendingFormData = null;
          isSubmitting = false;
        }
      });
      this.recaptchaWidgets.set(formId, widgetId);
    }

    console.log(`✅ Formulario "${formId}" configurado correctamente`);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check if already submitting
      if (isSubmitting) {
        console.log('⏳ Envío en progreso, ignorando...');
        return;
      }

      // Check cooldown
      if (this.isCooldownActive()) {
        this.showError(ERROR_MESSAGES.cooldown_active);
        return;
      }

      try {
        // 1. Clear previous errors
        this.clearErrors(form);

        // 2. Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Add current date
        data.fecha = new Date().toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        console.log('📋 Datos capturados del formulario:');
        console.table(data);

        // 3. Validate with Zod
        const result = schema.safeParse(data);

        if (!result.success) {
          console.error('❌ Errores de validación:', result.error.format());
          this.showErrors(form, result.error);
          return;
        }

        console.log('✅ Validación exitosa');

        // Mark as submitting
        isSubmitting = true;
        this.setLoadingState(submitButton, true);

        // 4. Execute reCAPTCHA
        if (widgetId !== null && typeof grecaptcha !== 'undefined') {
          pendingFormData = result.data;
          grecaptcha.execute(widgetId);
          // The callback will handle submission
        } else {
          // No reCAPTCHA configured, submit directly (for development)
          console.warn('⚠️ reCAPTCHA no configurado, enviando sin verificación');
          await this.submitForm(form, result.data, null, options, submitButton);
          isSubmitting = false;
        }
      } catch (error) {
        console.error('❌ Error en el formulario:', error);
        this.showError(ERROR_MESSAGES.server_error);
        isSubmitting = false;
        this.setLoadingState(submitButton, false);
      }
    });
  }

  async submitForm(form, data, recaptchaToken, options, submitButton) {
    try {
      // Build payload
      const payload = {
        type: options.type || 'general',
        data: data,
      };

      // Add reCAPTCHA token if available
      if (recaptchaToken) {
        payload.recaptchaToken = recaptchaToken;
      }

      console.log('📧 Enviando datos al servidor...');

      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        // Handle specific error codes
        if (json.code === 'captcha_failed' || json.code === 'captcha_invalid') {
          throw new Error(ERROR_MESSAGES.captcha_failed);
        }
        if (json.code === 'rate_limited') {
          throw new Error(ERROR_MESSAGES.rate_limited);
        }
        throw new Error(json.error || ERROR_MESSAGES.server_error);
      }

      // Success! Start cooldown
      this.startCooldown();
      this.updateButtonCooldownState(submitButton, true);

      // Show success
      if (options.onSuccess) {
        await options.onSuccess(data, form);
      } else {
        this.showSuccess(
          options.successMessage || '¡Formulario enviado con éxito! Nos pondremos en contacto pronto.'
        );
      }

      form.reset();

      // Reset reCAPTCHA widget for next submission
      const widgetId = this.recaptchaWidgets.get(form.id);
      if (widgetId !== null && typeof grecaptcha !== 'undefined') {
        grecaptcha.reset(widgetId);
      }
    } catch (error) {
      console.error('❌ Error al enviar:', error);
      this.showError(error.message || ERROR_MESSAGES.server_error);

      // Reset reCAPTCHA on error
      const widgetId = this.recaptchaWidgets.get(form.id);
      if (widgetId !== null && typeof grecaptcha !== 'undefined') {
        grecaptcha.reset(widgetId);
      }
    } finally {
      this.setLoadingState(submitButton, false);
    }
  }

  clearErrors(form) {
    // Remove error messages
    form.querySelectorAll('.form-error').forEach((el) => el.remove());

    // Remove red borders and restore gray
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
        // Add red border
        field.classList.remove('border-gray-300');
        field.classList.add('border-red-500');

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error text-red-500 text-sm mt-1';
        errorDiv.textContent = messages[0];

        // Insert after the field
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
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent || '';
      }
      button.textContent = 'Enviando...';
      button.classList.add('opacity-75', 'cursor-not-allowed');
      return;
    }

    // Revert - but check cooldown first
    if (this.isCooldownActive()) {
      button.disabled = true;
      button.textContent = button.dataset.originalText || 'Enviar';
      button.classList.add('opacity-75', 'cursor-not-allowed');
      button.setAttribute('title', ERROR_MESSAGES.cooldown_active);
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Enviar';
      button.classList.remove('opacity-75', 'cursor-not-allowed');
      button.removeAttribute('title');
    }
  }

  showSuccess(msg) {
    alert(msg);
  }

  showError(msg) {
    alert(msg);
  }
}
