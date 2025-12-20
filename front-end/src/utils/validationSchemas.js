import { z } from 'zod';

/**
 * Schema de validación para el formulario de Cotización
 */
export const cotizacionSchema = z.object({
  nombreApellido: z
    .string()
    .min(1, 'El nombre y apellido es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresá un email válido'),
  
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Ingresá un teléfono válido'),
  
  ubicacion: z
    .string()
    .min(1, 'La ubicación es requerida')
    .min(3, 'Ingresá ciudad y provincia'),
  
  terreno: z
    .enum(['si', 'no'], {
      errorMap: () => ({ message: 'Seleccioná una opción' })
    }),
  
  metros: z
    .string()
    .min(1, 'Los metros son requeridos')
    .regex(/^\d+/, 'Ingresá solo números'),
  
  proyecto: z
    .enum(['si', 'no'], {
      errorMap: () => ({ message: 'Seleccioná una opción' })
    }),
  
  comentarios: z
    .string()
    .optional()
}).passthrough(); // Permite campos adicionales como 'fecha'

/**
 * Schema de validación para el formulario de Capacitaciones
 */
export const capacitacionesSchema = z.object({
  nombreApellido: z
    .string()
    .min(1, 'El nombre y apellido es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresá un email válido'),
  
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Ingresá un teléfono válido')
}).passthrough(); // Permite campos adicionales como 'fecha'
