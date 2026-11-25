import "../tema.js";
import { createTable } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.43/table.min.js";
import { initTabs } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.43/tabs.min.js";
import { toastInfo } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.43/toast.min.js";

// Data contoh. Di aplikasi sungguhan daftar dan rinciannya diambil dengan api.js.
const permohonan = [
    { nomor: "SK-2026-118", pemohon: "Siti Rahmawati", jenis: "Keterangan domisili", tanggal: "2026-11-24", status: "Baru", rt: "03/07", petugas: "Belum ditentukan", keperluan: "Melamar pekerjaan di luar kota.",
        riwayat: [["2026-11-24 08:12", "Permohonan diajukan lewat loket daring"]], berkas: [["KTP.jpg", "412 KB"], ["Kartu keluarga.pdf", "1,1 MB"]] },
    { nomor: "SK-2026-117", pemohon: "Bambang Sutrisno", jenis: "Pengantar SKCK", tanggal: "2026-11-23", status: "Diproses", rt: "01/02", petugas: "Andi Pratama", keperluan: "Persyaratan pendaftaran CPNS.",
        riwayat: [["2026-11-23 09:40", "Permohonan diajukan di loket"], ["2026-11-23 10:05", "Diperiksa oleh Andi Pratama"], ["2026-11-23 13:30", "Menunggu tanda tangan lurah"]], berkas: [["KTP.jpg", "380 KB"], ["Pas foto.jpg", "220 KB"]] },
    { nomor: "SK-2026-116", pemohon: "Rina Kusuma", jenis: "Keterangan usaha", tanggal: "2026-11-22", status: "Selesai", rt: "05/07", petugas: "Andi Pratama", keperluan: "Pengajuan kredit usaha rakyat.",
        riwayat: [["2026-11-22 08:55", "Permohonan diajukan lewat loket daring"], ["2026-11-22 11:20", "Diperiksa oleh Andi Pratama"], ["2026-11-23 09:00", "Surat ditandatangani dan diambil pemohon"]], berkas: [["KTP.jpg", "401 KB"], ["Foto tempat usaha.jpg", "2,3 MB"]] },
    { nomor: "SK-2026-115", pemohon: "Joko Santoso", jenis: "Keterangan tidak mampu", tanggal: "2026-11-21", status: "Ditolak", rt: "02/04", petugas: "Maya Sari", keperluan: "Keringanan biaya sekolah anak.",
        riwayat: [["2026-11-21 10:10", "Permohonan diajukan di loket"], ["2026-11-21 14:45", "Ditolak: surat pengantar RT belum dilampirkan"]], berkas: [["KTP.jpg", "395 KB"]] },
    { nomor: "SK-2026-114", pemohon: "Dewi Lestari", jenis: "Keterangan domisili", tanggal: "2026-11-20", status: "Selesai", rt: "03/07", petugas: "Maya Sari", keperluan: "Pembukaan rekening bank.",
        riwayat: [["2026-11-20 08:30", "Permohonan diajukan lewat loket daring"], ["2026-11-20 13:15", "Surat ditandatangani"]], berkas: [["KTP.jpg", "377 KB"], ["Kartu keluarga.pdf", "980 KB"]] },
    { nomor: "SK-2026-113", pemohon: "Agus Hidayat", jenis: "Pengantar nikah", tanggal: "2026-11-19", status: "Diproses", rt: "04/01", petugas: "Andi Pratama", keperluan: "Pendaftaran pernikahan di KUA.",
        riwayat: [["2026-11-19 09:00", "Permohonan diajukan di loket"], ["2026-11-19 09:45", "Menunggu berkas calon pasangan"]], berkas: [["KTP.jpg", "402 KB"], ["Akta kelahiran.pdf", "1,4 MB"], ["Pas foto.jpg", "210 KB"]] }
];

const STATUS = { "Baru": "info", "Diproses": "warning", "Selesai": "success", "Ditolak": "danger" };
const tanggal = value => new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const detail = document.getElementById("detail");

function isiDaftar(id, items, buat) {
    document.getElementById(id).replaceChildren(...items.map(buat));
}

function tampilkan(baris, pindahFokus) {
    document.getElementById("judul-detail").textContent = baris.nomor;
    const status = document.getElementById("status-detail");
    status.textContent = baris.status;
    status.className = `badge ${STATUS[baris.status]}`;
    document.getElementById("d-pemohon").textContent = baris.pemohon;
    document.getElementById("d-jenis").textContent = baris.jenis;
    document.getElementById("d-tanggal").textContent = tanggal(baris.tanggal);
    document.getElementById("d-rt").textContent = baris.rt;
    document.getElementById("d-petugas").textContent = baris.petugas;
    document.getElementById("d-keperluan").textContent = baris.keperluan;
    isiDaftar("d-riwayat", baris.riwayat, ([waktu, kejadian]) => {
        const li = document.createElement("li");
        const time = document.createElement("time");
        time.textContent = waktu;
        li.append(time, " ", kejadian);
        return li;
    });
    isiDaftar("d-berkas", baris.berkas, ([nama, ukuran]) => {
        const li = document.createElement("li");
        const ikon = document.createElement("span");
        ikon.className = "icon icon-file";
        ikon.setAttribute("aria-hidden", "true");
        li.append(ikon, " ", nama, " ");
        const size = document.createElement("span");
        size.className = "muted";
        size.textContent = ukuran;
        li.append(size);
        return li;
    });
    const selesai = baris.status === "Selesai" || baris.status === "Ditolak";
    document.getElementById("setujui").disabled = selesai;
    document.getElementById("tolak").disabled = selesai;
    // Di ponsel rincian ada di bawah tabel; fokus dipindah supaya pembaca layar dan papan ketik ikut.
    if (pindahFokus) detail.focus();
}

createTable("daftar", {
    caption: "Daftar permohonan (data contoh)",
    columns: [
        {
            key: "nomor",
            label: "Nomor",
            format: (nomor, baris) => {
                const tombol = document.createElement("button");
                tombol.type = "button";
                tombol.className = "ghost buka";
                tombol.textContent = nomor;
                tombol.addEventListener("click", () => tampilkan(baris, true));
                return tombol;
            }
        },
        { key: "pemohon", label: "Pemohon" },
        { key: "jenis", label: "Jenis" },
        {
            key: "status",
            label: "Status",
            format: status => {
                const badge = document.createElement("span");
                badge.className = `badge ${STATUS[status]}`;
                badge.textContent = status;
                return badge;
            }
        }
    ],
    rows: permohonan,
    pageSize: 10,
    pageSizes: []
});

initTabs("tab-detail");
tampilkan(permohonan[0], false);

document.getElementById("setujui").addEventListener("click", () => toastInfo("Contoh: status tidak disimpan."));
document.getElementById("tolak").addEventListener("click", () => toastInfo("Contoh: status tidak disimpan."));
