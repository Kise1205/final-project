const FoodEntry = require('../models/FoodEntry');

const getFoods = async (req, res) => {
  try {
    const { search, category, date } = req.query;
    const query = { userId: req.user.id };

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const foods = await FoodEntry.find(query).sort({ date: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addFood = async (req, res) => {
  try {
    const food = new FoodEntry({ ...req.body, userId: req.user.id });
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFood = async (req, res) => {
  try {
    const food = await FoodEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!food) return res.status(404).json({ message: 'Food entry not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await FoodEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!food) return res.status(404).json({ message: 'Food entry not found' });
    res.json({ message: 'Food entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFoods, addFood, updateFood, deleteFood };