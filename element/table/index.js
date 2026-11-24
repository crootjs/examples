import { getJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.36/api.min.js";
import { setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.36/element.min.js";
import { createTable } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.36/table.min.js";

const tanggal = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });

function badge(status) {
    const span = document.createElement("span");
    span.className = `badge status-${status.toLowerCase()}`;
    span.textContent = status;
    return span;
}

function tombolDetail(row) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary detail";
    button.textContent = "Detail";
    button.setAttribute("aria-label", `Detail ${row.kode}`);
    button.addEventListener("click", () => {
        setInnerText("terpilih", `Dipilih: ${row.kode}, ${row.nama}, ketua ${row.ketua}, ${row.anggota} anggota.`);
    });
    return button;
}

const columns = [
    { key: "kode", label: "Kode" },
    { key: "nama", label: "Proyek" },
    { key: "ketua", label: "Ketua" },
    { key: "anggota", label: "Anggota", className: "angka" },
    // Tanggal disimpan ISO (2026-03-14) supaya urutannya benar; yang ditampilkan versi Indonesia.
    { key: "mulai", label: "Mulai", format: value => tanggal.format(new Date(value)) },
    { key: "status", label: "Status", format: badge },
    { label: "Aksi", format: (_, row) => tombolDetail(row) },
];

const tabel = createTable("proyek", {
    caption: "Daftar proyek (data contoh)",
    columns,
    sort: { key: "kode", dir: "asc" },
});

const { status, data } = await getJSON("data.json", null);
if (status === 200) tabel.setRows(data);
else setInnerText("terpilih", `Data contoh gagal dimuat (status ${status}).`);

// "Server" tiruan: menyaring, mengurutkan, dan memotong data contoh seperti yang dilakukan API sungguhan.
const collator = new Intl.Collator("id", { numeric: true, sensitivity: "base" });
async function ambilHalaman({ page, pageSize, sort, query }) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status !== 200) return null;
    const q = query.toLowerCase();
    let list = data.filter(row => !q || Object.values(row).some(v => String(v).toLowerCase().includes(q)));
    if (sort) {
        list = list.slice().sort((a, b) => collator.compare(String(a[sort.key]), String(b[sort.key])) * (sort.dir === "desc" ? -1 : 1));
    }
    return { rows: list.slice((page - 1) * pageSize, page * pageSize), total: list.length };
}

createTable("proyek-server", {
    caption: "Daftar proyek dari server tiruan (data contoh)",
    columns: columns.slice(0, 4),
    source: ambilHalaman,
    pageSizes: [5, 10, 20],
    pageSize: 5,
});
