const express = require('express');
const router = express.Router();
const vpsProductsController = require('../controllers/vpsProductsController');
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

router.get('/', vpsProductsController.getProducts);
router.post('/', vpsProductsController.createProduct);
router.put('/:id', vpsProductsController.updateProduct);
router.delete('/:id', vpsProductsController.deleteProduct);

module.exports = router;
