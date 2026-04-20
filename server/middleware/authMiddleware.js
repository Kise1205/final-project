const jwt = require('jsonwebtoken');

/*
🔥 DEBUG CASE REQUIREMENT (JWT not working)
Bug: After login you get 401 on every protected route ("No token" or "Token is not valid").
Cause: Axios is not sending the Authorization header, or the token extraction in middleware is missing the "Bearer " prefix removal, or JWT_SECRET in .env changed after token was issued.
Fix (already implemented correctly here):
1. Frontend sets: axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
2. Middleware: const token = authHeader.split(' ')[1];
3. Always restart server + clear localStorage after changing JWT_SECRET.
*/

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { verifyToken, checkRole };