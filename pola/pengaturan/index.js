import { currentTheme, currentMode, setTheme, setMode } from "../tema.js";
import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.42/form.min.js";
import { toastInfo, toastSuccess } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.42/toast.min.js";

handleForm("form-profil", () => toastSuccess("Contoh: profil tidak dikirim ke server."));

document.querySelectorAll('[role="switch"]').forEach(input => input.addEventListener("change", () => {
    toastInfo(`Contoh: ${input.parentElement.textContent.trim()} ${input.checked ? "aktif" : "mati"}.`);
}));

const tema = document.getElementById("tema");
tema.value = currentTheme();
tema.addEventListener("change", () => setTheme(tema.value));

document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.checked = radio.value === currentMode();
    radio.addEventListener("change", () => setMode(radio.value));
});

for (const id of ["ganti-sandi", "keluar-semua"]) {
    document.getElementById(id).addEventListener("click", () => toastInfo("Contoh: tidak terhubung ke server."));
}

const dialog = document.getElementById("dialog-hapus");
document.getElementById("hapus").addEventListener("click", () => dialog.showModal());
dialog.addEventListener("close", () => {
    if (dialog.returnValue === "hapus") toastInfo("Contoh: akun tidak benar-benar dihapus.");
});
