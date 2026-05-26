const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import modul Google Gen AI terbaru
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Supaya server bisa membaca dan menampilkan file index.html dan app.js kita
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. Endpoint utama pembuat khutbah
app.post('/api/generate-khutbah', async (req, res) => {
    const { topic, duration, language } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Tema khutbah wajib diisi!' });
    }

    try {
        console.log(`AI sedang merumuskan khutbah tentang: ${topic} (Bahasa: ${language})`);

        // 3. Merancang instruksi (Prompt) yang ketat di dalam backtick (`)
        const promptKhatib = `
          Strict Rule: Seluruh materi khutbah wajib ditulis dan disampaikan dalam ${language}! Jangan gunakan Bahasa Indonesia sama sekali untuk narasi khutbah.
          
          Kamu adalah seorang Ulama dan Khatib jumat profesional yang fasih berbahasa ${language}. 
          Buatkan naskah Khutbah Jumat yang lengkap, menyentuh hati, dan sesuai sunnah.
          
          === DETAIL PENGATURAN ===
          - Tema Khutbah: ${topic}
          - Target Durasi: ${duration}
          - Bahasa Khutbah: WAJIB 100% menggunakan ${language} (kecuali teks Arab untuk rukun khutbah).
          
          === ATURAN STRUKTUR ===
          
          === KHUTBAH PERTAMA ===
          1. Pembuka (Wajib teks Arab hamdalah, syahadat, dan shalawat).
          2. Wasiat Taqwa (Ajakan eksplisit untuk bertakwa kepada jemaah, ditulis dalam ${language}).
          3. Membaca satu ayat Al-Qur'an berkaitan dengan ${topic} (Teks Arab ayat + artinya wajib dalam ${language}).
          4. Pembahasan materi khutbah secara runtut dan mendalam sesuai durasi ${duration}. (PERINGATAN: Bagian ini HARUS full ditulis dalam ${language}. Jika dipilih Sunda, gunakan bahasa Sunda yang halus/lemes. Jika Jawa, gunakan bahasa Jawa).
          5. Penutup Khutbah Pertama (Bahasa ${language}).
          
          === KHUTBAH KEDUA ===
          1. Pembuka Khutbah Kedua (Teks Arab puji-pujian singkat).
          2. Wasiat Taqwa singkat (Ditulis dalam ${language}).
          3. Doa untuk kaum muslimin (Teks Arab doa + artinya wajib dalam ${language}).
          4. Penutup Khutbah Kedua.

          Ingat: Konsisten! Jika user memilih ${language}, jangan ada satu kalimat pun yang bocor menggunakan Bahasa Indonesia di bagian isi khutbah.
        `;

        // 4. Perintahkan Gemini untuk berpikir menggunakan model terbarunya
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptKhatib,
        });

        // 5. Kirim hasilnya ke frontend
        res.json({ text: response.text });

    } catch (error) {
        console.error("Terjadi error pada AI:", error);
        res.status(500).json({ error: 'Ups, AI kami sedang lelah. Silakan coba sesaat lagi.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server AI berhasil berjalan di http://localhost:${PORT}`);
});