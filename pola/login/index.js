import "../tema.js";
import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/form.min.js";
import { toastInfo } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/toast.min.js";

const sandi = document.getElementById("sandi");
const tombol = document.getElementById("lihat-sandi");
const ikon = tombol.querySelector(".icon");

// Nama tombol tetap; aria-pressed memberi tahu pembaca layar apakah kata sandi sedang terlihat.
tombol.addEventListener("click", () => {
    const terlihat = sandi.type === "password";
    sandi.type = terlihat ? "text" : "password";
    tombol.setAttribute("aria-pressed", String(terlihat));
    ikon.className = `icon ${terlihat ? "icon-eye-off" : "icon-eye"}`;
});

handleForm("form-masuk", data => toastInfo(`Contoh: ${data.pengguna} tidak benar-benar masuk.`), {
    messages: { sandi: { tooShort: "Kata sandi minimal 8 karakter." } }
});
