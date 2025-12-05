document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const outputSection = document.getElementById('output-section');
    const outputIdTextarea = document.getElementById('output-id');
    const outputEnTextarea = document.getElementById('output-en');
    const copyButton = document.getElementById('copy-button');
    const downloadButton = document.getElementById('download-button');

    generateButton.addEventListener('click', generatePrompt);
    copyButton.addEventListener('click', copyToClipboard);
    downloadButton.addEventListener('click', downloadPrompt);

    function generatePrompt() {
        // 1. Ambil Input dari Formulir
        const persona = document.getElementById('persona').value.trim();
        const instruction = document.getElementById('instruction').value.trim();
        const context = document.getElementById('context').value.trim();
        const format = document.getElementById('format').value.trim();

        if (!instruction) {
            alert('Kolom "Instruksi" tidak boleh kosong.');
            return;
        }

        // 2. Penggabungan Awal (Draft Indonesia)
        let draftPromptId = '';

        if (persona) {
            draftPromptId += `**Peran:** Anda adalah ${persona}. `;
        }
        
        draftPromptId += `**Instruksi:** Tugas utama Anda adalah ${instruction}. `;
        
        if (context) {
            draftPromptId += `**Konteks:** ${context}. `;
        }
        
        draftPromptId += `**Format:** Sajikan output dalam format ${format}.`;

        // 3. Logika Penyempurnaan (Hardcoded Logic)
        // Logika ini menambahkan detail dan batasan berdasarkan kata kunci
        let refinement = '';
        if (format.toLowerCase().includes('json')) {
            refinement += 'Pastikan outputnya adalah *string* JSON yang valid dan lengkap. ';
        }
        if (format.toLowerCase().includes('tabel') || instruction.toLowerCase().includes('bandingkan')) {
             refinement += 'Gunakan Markdown tabel yang rapi dan memiliki kolom header yang jelas. ';
        }
        if (context.toLowerCase().includes('vip') || context.toLowerCase().includes('eksekutif')) {
            refinement += 'Jaga nada bahasa agar sangat profesional dan to the point. ';
        }

        // Terapkan refinement ke draft
        if (refinement) {
            draftPromptId += ` **Penyempurnaan:** ${refinement.trim()}`;
        }

        // 4. Proses Terjemahan (Simulasi Terjemahan untuk contoh ini)
        // DI SINI ADALAH BAGIAN KRITIS. Karena kita tidak pakai API, kita buat terjemahan statis.
        // Untuk aplikasi nyata, fungsi ini perlu diganti dengan panggilan API penerjemah (misalnya Google Translate API).
        const finalPromptEn = simpleTranslate(draftPromptId);
        
        // 5. Tampilkan Hasil
        outputIdTextarea.value = draftPromptId;
        outputEnTextarea.value = finalPromptEn;
        outputSection.classList.remove('hidden');
    }

    // Fungsi Terjemahan Dasar (Simulasi)
    function simpleTranslate(textId) {
        // Ini HANYA SIMULASI. Anda perlu mengganti ini dengan API Terjemahan yang sebenarnya
        // atau memperluas kamus terjemahan manual ini.
        let textEn = textId
            .replace('**Peran:** Anda adalah', '**Persona:** Act as a')
            .replace('**Instruksi:** Tugas utama Anda adalah', '**Instruction:** Your primary task is to')
            .replace('**Konteks:**', '**Context:**')
            .replace('**Format:** Sajikan output dalam format', '**Format:** Deliver the output in the following format:')
            // Logika Penyempurnaan juga perlu diterjemahkan secara manual jika menggunakan logika hardcoded:
            .replace('Pastikan outputnya adalah *string* JSON yang valid dan lengkap.', 'Ensure the output is a valid and complete JSON string.')
            .replace('Gunakan Markdown tabel yang rapi dan memiliki kolom header yang jelas.', 'Use a clean Markdown table with clear header columns.')
            .replace('Jaga nada bahasa agar sangat profesional dan to the point.', 'Maintain a highly professional and concise tone of voice.')
        
        // Ganti 'Anda adalah' yang mungkin muncul di input persona
        textEn = textEn.replace('Anda adalah', 'You are');

        return textEn;
    }

    function copyToClipboard() {
        // Salin HANYA konten Bahasa Inggris
        outputEnTextarea.select();
        outputEnTextarea.setSelectionRange(0, 99999); // Untuk perangkat seluler
        document.execCommand('copy');
        alert('Prompt Bahasa Inggris berhasil disalin!');
    }

    function downloadPrompt() {
        // Unduh HANYA konten Bahasa Inggris
        const filename = 'AI_Structured_Prompt.txt';
        const text = outputEnTextarea.value;
        
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
});
