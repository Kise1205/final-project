const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  calories: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('FoodEntry', foodEntrySchema);