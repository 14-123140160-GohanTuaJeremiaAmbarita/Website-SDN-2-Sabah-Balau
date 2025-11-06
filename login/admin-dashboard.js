// admin-dashboard.js
const API_URL = 'http://localhost:5000/api/videos';
const token = localStorage.getItem('adminToken');
const videoForm = document.getElementById('videoForm');
const videoTableBody = document.getElementById('videoTableBody');
const alertMessage = document.getElementById('alertMessage');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEdit');
const videoIdInput = document.getElementById('videoId');

// Fungsi untuk cek token & otorisasi
if (!token) {
    alert('Akses ditolak. Silakan login sebagai Admin.');
    window.location.href = 'login/login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login/login.html';
});

// --- FUNGSI UTAMA: MENGAMBIL DAN MENAMPILKAN DATA VIDEO (READ) ---
async function fetchVideos() {
    try {
        const response = await fetch(API_URL);
        const videos = await response.json();
        
        videoTableBody.innerHTML = ''; // Kosongkan tabel
        
        videos.forEach(video => {
            const row = videoTableBody.insertRow();
            row.innerHTML = `
                <td>${video.judul}</td>
                <td>${video.kelas} / ${video.mataPelajaran}</td>
                <td><a href="${video.linkEmbed}" target="_blank">Lihat Link</a></td>
                <td>
                    <button onclick="editVideo('${video._id}')">Edit</button>
                    <button class="delete" onclick="deleteVideo('${video._id}')">Hapus</button>
                </td>
            `;
        });
    } catch (error) {
        alertMessage.textContent = 'Gagal memuat data video.';
        console.error('Error fetching videos:', error);
    }
}

// --- FUNGSI: MENAMBAH/MENGUBAH VIDEO (CREATE/UPDATE) ---
videoForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const videoId = videoIdInput.value;
    const method = videoId ? 'PUT' : 'POST';
    const url = videoId ? `${API_URL}/${videoId}` : API_URL;

    const videoData = {
        judul: document.getElementById('judul').value,
        kelas: document.getElementById('kelas').value,
        mataPelajaran: document.getElementById('mapel').value,
        linkEmbed: document.getElementById('linkEmbed').value,
        deskripsi: document.getElementById('deskripsi').value,
    };

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // WAJIB ada token admin!
            },
            body: JSON.stringify(videoData)
        });

        if (response.ok) {
            alertMessage.textContent = `Video berhasil di${videoId ? 'ubah' : 'tambah'}!`;
            videoForm.reset();
            videoIdInput.value = ''; // Reset ID
            submitBtn.textContent = 'Tambah Video';
            cancelEditBtn.style.display = 'none';
            fetchVideos(); // Refresh daftar video
        } else {
            const data = await response.json();
            alertMessage.textContent = `Gagal ${videoId ? 'mengubah' : 'menambah'} video: ${data.msg || response.statusText}`;
        }
    } catch (error) {
        alertMessage.textContent = 'Kesalahan saat koneksi ke server.';
        console.error('Error submitting form:', error);
    }
});

// --- FUNGSI: MENGISI FORM UNTUK EDIT ---
async function editVideo(id) {
    // 1. Ambil data video berdasarkan ID (gunakan GET /api/videos/:id - asumsi endpoint ini ada)
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const video = await response.json();
        
        // 2. Isi form dengan data yang diambil
        document.getElementById('judul').value = video.judul;
        document.getElementById('kelas').value = video.kelas;
        document.getElementById('mapel').value = video.mataPelajaran;
        document.getElementById('linkEmbed').value = video.linkEmbed;
        document.getElementById('deskripsi').value = video.deskripsi;
        videoIdInput.value = video._id; // Set ID video untuk PUT request
        
        // 3. Ubah tampilan tombol
        submitBtn.textContent = 'Simpan Perubahan';
        cancelEditBtn.style.display = 'inline-block';
        window.scrollTo(0, 0); // Gulir ke atas ke form
    } catch (error) {
        alertMessage.textContent = 'Gagal memuat data untuk edit.';
        console.error('Error fetching video for edit:', error);
    }
}

// Fungsi batal edit
cancelEditBtn.addEventListener('click', () => {
    videoForm.reset();
    videoIdInput.value = '';
    submitBtn.textContent = 'Tambah Video';
    cancelEditBtn.style.display = 'none';
    alertMessage.textContent = '';
});

// --- FUNGSI: MENGHAPUS VIDEO (DELETE) ---
async function deleteVideo(id) {
    if (!confirm('Yakin ingin menghapus video ini?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 
                'x-auth-token': token // WAJIB ada token admin!
            }
        });

        if (response.ok) {
            alertMessage.textContent = 'Video berhasil dihapus!';
            fetchVideos(); // Refresh daftar video
        } else {
            const data = await response.json();
            alertMessage.textContent = `Gagal menghapus video: ${data.msg || response.statusText}`;
        }
    } catch (error) {
        alertMessage.textContent = 'Kesalahan saat menghapus video.';
        console.error('Error deleting video:', error);
    }
}

// Panggil fungsi untuk memuat data saat halaman dimuat
fetchVideos();