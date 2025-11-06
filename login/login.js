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