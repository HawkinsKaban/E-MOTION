// backend/src/config/index.js
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
// Pastikan file .env ada di root direktori backend/
dotenv.config({ path: '../../.env' }); // Menyesuaikan path jika server.js ada di root backend

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  apiKeySecret: process.env.API_KEY_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '1h', // Contoh: token kedaluwarsa dalam 1 jam
};

// Validasi variabel lingkungan yang krusial
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'API_KEY_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !config[varName.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase())] && !process.env[varName]);


if (missingEnvVars.length > 0) {
  console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please ensure they are defined in your .env file or system environment.');
  process.exit(1); // Keluar dari aplikasi jika variabel penting tidak ada
}

export default config;