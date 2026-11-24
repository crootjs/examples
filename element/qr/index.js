import { qrSVG } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/qr.min.js";
import { debounce } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/debounce.min.js";

const input = document.getElementById("isi");
const level = document.getElementById("ecc");
const holder = document.getElementById("qr");
const info = document.getElementById("info");
const download = document.getElementById("unduh");
let current = "";

function update() {
    const text = input.value;
    if (!text) {
        holder.replaceChildren();
        info.textContent = "Isi QR masih kosong.";
        download.disabled = true;
        return;
    }
    try {
        current = qrSVG(text, { ecc: level.value });
    } catch (error) {
        // RangeError: teks melebihi kapasitas QR terbesar (versi 40) di tingkat ini.
        if (!(error instanceof RangeError)) throw error;
        holder.replaceChildren();
        info.textContent = "Teks terlalu panjang untuk satu kode QR. Pendekkan, atau pilih tingkat koreksi yang lebih rendah.";
        download.disabled = true;
        return;
    }
    holder.innerHTML = current;
    const size = holder.querySelector("svg").viewBox.baseVal.width - 8;
    const bytes = new TextEncoder().encode(text).length;
    info.textContent = `${bytes} byte, ${size} × ${size} modul.`;
    download.disabled = false;
}

download.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([current], { type: "image/svg+xml" }));
    link.download = "kode-qr.svg";
    link.click();
    URL.revokeObjectURL(link.href);
});

input.addEventListener("input", debounce(update, 150));
level.addEventListener("change", update);
update();
