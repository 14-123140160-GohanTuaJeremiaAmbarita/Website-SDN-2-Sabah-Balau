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