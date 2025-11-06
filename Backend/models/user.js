// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Role disetel 'admin' secara default, atau bahkan dihilangkan jika pasti hanya ada satu jenis pengguna.
  role: { type: String, default: 'admin' }, 
});

module.exports = mongoose.model('User', userSchema);