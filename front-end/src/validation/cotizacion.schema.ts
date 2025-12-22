import { z } from 'zod';

const siNoEnum = z.enum(['si', 'no']);

export const cotizacionSchema = z.object({
  nombreApellido: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresá un email válido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  ubicacion: z.string().min(3, 'Ingresá ciudad y provincia'),
  terreno: siNoEnum,
  metros: z.string().regex(/^\d+$/, 'Ingresá solo números'),
  proyecto: siNoEnum,
  comentarios: z.string().optional(),
  fecha: z.string(),
}).passthrough();