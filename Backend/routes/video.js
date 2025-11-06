// routes/videos.js
const express = require('express');
const router = express.Router();
const Video = require('../models/video.js'); // Import Model Video
const auth = require('../middleware/auth.js'); // Import Middleware Auth

// @route   GET /api/videos
// @desc    Mendapatkan SEMUA video (Untuk ditampilkan di frontend publik)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ tanggalUpload: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// -------------------------------------------------------------------
// 💡 ENDPOINT BARU: GET video berdasarkan ID
// @route   GET /api/videos/:id 
// @desc    Mendapatkan detail video berdasarkan ID (Diperlukan untuk form Edit)
// @access  Public (Biasanya publik, atau dilindungi jika data sensitif)
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ msg: 'Video tidak ditemukan' });
        }
        res.json(video);
    } catch (err) {
        // Cek jika format ID salah
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Video tidak ditemukan' });
        }
        res.status(500).send('Server Error');
    }
});
// -------------------------------------------------------------------

// @route   POST /api/videos
// @desc    Menambahkan video baru
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  const { judul, deskripsi, kelas, mataPelajaran, linkEmbed } = req.body;
  try {
    const newVideo = new Video({
      judul,
      deskripsi,
      kelas,
      mataPelajaran,
      linkEmbed,
      uploader: req.user.id // ID admin dari token
    });

    const video = await newVideo.save();
    res.json(video);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// -------------------------------------------------------------------
// 💡 ENDPOINT BARU: PUT/UPDATE video
// @route   PUT /api/videos/:id
// @desc    Mengubah video
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    const { judul, deskripsi, kelas, mataPelajaran, linkEmbed } = req.body;

    // Buat objek field yang akan diupdate
    const videoFields = { judul, deskripsi, kelas, mataPelajaran, linkEmbed };

    try {
        let video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ msg: 'Video tidak ditemukan' });
        }

        // Pastikan hanya pemilik atau admin yang dapat mengubah (Opsional: jika Anda ingin cek uploader)

        video = await Video.findByIdAndUpdate(
            req.params.id, 
            { $set: videoFields }, 
            { new: true } // Mengembalikan dokumen yang sudah diupdate
        );

        res.json(video);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// 💡 ENDPOINT BARU: DELETE video
// @route   DELETE /api/videos/:id
// @desc    Menghapus video
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ msg: 'Video tidak ditemukan' });
        }
        
        await Video.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Video berhasil dihapus' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Video tidak ditemukan' });
        }
        res.status(500).send('Server Error');
    }
});
// -------------------------------------------------------------------

module.exports = router;