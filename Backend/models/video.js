// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String },
  kelas: { type: String, required: true },       // Contoh: 'Kelas 5', 'Kelas 6'
  mataPelajaran: { type: String, required: true }, // Contoh: 'Matematika', 'IPA'
  linkEmbed: { type: String, required: true },   // Link Embed dari YouTube/platform lain
  tanggalUpload: { type: Date, default: Date.now },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Video', videoSchema);