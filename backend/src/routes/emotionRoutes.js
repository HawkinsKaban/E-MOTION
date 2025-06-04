const express = require('express');
const router = express.Router();
const { logEmotion, getEmotionHistory } = require('../controllers/emotionController');
const apiKeyAuth = require('../middlewares/apiKeyAuth');

// Semua rute di sini akan diawali dengan /api/v1/emotions (lihat di app.js)

// @route   POST /log
// @desc    Log a detected emotion
// @access  Private
router.post('/log', apiKeyAuth, logEmotion);

// @route   GET /history/:deviceId
// @desc    Get emotion history for a device
// @access  Private
router.get('/history/:deviceId', apiKeyAuth, getEmotionHistory);


module.exports = router;