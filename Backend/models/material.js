// models/Material.js
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String },
  kelas: { type: String, required: true }, // Contoh: 'Kelas 5', 'Kelas 6'
  mataPelajaran: { type: String, required: true }, // Contoh: 'Matematika', 'IPA'
  linkFile: { type: String }, // Link ke file materi (PDF/video/dokumen)
  tanggalUpload: { type: Date, default: Date.now },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Material', materialSchema);