// Jalankan kode setelah seluruh konten halaman (HTML) selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    // === Definisi Materi (DATA UTAMA) ===
    const dataAkademik = {
        // Data untuk kelas 5
        '5': {
            // Pelajaran Matematika
            'mtk': {
                // Bab 1 dengan nama, link video YouTube, dan kunci jawaban
                'Bab 1': { nama: 'Penjumlahan Bilangan Bulat', youtube: 'VIDEO_MTK_5_BAB1_URL', jawaban: { soal1: '8' /*, ...soal lainnya */ } },
                // Bab 2
                'Bab 2': { nama: 'Perkalian dan Pembagian', youtube: 'VIDEO_MTK_5_BAB2_URL', jawaban: { soal1: '15' } }
            },
            // Pelajaran Bahasa Inggris
            'b-inggris': {
                'Bab 1': { nama: 'Introducing Myself', youtube: 'VIDEO_BING_5_BAB1_URL', jawaban: { soal1: 'Hello' } }
            }
        },
        // Data untuk kelas 6
        '6': {
            'mtk': {
                'Bab 1': { nama: 'Pecahan dan Desimal', youtube: 'VIDEO_MTK_6_BAB1_URL', jawaban: { soal1: '0.5' } },
                'Bab 2': { nama: 'Luas dan Volume Bangun Ruang', youtube: 'VIDEO_MTK_6_BAB2_URL', jawaban: { soal1: 'Kubus' } }
            }
        }
    };

    // Variabel global untuk menyimpan status pilihan pengguna
    let currentKelas = null;      // Menyimpan kelas yang dipilih
    let currentPelajaran = null;  // Menyimpan pelajaran yang dipilih
    let currentBab = null;        // Menyimpan bab yang dipilih
    
    // === Fungsi untuk menampilkan tampilan (view) tertentu ===
    function showView(viewId) {
        // Sembunyikan semua tampilan
        document.getElementById('pilih-kelas').style.display = 'none';
        document.getElementById('pilih-pelajaran').style.display = 'none';
        document.getElementById('pilih-bab').style.display = 'none';
        document.getElementById('materi-kuis').style.display = 'none';
        // Tampilkan hanya view yang dipilih
        document.getElementById(viewId).style.display = 'block';
    }

    // === Aksi saat klik kartu kelas ===
    document.querySelectorAll('.card-kelas').forEach(card => {
        // Tambahkan event listener untuk setiap kartu kelas
        card.addEventListener('click', (e) => {
            currentKelas = card.dataset.kelas; // Ambil nilai kelas dari atribut data-kelas
            document.getElementById('kelas-display').textContent = currentKelas; // Tampilkan kelas yang dipilih
            showView('pilih-pelajaran'); // Pindah ke tampilan pemilihan pelajaran
        });
    });

    // === Aksi saat klik kartu pelajaran ===
    document.querySelectorAll('.card-pelajaran').forEach(card => {
        card.addEventListener('click', (e) => {
            currentPelajaran = card.dataset.pelajaran; // Ambil nilai pelajaran
            // Ganti teks tampilan pelajaran
            document.getElementById('pelajaran-display').textContent = (currentPelajaran === 'mtk' ? 'Matematika' : 'Bahasa Inggris');
            // Tampilkan kelas di tampilan bab
            document.getElementById('kelas-bab-display').textContent = currentKelas;
            
            // === Menampilkan daftar bab berdasarkan data ===
            const babList = document.getElementById('bab-list'); // Ambil elemen daftar bab
            babList.innerHTML = ''; // Kosongkan daftar bab sebelumnya
            const babData = dataAkademik[currentKelas][currentPelajaran]; // Ambil data bab sesuai kelas & pelajaran
            
            // Looping setiap bab dan tampilkan dalam bentuk link
            Object.keys(babData).forEach(babKey => {
                const bab = babData[babKey];
                const link = document.createElement('a'); // Buat elemen link baru
                link.href = '#'; // Tidak berpindah halaman
                link.className = 'list-group-item list-group-item-action'; // Tambahkan class Bootstrap
                link.dataset.bab = babKey; // Simpan nama bab di atribut data
                link.innerHTML = `<strong>${babKey}.</strong> ${bab.nama}`; // Tampilkan nama bab
                
                // Tambahkan event klik untuk setiap bab
                link.addEventListener('click', () => handleBabClick(babKey, bab));
                // Tambahkan ke daftar
                babList.appendChild(link);
            });

            // Tampilkan tampilan pemilihan bab
            showView('pilih-bab');
        });
    });

    // === Fungsi saat klik salah satu bab ===
    function handleBabClick(babKey, babData) {
        currentBab = babKey; // Simpan bab yang sedang aktif
        document.getElementById('bab-materi-display').textContent = `${babKey} - ${babData.nama}`; // Tampilkan nama bab
        
        // Atur video pembelajaran dari YouTube
        const embedUrl = babData.youtube || 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // URL default jika kosong
        document.getElementById('video-embed').src = embedUrl; // Tampilkan video pada iframe

        // === Reset tampilan kuis ===
        document.getElementById('kuis-form').reset(); // Kosongkan semua pilihan kuis
        document.getElementById('hasil-kuis').style.display = 'none'; // Sembunyikan hasil kuis
        document.getElementById('tombol-jawaban').style.display = 'none'; // Sembunyikan tombol kunci jawaban
        document.querySelectorAll('.jawaban-benar').forEach(el => el.style.display = 'none'); // Sembunyikan teks jawaban benar

        // Tampilkan tampilan materi & kuis
        showView('materi-kuis');
    }

    // === Fungsi untuk menilai hasil kuis ===
    document.getElementById('kuis-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Cegah reload halaman saat submit
        
        // Ambil kunci jawaban dari data
        const jawabanBenar = dataAkademik[currentKelas][currentPelajaran][currentBab].jawaban;
        let skor = 0; // Nilai awal
        let totalSoal = 1; // Saat ini hanya 1 soal, bisa ditambah nanti
        
        // Ambil jawaban pengguna dari input yang dipilih
        const jawabanUser = document.querySelector('input[name="soal1"]:checked')?.value;
        // Jika jawaban pengguna sama dengan kunci jawaban
        if (jawabanUser && jawabanUser === jawabanBenar['soal1']) {
            skor = 1; // Tambahkan skor
        }

        // Tampilkan hasil kuis ke layar
        document.getElementById('hasil-kuis').innerHTML = `Anda menjawab **${skor}** dari **${totalSoal}** soal dengan benar!`;
        document.getElementById('hasil-kuis').style.display = 'block'; // Tampilkan hasil
        document.getElementById('tombol-jawaban').style.display = 'block'; // Tampilkan tombol kunci jawaban
    });
    
    // === Fungsi untuk menampilkan kunci jawaban ===
    document.getElementById('tombol-jawaban').addEventListener('click', () => {
        document.querySelectorAll('.jawaban-benar').forEach(el => {
            el.style.display = 'block'; // Tampilkan elemen jawaban benar
        });
    });


    // === Fungsi tombol "Kembali" untuk navigasi antar tampilan ===
    window.resetView = function(target) {
        if (target === 'kelas') {
            currentKelas = null; // Reset kelas
            showView('pilih-kelas'); // Kembali ke tampilan awal
        } else if (target === 'pelajaran') {
            currentPelajaran = null; // Reset pelajaran
            showView('pilih-pelajaran');
        } else if (target === 'bab') {
            currentBab = null; // Reset bab
            showView('pilih-bab');
        }
    }
    
    // === Tampilkan tampilan awal (pemilihan kelas) ===
    showView('pilih-kelas');
});

async function getMaterials() {
  try {
    const response = await fetch('http://localhost:5000/api/materials');
    if (!response.ok) {
      throw new Error('Gagal mengambil data materi');
    }
    const materials = await response.json();

    // TODO: Update DOM (HTML) Anda untuk menampilkan 'materials'
    console.log('Daftar Materi:', materials); 

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getMaterials();