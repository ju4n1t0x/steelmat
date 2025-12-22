import { cotizacionSchema } from './cotizacion.schema';
import { capacitacionSchema } from './capacitaciones.schema';

// Re-exports para uso directo en componentes y compatibilidad
export { cotizacionSchema } from './cotizacion.schema';
export { capacitacionSchema, capacitacionSchema as capacitacionesSchema } from './capacitaciones.schema';

export const SCHEMA_BY_TYPE = {
  cotizacion: cotizacionSchema,
  capacitaciones: capacitacionSchema,
};

export type EmailType = keyof typeof SCHEMA_BY_TYPE;
