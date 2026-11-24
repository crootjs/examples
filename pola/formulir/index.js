import "../tema.js";
import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/form.min.js";
import { toastSuccess } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/toast.min.js";

handleForm("form-usaha", data => toastSuccess(`Contoh: data ${data.nama} tidak dikirim ke server.`), {
    messages: { telepon: { patternMismatch: "Tulis nomor dengan angka saja, 9 sampai 16 digit." } }
});
