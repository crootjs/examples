import { renderOpenAPI } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.36/openapi.min.js";
import { onChange, getValue } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.36/element.min.js";

let tampilan = null;
let giliran = 0;

async function tampilkan(berkas) {
    const link = document.getElementById("tautan-spec");
    link.href = berkas;
    link.textContent = berkas;
    // Tampilan sebelumnya dibongkar, supaya permintaan "Coba" yang masih berjalan ikut batal.
    if (tampilan) tampilan.remove();
    tampilan = null;
    // Setiap pemuatan mendapat wadah sendiri: kalau pilihan diganti lagi selagi berkas dimuat,
    // hasil yang terlambat tidak menimpa tampilan yang lebih baru.
    const ini = ++giliran;
    const wadah = document.createElement("div");
    wadah.id = `dokumentasi-${ini}`;
    document.getElementById("dokumentasi").replaceChildren(wadah);
    const hasil = await renderOpenAPI(wadah.id, berkas);
    if (ini === giliran) tampilan = hasil;
    else hasil?.remove();
}

// Spesifikasi bisa dipilih lewat alamat (?spec=github.yaml), supaya bisa ditautkan langsung.
const dariAlamat = new URLSearchParams(location.search).get("spec");
if (dariAlamat === "github.yaml") document.getElementById("pilih-spec").value = dariAlamat;

onChange("pilih-spec", () => {
    const berkas = getValue("pilih-spec");
    history.replaceState(null, "", `?spec=${berkas}`);
    tampilkan(berkas);
});

tampilkan(getValue("pilih-spec"));
