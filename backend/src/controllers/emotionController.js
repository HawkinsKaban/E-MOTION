const EmotionLog = require('../models/EmotionLog');

// @route   POST /api/v1/emotions/log
// @desc    Log a detected emotion
// @access  Private (membutuhkan API Key)
exports.logEmotion = async (req, res, next) => {
  const {
    deviceId,
    audioFileReference,
    detectedEmotion,
    confidenceScore,
    emotionDetails, // Ini diharapkan berupa objek seperti { Happy: 0.7, Sad: 0.1, ... }
    appVersion,
  } = req.body;

  // Validasi dasar
  if (!deviceId || !detectedEmotion || !emotionDetails) {
    return res.status(400).json({ msg: 'Please include deviceId, detectedEmotion, and emotionDetails' });
  }

  try {
    const newLog = new EmotionLog({
      deviceId,
      audioFileReference, // Opsional
      detectedEmotion,
      confidenceScore,    // Opsional
      emotionDetails,
      appVersion,
    });

    const savedLog = await newLog.save();
    res.status(201).json({
      msg: 'Emotion logged successfully',
      data: savedLog,
    });
  } catch (err) {
    next(err); // Teruskan error ke errorHandler
  }
};

// @route   GET /api/v1/emotions/history/:deviceId
// @desc    Get emotion history for a device
// @access  Private
exports.getEmotionHistory = async (req, res, next) => {
  try {
    const logs = await EmotionLog.find({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 }) // Urutkan dari yang terbaru
      .limit(50); // Batasi jumlah log yang dikembalikan

    if (!logs || logs.length === 0) {
      return res.status(404).json({ msg: 'No emotion logs found for this device' });
    }

    res.json({
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    next(err);
  }
};