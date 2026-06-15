const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

router.get('/', cronController.getCronLogs);
router.post('/trigger', cronController.triggerCron);

module.exports = router;
