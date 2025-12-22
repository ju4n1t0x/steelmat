export const TEMPLATE_BY_TYPE = {
  cotizacion: 'd8c01805-fae0-4fb8-a489-344b0cb7e4ee',      // solicitudCotizacion
  capacitaciones: 'a854b9d2-f9f0-438e-a384-bb69f4017df4', // solicitudCapacitacion
};

export const TO_BY_TYPE = {
  cotizacion: import.meta.env.RESEND_TO!,
  capacitaciones: import.meta.env.RESEND_TO!,
};