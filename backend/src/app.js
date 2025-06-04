const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Untuk keamanan dasar HTTP headers
const { port, isDevelopment } = require('./config');
const connectDB = require('./config/database');
const mainRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/logger'); // Ganti dengan morgan jika Anda memilihnya
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerDef'); // Asumsi swaggerDef.js ada di root

// Inisialisasi aplikasi Express
const app = express();

// Koneksi ke Database
connectDB();

// Middleware
app.use(helmet()); // Keamanan HTTP Headers
app.use(cors()); // Aktifkan CORS untuk semua rute
app.use(express.json({ limit: '10mb' })); // Body parser untuk JSON, batasi ukuran payload
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Body parser untuk URL-encoded data

// Logger (gunakan sebelum rute API)
app.use(requestLogger);

// Rute API Utama (dengan prefix /api/v1)
app.use('/api/v1', mainRoutes);

// Rute untuk Swagger UI (jika digunakan)
if (isDevelopment) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger UI available at /api-docs`);
}

// Middleware Penanganan Error Global (harus diletakkan setelah semua rute)
app.use(errorHandler);

// Jalankan server
app.listen(port, () => {
  console.log(`Server E-MOTION berjalan di http://localhost:${port}`);
  if (!isDevelopment) {
    console.log('Running in production mode');
  }
});

module.exports = app; // Untuk pengujian