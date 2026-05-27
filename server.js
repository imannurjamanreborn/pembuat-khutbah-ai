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

// 2. Endpoint utama pembuat khutbah (Sudah Dikunci Template Syariat & Gaya Tafsir Ilmiah)
app.post('/api/generate', async (req, res) => {
    const { topic, duration, language } = req.body;

    if (!topic) {
        return res.status(400).json({ success: false, error: 'Tema khutbah wajib diisi!' });
    }

    // === TEMPLATE UTAMA KHUTBAH ARAB (DIKUNCI MATI) ===
    const mukaddimahKhutbah1Arab = `اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ، وَبِهِ نَسْتَعِيْنُ عَلَى أُمُوْرِ الدُّنْيَا وَالدِّيْنِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى أَشْرَفِ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ، نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَعَلَى آلِهِ وَأَصْحَابِهِ وَالتَّابِعِيْنَ وَمَنْ تَبِعَهُمْ بِإِحْسَانٍ إِلَى يَوْمِ الدِّيْنِ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ الْمَلِكُ الْحَقُّ الْمُبِيْنُ. وَأَشْهَدُ أَنَّ سَيِّدَنَا مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ صَادِقُ الْوَعْدِ الْأَمِيْنُ. أَمَّا بَعْدُ فَيَا أَيُّهَا الْحَاضِرُوْنَ اِتَّقُوا اللهَ حَقَّ تُقَاتِهِ وَلَا تَمُوْتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُوْنَ.`;

    const fullKhutbahKedua = `اَلْحَمْدُ لِلّٰهِ عَلَى إِحْسَانِهِ وَالشُّكْرُ لَهُ عَلَى tَوْفِيْقِهِ وَاِمْتِنَانِهِ. وَأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَاللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ وَأَشْهَدُ أَنَّ سَيِّدَنَا مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ الدَّاعِى إِلَى رِضْوَانِهِ.
اَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَأَصْحَابِهِ وَسَلِّمْ تَسْلِيْمًا كَثِيْرًا. أَمَّا بَعْدُ
فَيَا أَيُّهَا النَّاسُ اِتَّقُوا اللهَ فِيْمَا أَمَرَ وَانْتَهُوْا عَمَّا نَهَى وَاعْلَمُوْا أَنَّ اللهَ أَمَرَكُمْ بِأَمْرٍ بَدَأَ فِيْهِ بِنَفْسِهِ وَثَنَّى بِمَلَائِكَتِهِ بِقُدْسِهِ. وَقَالَ تَعَالَى إِنَّ اللهَ وَمَلَائِكَتَهُ يُصَلُّوْنَ عَلَى النَّبِيِّ يٰأَيُّهَا الَّذِيْنَ آمَنُوْا صَلُّوْا عَلَيْهِ وَسَلِّمُوْا تَسْلِيْمًا.
اَللّٰهُمَّ اغْفِر| لِلْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَم| تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُوْنَنَّ مِنَ الْخَاسِرِيْنَ.
عِبَادَ اللهِ! إِنَّ اللهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيْتَاءِ ذِي الْقُرْبَى وَيَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ وَالْبَغْيِ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُوْنَ وَاذْكُرُوا اللهَ الْعَظِيْمَ يَذْكُرْكُمْ وَاشْكُرُوْهُ عَلَى نِعَمِهِ يَزِدْكُمْ وَلَذِكْرُ اللهِ أَكْبَرُ.`;

    // === TEMPLATE MUKADDIMAH SUNDA KHAS KANG IMAN ===
    const mukaddimahSundaKhas = `<b>Hadirin Rohiimakumullooh</b>
Saba'dana manjatkeun puja, puji sinareng syukur ka Allah swt anu teu liren-liren teras-terasan maparin ni'mat, anugerah ka Urang sadayana anu salahsawiosna ngalangkungan ungkapan Alhamdulillaahirobil 'aalamiin, Sholawat miwah salam anu mugia saterasna dilimpah-curahkeun ka jungjunan oge panutan urang sadayana, a'ni habiibanaa wa nabiyyanaa kangjeng nabi Muhammad saw. 
Sim Kuring asma'na khotib washiat ku taqwa umum ka sadayana khususna ka diri khotib pribadi, hayu urang sasarengan teras usaha dina raragi ningkatkeun kaimanan sinareng katakwaan urang ka Allah swt, ngalangkungan teu liren berupaya ngalaksanakeun naon wae anu dipiwarangkeun ku Allah tur nebihan sanes kanten panyaram oge larangan ti Allah.`;

    // Cek apakah user memilih Sunda Lemes
    const isSunda = language.toLowerCase().includes('sunda');

    try {
        console.log(`AI merangkai materi berbasis tafsir kitab: ${topic} (${language})`);

        // 3. PROMPT BARU: MENYULAP AI MENJADI ASISTEN TAFSIR ILMIAH STRUKTURAL
        let instruksiTambahan = "";
        if (isSunda) {
            instruksiTambahan = "Peringatan Khusus: JANGAN membuat pembukaan bahasa Sunda, puji syukur, atau wasiat taqwa sunda lagi karena saya sudah punya template baku milik saya sendiri.";
        } else {
            instruksiTambahan = `Buatlah mukaddimah pengantar/wasiat taqwa singkat dalam ${language} sebelum masuk ke ayat Al-Qur'an utama.`;
        }

        const promptMateriMurni = `
          Kamu adalah seorang Ulama Ahli Peneliti Kitab Tafsir Mutabar khusyuk. Tugasmu HANYA menyusun **Materi Inti / Isi Daging Khutbah Pertama** dumasar rujukan kitab tafsir asli.
          
          Peringatan Keras: 
          - JANGAN menulis Mukaddimah Arab, hamdalah, shalawat, atau wasiat taqwa Arab lagi karena sudah dikunci otomatis di sistem.
          - JANGAN membuat naskah Khutbah Kedua!
          - JANGAN gunakan sudut pandang atau perspektif subyektif khotib ("Menurut saya", "Khotib berwasiat", dll). Fokuslah murni menyampaikan isi kutipan riwayat ilmu secara objektif.
          ${instruksiTambahan}
          
          === STRUKTUR WAJIB PENYAJIAN MATERI ===
          1. Tuliskan 1 Ayat Al-Qur'an utama (Lengkap Teks Arab berharakat + terjemahan artinya wajib dalam ${language}) yang menjadi poros utama tema "${topic}".
          2. Bedah makna terdalam dari ayat tersebut menggunakan minimal 2-3 pandangan Ulama Tafsir besar secara berurutan (Contoh rujukan: Tafsir al-Qurthubiy, Tafsir al-Baghowiy, Tafsir Ibn Katsir, atau Tafsir al-Jalalain).
          3. Setiap kali mengutip pandangan ulama tafsir, WAJIB ikuti gaya penulisan ilmiah ini:
             - Berikan kalimat pengantar penunjuk kitab (Contoh dalam Sunda: "Kasauran/Sakumaha dikutip dina tafsir al-Qurthubiy ngadugikeun...")
             - Tulis potongan pendek Teks Arab asli dari matan kitab tafsir tersebut (Lengkap dengan harakatnya).
             - Berikan terjemahan langsung dan penjelasan isi teks Arab tafsir tersebut secara gamblang menggunakan 100% ${language}.
          4. Berikan kesimpulan akhir (khulashah) yang murni merangkum poin-poin tafsir di atas (dalam ${language}) lalu tutup dengan doa kalimat transisi standar khutbah pertama ("Barakallahu lii wa lakum fil qur'anil 'adzhim...").
          
          Aturan Bahasa: Wajib konsisten menggunakan 100% bahasa ${language} yang halus (lemes), akademik, rapi, dan khidmat untuk bagian penjelasannya. Jangan campur aduk dengan bahasa lain! Langsung mulai teks pada ayat Al-Qur'an utama.
        `;

        // 4. Panggil Gemini AI
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptMateriMurni,
        });

        const materiAI = response.text;

        // 5. Gabungkan struktur secara runut berdasarkan bahasa pilihan
        let bagianIsiKhutbah1 = "";
        if (isSunda) {
            bagianIsiKhutbah1 = `${mukaddimahSundaKhas}\n\n${materiAI}`;
        } else {
            bagianIsiKhutbah1 = materiAI;
        }

        // Rakit naskah menjadi satu kesatuan format HTML final untuk dicetak
        const naskahFinal = `
<div style="text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 20px; color: #198754;">
    KHUTBAH PERTAMA
</div>
<div style="text-align: right; font-size: 16pt; line-height: 2; margin-bottom: 20px; font-family: 'Times New Roman', serif;" dir="rtl">
    ${mukaddimahKhutbah1Arab}
</div>
<hr style="border-top: 1px dashed #ccc; margin: 20px 0;">
<div style="text-align: justify; margin-bottom: 40px; line-height: 1.8;">
    ${bagianIsiKhutbah1}
</div>

<div style="text-align: center; font-weight: bold; font-size: 16pt; margin-top: 40px; margin-bottom: 20px; color: #198754;">
    KHUTBAH KEDUA
</div>
<div style="text-align: right; font-size: 16pt; line-height: 2; font-family: 'Times New Roman', serif;" dir="rtl">
    ${fullKhutbahKedua}
</div>
        `;

        res.json({ success: true, khutbah: naskahFinal });

    } catch (error) {
        console.error("Terjadi error pada AI:", error);
        res.status(500).json({ success: false, error: 'Ups, server AI sedang lelah. Silakan coba sesaat lagi.' });
    }
});

module.exports = app;