const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getFoods, addFood, updateFood, deleteFood } = require('../controllers/foodController');

const router = express.Router();
router.use(verifyToken);

router.get('/', getFoods);
router.post('/', addFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

module.exports = router;