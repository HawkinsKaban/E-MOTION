const mongoose = require('mongoose');

const EmotionLogSchema = new mongoose.Schema({
  deviceId: { // Bisa diganti dengan userId jika ada sistem pengguna
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  audioFileReference: { // Bisa berupa path ke file atau ID penyimpanan cloud
    type: String,
    required: false, // Tergantung apakah Anda menyimpan audio mentah
  },
  detectedEmotion: {
    type: String,
    required: true,
  },
  confidenceScore: {
    type: Number,
    required: false, // Opsional, tergantung model
  },
  emotionDetails: { // Untuk menyimpan probabilitas semua emosi
    type: Map,
    of: Number,
  },
  manualFeedback: { // Opsional, untuk pengguna mengoreksi
    type: String,
    required: false,
  },
  appVersion: {
    type: String,
    required: false,
  },
  // Pertimbangkan untuk menambahkan field metadata lain yang relevan
  // seperti bahasa yang digunakan, durasi audio, dll.
}, { timestamps: true }); // timestamps: true akan menambahkan createdAt dan updatedAt secara otomatis

module.exports = mongoose.model('EmotionLog', EmotionLogSchema);