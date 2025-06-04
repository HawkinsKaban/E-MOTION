const express = require('express');
const router = express.Router();

const emotionRoutes = require('./emotionRoutes');

// Gunakan rute
router.use('/emotions', emotionRoutes);
// Tambahkan rute lain di sini jika ada (misalnya, userRoutes)

module.exports = router;