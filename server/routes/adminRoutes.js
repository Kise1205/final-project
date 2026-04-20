const express = require('express');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { getUsers, getAllFoods, deleteAdminFood } = require('../controllers/adminController');

const router = express.Router();
router.use(verifyToken);
router.use(checkRole('admin'));

router.get('/users', getUsers);
router.get('/foods', getAllFoods);
router.delete('/foods/:id', deleteAdminFood);

module.exports = router;