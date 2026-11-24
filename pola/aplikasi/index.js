import "../tema.js";
import { createTable } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/table.min.js";
import { createChart } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/chart.min.js";
import { toastInfo } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/toast.min.js";

// Semua angka di halaman ini data contoh.
const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format;
const tanggal = value => new Date(value).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

createChart("grafik", {
    type: "bar",
    title: "Penjualan 7 hari terakhir (data contoh)",
    labels: ["Rab", "Kam", "Jum", "Sab", "Min", "Sen", "Sel"],
    series: [{ name: "Penjualan", values: [3650000, 3910000, 4480000, 5920000, 5210000, 4075000, 4320000] }],
    height: 240,
    format: rupiah
});

const transaksi = [
    { nomor: "TRX-0412", waktu: "2026-11-24T10:42", pelanggan: "Warung Bu Tini", total: 486000, status: "Lunas" },
    { nomor: "TRX-0411", waktu: "2026-11-24T10:15", pelanggan: "Umum", total: 72500, status: "Lunas" },
    { nomor: "TRX-0410", waktu: "2026-11-24T09:58", pelanggan: "Pak Hendra", total: 315000, status: "Belum lunas" },
    { nomor: "TRX-0409", waktu: "2026-11-24T09:31", pelanggan: "Umum", total: 18000, status: "Lunas" },
    { nomor: "TRX-0408", waktu: "2026-11-24T09:02", pelanggan: "Kantin SD 2", total: 640000, status: "Dibatalkan" },
    { nomor: "TRX-0407", waktu: "2026-11-23T20:47", pelanggan: "Umum", total: 54000, status: "Lunas" },
    { nomor: "TRX-0406", waktu: "2026-11-23T19:12", pelanggan: "Warung Bu Tini", total: 228000, status: "Lunas" },
    { nomor: "TRX-0405", waktu: "2026-11-23T18:40", pelanggan: "Bu Ratna", total: 97000, status: "Belum lunas" }
];

const STATUS = { "Lunas": "success", "Belum lunas": "warning", "Dibatalkan": "danger" };
function badge(status) {
    const element = document.createElement("span");
    element.className = `badge ${STATUS[status]}`;
    element.textContent = status;
    return element;
}

createTable("transaksi", {
    label: "Transaksi terakhir (data contoh)",
    columns: [
        { key: "nomor", label: "Nomor", className: "kode" },
        { key: "waktu", label: "Waktu", format: tanggal },
        { key: "pelanggan", label: "Pelanggan" },
        { key: "total", label: "Total", className: "angka", format: rupiah },
        { key: "status", label: "Status", format: badge }
    ],
    rows: transaksi,
    pageSize: 5,
    pageSizes: [],
    sort: { key: "waktu", dir: "desc" }
});

// Tombol di pola ini tidak terhubung ke server.
document.getElementById("unduh").addEventListener("click", () => toastInfo("Contoh: laporan tidak diunduh."));
document.getElementById("baru").addEventListener("click", () => toastInfo("Contoh: form transaksi belum dibuat."));
