import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/form.min.js";
import { onClick, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/element.min.js";
import { getLocal, setLocal } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/storage.min.js";
import { toastSuccess } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/toast.min.js";

// Tema: otomatis (ikut perangkat) -> terang -> gelap, diingat di localStorage.
const THEMES = ["otomatis", "terang", "gelap"];
const ATTRIBUTE = { terang: "light", gelap: "dark" };

function applyTheme(theme) {
    if (ATTRIBUTE[theme]) document.documentElement.dataset.theme = ATTRIBUTE[theme];
    else delete document.documentElement.dataset.theme;
    setInnerText("tema", "Tema: " + theme);
}

let theme = THEMES.includes(getLocal("contoh-tema")) ? getLocal("contoh-tema") : "otomatis";
applyTheme(theme);
onClick("tema", () => {
    theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setLocal("contoh-tema", theme);
    applyTheme(theme);
});

onClick("buka", () => document.getElementById("dialog").showModal());
handleForm("contoh", (data) => toastSuccess(`Terkirim: ${data.nama}`));

// Tombol di bagian "Ikon" hanya contoh; tombol tanpa teks tetap bernama "Cari" lewat teks visually-hidden.
onClick("ikon-unduh", () => toastSuccess("Contoh: tombol Unduh ditekan"));
onClick("ikon-cari", () => toastSuccess("Contoh: tombol Cari ditekan"));
