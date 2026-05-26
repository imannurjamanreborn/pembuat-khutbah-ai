async function generateKhutbah() {
    const topic = document.getElementById('topic').value;
    const duration = document.getElementById('duration').value;
    const outputDiv = document.getElementById('output');
    const language = document.getElementById('language');

    // 1. Validasi input
    if (!topic) {
        alert("Harap masukkan tema khutbah terlebih dahulu!");
        return;
    }

    // 2. Beri efek loading di layar
    outputDiv.innerHTML = "<em>Sedang mengirim data ke server... Mohon tunggu...</em>";
    outputDiv.classList.add('text-muted');

    try {
        // 3. Kirim data (tema & durasi) ke server backend kita menggunakan Fetch API
        const response = await fetch('http://localhost:3000/api/generate-khutbah', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: topic,
                duration: duration,
                language: language
            })
        });

        // 4. Ambil respon dalam bentuk JSON dari server
        const data = await response.json();

        if (response.ok) {
            // 5. Tampilkan teks khutbah yang dikirim oleh backend ke layar web
            outputDiv.innerHTML = data.text;
            outputDiv.classList.remove('text-muted');
        } else {
            // Jika backend mengirimkan error
            outputDiv.innerHTML = `<span class="text-danger">Error: ${data.error}</span>`;
        }

    } catch (error) {
        // Jika koneksi ke server putus atau server belum dinyalakan
        console.error("Terjadi kesalahan:", error);
        outputDiv.innerHTML = `<span class="text-danger">Gagal terhubung ke server. Pastikan server backend (node server.js) sudah dijalankan!</span>`;
    }
}

// Fungsi untuk menyalin teks ke clipboard (tetap sama)
function copyToClipboard() {
    const text = document.getElementById('output').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Teks khutbah berhasil disalin!");
    }).catch(err => {
        alert("Gagal menyalin teks: ", err);
    });
}
// Paste ini di baris paling bawah file app.js ya!
function printKhutbah() {
    const outputElement = document.getElementById('output');
    
    // Validasi singkat: jika naskah masih kosong, jangan mau nyetak
    if (!outputElement || outputElement.classList.contains('text-muted') || outputElement.innerText.trim() === "") {
        alert("Silakan hasilkan naskah khutbah terlebih dahulu sebelum dicetak!");
        return;
    }

    // Langsung panggil perintah cetak bawaan browser
    window.print();
}