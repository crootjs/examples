// Contoh pemakaian SweetAlert2 bersama CrootJS.
// SweetAlert2 mengurus tampilan dialognya; CrootJS mengurus event, pembacaan
// nilai input, validasi, dan request ke backend.
import { onClick, onClicks, onInput, getValue, setInner, addCSS } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.13/element.min.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.13/api.min.js";
import { validatePhoneNumber } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.13/validate.min.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

// Handler dipasang duluan: kalau CDN CSS-nya gagal dimuat, addCSS() melempar
// error dan baris-baris setelahnya tidak pernah jalan — tombol tetap mati.
onClicks("alert-btn", showAlert);
onClick("btn-confirm", confirmDelete);
onClick("btn-form", showForm);
onClick("btn-load", loadData);

// Paket npm SweetAlert2 hanya mengirim JS lewat ES module, CSS-nya menyusul terpisah.
await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// 1. Alert dasar — satu handler untuk lima tombol sekaligus.
// onClicks() memanggil handler dengan elemen yang diklik, jadi tipe alert-nya
// cukup dititipkan di atribut data-type.
function showAlert(button) {
    const type = button.dataset.type;
    Swal.fire({
        icon: type,                                  // success, error, warning, info, question
        title: type.charAt(0).toUpperCase() + type.slice(1),
        text: `Ini contoh alert bertipe "${type}".`,
    });
}

// 2. Konfirmasi sebelum aksi yang tidak bisa dibatalkan.
// Swal.fire() mengembalikan Promise, jadi hasilnya bisa ditunggu dengan await.
async function confirmDelete() {
    const result = await Swal.fire({
        icon: "warning",
        title: "Hapus data ini?",
        text: "Aksi ini tidak dapat dibatalkan.",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
        setInner("result", "Penghapusan dibatalkan.");
        return;
    }

    // Di aplikasi sungguhan, panggilan deleteJSON() ada di sini.
    setInner("result", "Data dihapus (contoh — tidak ada backend yang dipanggil).");
    Swal.fire({ icon: "success", title: "Terhapus", text: "Data sudah dihapus." });
}

// 3. Form di dalam dialog.
// didOpen dipakai untuk memasang listener setelah markup dialog benar-benar ada
// di DOM; preConfirm menahan dialog selama inputnya belum valid.
async function showForm() {
    const { value: form } = await Swal.fire({
        title: "Daftar Peserta",
        html: `
            <input id="nama" class="swal2-input" placeholder="Nama lengkap">
            <input id="telepon" class="swal2-input" placeholder="Nomor WhatsApp">
        `,
        showCancelButton: true,
        confirmButtonText: "Daftar",
        cancelButtonText: "Batal",
        didOpen: () => {
            // Membersihkan input nomor telepon sambil diketik: non-angka dibuang
            // dan awalan 0 diganti jadi 62.
            onInput("telepon", validatePhoneNumber);
        },
        preConfirm: () => {
            const nama = getValue("nama");
            const telepon = getValue("telepon");
            if (!nama || !telepon) {
                Swal.showValidationMessage("Nama dan nomor WhatsApp wajib diisi.");
                return false;
            }
            if (telepon.length < 10) {
                Swal.showValidationMessage("Nomor WhatsApp minimal 10 digit.");
                return false;
            }
            return { nama, telepon };
        },
    });

    if (!form) {
        setInner("result", "Pendaftaran dibatalkan.");
        return;
    }

    // Di aplikasi sungguhan, panggilan postJSON() ada di sini.
    setInner("result", `Terdaftar: ${form.nama} (${form.telepon})`);
    Swal.fire({ icon: "success", title: "Berhasil", text: `${form.nama} sudah terdaftar.` });
}

// 4. Indikator loading selama request berjalan.
// allowOutsideClick dimatikan supaya dialog tidak bisa ditutup di tengah request.
function loadData() {
    Swal.fire({
        title: "Memuat data...",
        text: "Mohon tunggu sebentar.",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => Swal.showLoading(),
    });

    getJSON("data.json", showData);
}

function showData(response) {
    Swal.close();

    // status 0 berarti request gagal total (offline, DNS gagal, CORS ditolak,
    // atau lewat 15 detik) — bukan kode HTTP dari server.
    if (response.status === 0) {
        setInner("result", "Request gagal.");
        Swal.fire({ icon: "error", title: "Gagal", text: "Cek koneksi internet atau server sedang down." });
        return;
    }

    if (response.status !== 200) {
        setInner("result", `Server membalas dengan status ${response.status}.`);
        Swal.fire({ icon: "error", title: `Error ${response.status}`, text: "Data tidak bisa diambil." });
        return;
    }

    const daftar = response.data.peserta;
    setInner("result", `${daftar.length} peserta dimuat: ${daftar.map((p) => p.nama).join(", ")}`);
    Swal.fire({
        icon: "success",
        title: "Data dimuat",
        html: daftar.map((p) => `${p.nama} — ${p.kota}`).join("<br>"),
    });
}
