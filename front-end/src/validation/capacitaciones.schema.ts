import { z } from 'zod';

export const capacitacionSchema = z.object({
  nombreApellido: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresá un email válido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  fecha: z.string(),
}).passthrough();