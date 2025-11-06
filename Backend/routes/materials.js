// routes/materials.js
const express = require('express');
const router = express.Router();
const Material = require('../models/material.js');
// Endpoint: GET /api/materials (Mendapatkan semua materi)
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find().sort({ tanggalUpload: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Endpoint: POST /api/materials (Menambahkan materi baru)
// TODO: Tambahkan middleware untuk memastikan hanya 'guru' atau 'admin' yang bisa menambah
router.post('/', async (req, res) => {
  const { judul, deskripsi, kelas, mataPelajaran, linkFile, uploader } = req.body;
  try {
    const newMaterial = new Material({
      judul,
      deskripsi,
      kelas,
      mataPelajaran,
      linkFile,
      // uploader: req.user.id // Jika sudah ada middleware autentikasi
      uploader: uploader // Sementara, gunakan field dari body
    });

    const material = await newMaterial.save();
    res.json(material);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;