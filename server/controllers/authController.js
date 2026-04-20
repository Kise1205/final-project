const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ email, password });
    await user.save();

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
  console.error("REGISTRATION ERROR:", err); // ADD THIS LINE
  res.status(500).json({ message: 'Server error', error: err.message });
}
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await require('bcryptjs').compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
  console.error("REGISTRATION ERROR:", err); // ADD THIS LINE
  res.status(500).json({ message: 'Server error', error: err.message });
}
};

module.exports = { register, login };