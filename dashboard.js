const token = localStorage.getItem('userToken'); // Ambil token dari penyimpanan lokal
const videoData = { /* data dari form */ };

fetch('http://localhost:5000/api/videos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token // Wajib ada untuk otorisasi
    },
    body: JSON.stringify(videoData)
})
.then(/* tangani respons */);