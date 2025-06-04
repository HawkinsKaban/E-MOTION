require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  apiKey: process.env.API_KEY,
  isDevelopment: process.env.NODE_ENV === 'development',
};