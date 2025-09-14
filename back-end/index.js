// index.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // carga variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend Node.js funcionando ✅');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});