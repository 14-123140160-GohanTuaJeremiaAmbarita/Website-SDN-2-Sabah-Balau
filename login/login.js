// login/login.js

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Mencegah submit form default

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');
    const loginData = { username, password };
    
    messageEl.textContent = ''; // Kosongkan pesan error sebelumnya

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            // 1. Simpan Token ke Local Storage
            localStorage.setItem('adminToken', data.token);
            
            // 2. Arahkan ke Dashboard Admin
            window.location.href = '../admin-dashboard.html'; 
        } else {
            // Login gagal (misal: kredensial salah)
            messageEl.textContent = data.msg || 'Login gagal. Periksa Username dan Password.';
        }
    } catch (error) {
        console.error('Error saat melakukan login:', error);
        messageEl.textContent = 'Terjadi kesalahan pada server. Coba lagi.';
    }
});

// Ini adalah kode backend (Serverless Function)
// Kode ini berjalan di server Vercel, BUKAN di browser pengguna

export default function handler(request, response) {
  // 1. Hanya izinkan metode POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  try {
    // 2. Ambil data username & password yang dikirim dari frontend
    const { username, password } = request.body;

    // 3. Ambil data rahasia dari "brankas" (Environment Variables)
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    // 4. Lakukan pengecekan yang aman
    if (username === adminUser && password === adminPass) {
      // 5. Jika BERHASIL: Kirim balasan sukses
      // (Di aplikasi nyata, kita akan mengirim token JWT, 
      // tapi untuk sekarang, balasan sukses saja sudah cukup)
      return response.status(200).json({ success: true, message: 'Login berhasil' });
    } else {
      // 6. Jika GAGAL: Kirim balasan error
      return response.status(401).json({ success: false, message: 'Username atau password salah' });
    }

  } catch (error) {
    // 7. Jika ada error server
    return response.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

