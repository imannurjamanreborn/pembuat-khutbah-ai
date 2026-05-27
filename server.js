const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import modul Google Gen AI terbaru
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. Endpoint utama pembuat khutbah (Sudah Dikunci Template Syariat Lengkap)
app.post('/api/generate', async (req, res) => {
    const { topic, duration, language } = req.body;

    if (!topic) {
        return res.status(400).json({ success: false, error: 'Tema khutbah wajib diisi!' });
    }

    // === TEMPLATE UTAMA KANG IMAN (DIKUNCI MATI) ===
    const mukaddimahKhutbah1 = `اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ، وَبِهِ نَسْتَعِيْنُ عَلَى أُمُوْرِ الدُّنْيَا وَالدِّيْنِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى أَشْرَفِ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ، نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَعَلَى آلِهِ وَأَصْحَابِهِ وَالتَّابِعِيْنَ وَمَنْ تَبِعَهُمْ بِإِحْسَانٍ إِلَى يَوْمِ الدِّيْنِ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ الْمَلِكُ الْحَقُّ الْمُبِيْنُ. وَأَشْهَدُ أَنَّ سَيِّدَنَا مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ صَادِقُ الْوَعْدِ الْأَمِيْنُ. أَمَّا بَعْدُ فَيَا أَيُّهَا الْحَاضِرُوْنَ اِتَّقُوا اللهَ حَقَّ تُقَاتِهِ وَلَا تَمُوْتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُوْنَ.`;

    const fullKhutbahKedua = `اَلْحَمْدُ لِلّٰهِ عَلَى إِحْسَانِهِ وَالشُّكْرُ لَهُ عَلَى تَوْفِيْقِهِ وَاِمْتِنَانِهِ. وَأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَاللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ وَأَشْهَدُ أَنَّ سَيِّدَنَا مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ الدَّاعِى إِلَى رِضْوَانِهِ.
اَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَأَصْحَابِهِ وَسَلِّمْ تَسْلِيْمًا كَثِيْرًا. أَمَّا بَعْدُ
فَيَا أَيُّهَا النَّاسُ اِتَّقُوا اللهَ فِيْمَا أَمَرَ وَانْتَهُوْا عَمَّا نَهَى وَاعْلَمُوْا أَنَّ اللهَ أَمَرَكُمْ بِأَمْرٍ بَدَأَ فِيْهِ بِنَفْسِهِ وَثَنَّى بِمَلَائِكَتِهِ بِقُدْسِهِ. وَقَالَ تَعَالَى إِنَّ اللهَ وَمَلَائِكَتَهُ يُصَلُّوْنَ عَلَى النَّبِيِّ يٰأَيُّهَا الَّذِيْنَ آمَنُوْا صَلُّوْا عَلَيْهِ وَسَلِّمُوْا تَسْلِيْمًا.
اَللّٰهُمَّ اغْفِرْ لِلْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُوْنَنَّ مِنَ الْخَاسِرِيْنَ.
عِبَادَ اللهِ! إِنَّ اللهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيْتَاءِ ذِي الْقُرْبَى وَيَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ وَالْبَغْيِ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُوْنَ وَاذْكُرُوا اللهَ الْعَظِيْمَ يَذْكُرْكُمْ وَاشْكُرُوْهُ عَلَى نِعَمِهِ يَزِدْكُمْ وَلَذِكْرُ اللهِ أَكْبَرُ.`;

    try {
        console.log(`AI fokus merangkai materi inti Khutbah Pertama: ${topic}`);

        // 3. Instruksi Ketat: AI hanya mengisi daging khutbah pertama
        const promptMateriMurni = `
          Kamu adalah Ulama dan Khatib profesional senior. Tugasmu HANYA menyusun **Materi Inti / Isi Khutbah Pertama** saja.
          
          Peringatan: JANGAN menulis Mukaddimah Arab, hamdalah, shalawat, atau wasiat taqwa lagi karena saya sudah punya template-nya. Jangan buat Khutbah Kedua juga!
          
          === DETAIL MATERI YANG WAJIB KAMU BUAT ===
          1. Satu ayat Al-Qur'an (Teks Arab berharakat + artinya wajib dalam ${language}) yang sangat relevan dengan tema "${topic}".
          2. Pembahasan materi khutbah secara berbobot, santun, menyentuh hati, dan khusyuk menggunakan 100% ${language}. Sesuaikan panjangnya untuk durasi ${duration}.
          3. Berikan kesimpulan singkat sekaligus kalimat penutup khutbah pertama dalam ${language} sebelum khatib duduk di antara dua khutbah.
          
          Aturan Bahasa: Jika dipilih 'Sunda Lemes', wajib gunakan bahasa Sunda yang halus dan sopan. Jika 'Jawa Kromo', gunakan Jawa halus. Jangan campur aduk dengan Bahasa Indonesia!
          Langsung mulai teks pada ayat Al-Qur'an atau pembuka materi, jangan pakai judul 'Materi' atau sejenisnya.
        `;

        // 4. Panggil Gemini AI (Sangat cepat & efisien)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptMateriMurni,
        });

        const materiAI = response.text;

        // 5. Rakit naskah menjadi satu kesatuan utuh dengan format HTML rapi
        const naskahFinal = `
<div style="text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 20px; color: #198754;">
    KHUTBAH PERTAMA
</div>
<div style="text-align: right; font-size: 16pt; line-height: 2; margin-bottom: 15px; font-family: 'Times New Roman', serif;">
    ${mukaddimahKhutbah1}
</div>
<hr style="border-top: 1px dashed #ccc; margin: 20px 0;">
<div style="text-align: justify; margin-bottom: 40px;">
    ${materiAI}
</div>

<div style="text-align: center; font-weight: bold; font-size: 16pt; margin-top: 40px; margin-bottom: 20px; color: #198754;">
    KHUTBAH KEDUA
</div>
<div style="text-align: right; font-size: 16pt; line-height: 2; font-family: 'Times New Roman', serif;">
    ${fullKhutbahKedua}
</div>
        `;

        // Kirim hasil gabungan paten ke layar HP/laptop user
        res.json({ success: true, khutbah: naskahFinal });

    } catch (error) {
        console.error("Terjadi error pada AI:", error);
        res.status(500).json({ success: false, error: 'Ups, server AI sedang lelah. Silakan coba sesaat lagi.' });
    }
});

module.exports = app;