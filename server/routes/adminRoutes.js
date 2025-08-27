const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/categories', adminController.addCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);
router.get('/categories', adminController.viewCategories);

// Product routes
router.post("/products", adminController.addProduct);
router.patch("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
router.get("/products", adminController.viewProducts);

module.exports = router;