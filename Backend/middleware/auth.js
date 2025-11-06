// middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Ambil token dari header
  const token = req.header('x-auth-token');

  // Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Pastikan user adalah admin
    if (decoded.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden, only Admin can access this.' });
    }

    // Tambahkan user dari payload token ke request
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;