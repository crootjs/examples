import { startRouter } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/router.min.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/api.min.js";

// Membuat elemen dengan teks lewat textContent, supaya isi dari URL atau data tidak pernah
// dibaca sebagai HTML.
function el(tag, attributes = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    node.append(...children);
    return node;
}

function fragment(...children) {
    const result = document.createDocumentFragment();
    result.append(...children);
    return result;
}

// null kalau pengguna sudah pindah halaman (permintaan dibatalkan); handler cukup berhenti.
async function loadStudents(signal) {
    const { status, data, error } = await getJSON("data/mahasiswa.json", null, { signal });
    if (error === "abort") return null;
    if (status !== 200) return { failed: true };
    return { list: data };
}

function failure() {
    return fragment(
        el("h1", {}, "Data gagal dimuat"),
        el("p", { class: "alert danger" }, "Periksa koneksi, lalu muat ulang halaman.")
    );
}

async function studentList({ query, signal }) {
    document.title = "Mahasiswa - Dashboard";
    const result = await loadStudents(signal);
    if (!result) return;
    if (result.failed) return failure();

    const keyword = (query.get("q") || "").trim();
    const shown = result.list.filter(student => student.nama.toLowerCase().includes(keyword.toLowerCase()) || student.nim.includes(keyword));

    const input = el("input", { id: "cari", name: "q", type: "search", autocomplete: "off" });
    input.value = keyword;
    const form = el("form", { class: "cluster search", role: "search" },
        el("label", { for: "cari", class: "visually-hidden" }, "Cari nama atau NIM"),
        input,
        el("button", { type: "submit" }, "Cari")
    );
    form.addEventListener("submit", event => {
        event.preventDefault();
        const q = input.value.trim();
        router.navigate(q ? "/mahasiswa?q=" + encodeURIComponent(q) : "/mahasiswa");
    });

    const rows = shown.map(student => el("tr", {},
        el("td", {}, student.nim),
        el("td", {}, el("a", { href: router.href("/mahasiswa/" + student.nim) }, student.nama)),
        el("td", {}, student.prodi)
    ));

    return fragment(
        el("h1", {}, keyword ? `Mahasiswa: "${keyword}"` : "Mahasiswa"),
        el("p", { class: "muted" }, "Data contoh, bukan mahasiswa sungguhan."),
        form,
        shown.length
            ? el("div", { class: "table-wrap" }, el("table", {},
                el("thead", {}, el("tr", {}, el("th", { scope: "col" }, "NIM"), el("th", { scope: "col" }, "Nama"), el("th", { scope: "col" }, "Program studi"))),
                el("tbody", {}, ...rows)))
            : el("p", {}, "Tidak ada mahasiswa yang cocok.")
    );
}

async function studentDetail({ params, signal }) {
    const result = await loadStudents(signal);
    if (!result) return;
    if (result.failed) return failure();

    const student = result.list.find(item => item.nim === params.nim);
    const back = el("p", {}, el("a", { href: router.href("/mahasiswa") }, "Kembali ke daftar mahasiswa"));
    if (!student) {
        document.title = "Mahasiswa tidak ditemukan - Dashboard";
        return fragment(el("h1", {}, "Mahasiswa tidak ditemukan"), el("p", {}, `Tidak ada mahasiswa dengan NIM ${params.nim}.`), back);
    }
    document.title = student.nama + " - Dashboard";
    return fragment(
        el("h1", {}, student.nama),
        el("dl", { class: "card details" },
            el("dt", {}, "NIM"), el("dd", {}, student.nim),
            el("dt", {}, "Program studi"), el("dd", {}, student.prodi),
            el("dt", {}, "Angkatan"), el("dd", {}, String(student.angkatan))
        ),
        back
    );
}

function notFound({ path }) {
    document.title = "Halaman tidak ditemukan - Dashboard";
    return fragment(
        el("h1", {}, "Halaman tidak ditemukan"),
        el("p", {}, `Tidak ada halaman di alamat ${path}.`),
        el("p", {}, el("a", { href: router.href("/") }, "Ke beranda"))
    );
}

const router = startRouter({
    "/": {
        html: "pages/beranda.html",
        run: () => { document.title = "Beranda - Dashboard"; }
    },
    "/mahasiswa": studentList,
    "/mahasiswa/:nim": studentDetail
}, { outlet: "konten", notFound });
