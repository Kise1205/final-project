const User = require('../models/User');
const FoodEntry = require('../models/FoodEntry');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllFoods = async (req, res) => {
  try {
    const foods = await FoodEntry.find().populate('userId', 'email');
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAdminFood = async (req, res) => {
  try {
    const food = await FoodEntry.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food entry not found' });
    res.json({ message: 'Food entry deleted by admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers, getAllFoods, deleteAdminFood };