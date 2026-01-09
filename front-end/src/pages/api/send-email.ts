import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { SCHEMA_BY_TYPE, type EmailType } from '@/validation';
import { TEMPLATE_BY_TYPE, TO_BY_TYPE } from '@/config/email.config';
import { checkRateLimit, getClientIP } from '@/utils/rateLimit';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY!);
const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;

/**
 * Verify reCAPTCHA token with Google
 */
async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number }> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('⚠️ RECAPTCHA_SECRET_KEY not configured, skipping verification');
    return { success: true };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const result = await response.json();
    return {
      success: result.success === true,
      score: result.score,
    };
  } catch (error) {
    console.error('❌ Error verifying reCAPTCHA:', error);
    return { success: false };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);

    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Demasiados envíos. Por favor, esperá un momento.',
          code: 'rate_limited',
          retryAfter: rateLimitResult.resetInSeconds,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.resetInSeconds.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { type, data, recaptchaToken } = body as {
      type: EmailType;
      data: unknown;
      recaptchaToken?: string;
    };

    // 2. Validate email type
    if (!type || !(type in SCHEMA_BY_TYPE)) {
      return new Response(
        JSON.stringify({ error: 'Tipo no soportado', code: 'invalid_type' }),
        { status: 400 }
      );
    }

    // 3. Verify reCAPTCHA (if token provided or if secret key is configured)
    if (RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) {
        return new Response(
          JSON.stringify({
            error: 'Verificación de seguridad requerida',
            code: 'captcha_missing',
          }),
          { status: 400 }
        );
      }

      const captchaResult = await verifyRecaptcha(recaptchaToken);
      if (!captchaResult.success) {
        return new Response(
          JSON.stringify({
            error: 'No pudimos verificar que sos una persona real',
            code: 'captcha_failed',
          }),
          { status: 400 }
        );
      }
    }

    // 4. Validate form data with Zod
    const schema = SCHEMA_BY_TYPE[type];
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: 'Datos inválidos',
          code: 'validation_error',
          details: parsed.error.format(),
        }),
        { status: 400 }
      );
    }

    // 5. Normalize variables for Resend
    // Filter out g-recaptcha-response and any other fields with invalid characters for Resend
    const { 'g-recaptcha-response': _, ...cleanData } = parsed.data as Record<string, unknown>;

    const safeVariables: Record<string, string | number> = Object.fromEntries(
      Object.entries(cleanData).map(([k, v]) => [
        k,
        typeof v === 'number' || typeof v === 'string' ? v : String(v ?? ''),
      ])
    );

    // 6. Send email via Resend
    const { error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM!,
      to: TO_BY_TYPE[type],
      template: {
        id: TEMPLATE_BY_TYPE[type],
        variables: safeVariables,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        remaining: rateLimitResult.remaining,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('❌ Error in send-email API:', err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Error interno',
        code: 'server_error',
      }),
      { status: 500 }
    );
  }
};
