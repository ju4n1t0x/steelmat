import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { SCHEMA_BY_TYPE, type EmailType } from '@/validation';
import { TEMPLATE_BY_TYPE, TO_BY_TYPE } from '@/config/email.config';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY!);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { type, data } = body as {
      type: EmailType;
      data: unknown;
    };

    if (!type || !(type in SCHEMA_BY_TYPE)) {
      return new Response(
        JSON.stringify({ error: 'Tipo no soportado' }),
        { status: 400 }
      );
    }

    const schema = SCHEMA_BY_TYPE[type];
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: 'Datos inválidos',
          details: parsed.error.format(),
        }),
        { status: 400 }
      );
    }

    // Normalizar variables a string | number para Resend
    const safeVariables: Record<string, string | number> = Object.fromEntries(
      Object.entries(parsed.data as Record<string, unknown>).map(([k, v]) => [
        k,
        typeof v === 'number' || typeof v === 'string' ? v : String(v ?? ''),
      ])
    );

    
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
      JSON.stringify({ status: 'ok' }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Error interno',
      }),
      { status: 500 }
    );
  }
};

