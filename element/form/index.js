import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.30/form.min.js";
import { fillForm, onClick, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.30/element.min.js";

// Contoh ini tidak mengirim apa pun; di aplikasi sendiri, kirim data dengan postJSON dari api.js.
handleForm("daftar", (data) => {
    delete data.sandi;
    delete data.ulang;
    setInnerText("hasil", JSON.stringify(data, null, 2));
}, {
    rules: {
        ulang: (value, all) => (value !== all.sandi ? "Kata sandi tidak sama." : null),
        minat: (value) => (value.length === 0 ? "Pilih minimal satu minat." : null),
    },
    messages: {
        setuju: "Centang persetujuan untuk melanjutkan.",
    },
});

// Data contoh, misalnya hasil getJSON untuk form edit profil.
onClick("isi", () => {
    fillForm("daftar", {
        nama: "Sari Contoh",
        email: "sari@example.com",
        hp: "6281234567890",
        peran: "dosen",
        minat: ["gis", "3d"],
        setuju: true,
    });
});
