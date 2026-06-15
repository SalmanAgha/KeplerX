const express = require('express');
const router = express.Router();
const vpsSettingsController = require('../controllers/vpsSettingsController');
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

router.get('/', vpsSettingsController.getSettings);
router.post('/', vpsSettingsController.updateSettings);

module.exports = router;
