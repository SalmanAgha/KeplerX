const express = require('express');
const router = express.Router();
const { getJobs, getSmtpConfig, updateSmtpConfig } = require('../controllers/systemController');
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

router.get('/jobs', getJobs);
router.get('/smtp', getSmtpConfig);
router.post('/smtp', updateSmtpConfig);

module.exports = router;
