const { apiKey } = require('../config');

module.exports = function(req, res, next) {
  const clientApiKey = req.header('x-api-key');

  if (!clientApiKey) {
    return res.status(401).json({ msg: 'No API key, authorization denied' });
  }

  if (clientApiKey !== apiKey) {
    return res.status(401).json({ msg: 'Invalid API key, authorization denied' });
  }

  next();
};