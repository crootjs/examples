import { getJSON, downloadFile } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/api.min.js";
import { setInnerText, setValue } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/element.min.js";
import { onHashChange } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/url.min.js";
import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.33/form.min.js";

// Alamat halaman = lokasi di repo: #pemilik/nama/folder/berkas.pdf. Bisa dibagikan.
const DEFAULT_REPO = "crootjs/examples";
const TYPES = {
    pdf: "application/pdf",
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
};
const TEXT = ["md", "txt", "json", "geojson", "js", "css", "html", "yml", "yaml", "csv", "xml"];
const TEXT_LIMIT = 300 * 1024;

let objectURL = null;
let current = "";

const extension = name => (name.includes(".") ? name.split(".").pop().toLowerCase() : "");
const announce = text => setInnerText("status", text);

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
}

function parseHash() {
    const parts = decodeURIComponent(location.hash.slice(1)).split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1], path: parts.slice(2).join("/") };
}

// Isi folder atau keterangan satu berkas dari GitHub API. Disimpan 5 menit; sesudahnya
// ditanyakan ulang dengan ETag, dan jawaban "belum berubah" tidak memotong kuota.
function contents(owner, repo, path) {
    return getJSON(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, null, {
        timeout: 10000,
        cache: { key: `contoh-explorer:${owner}/${repo}/${path}`, ttl: 300 },
    });
}

function showQuota(result) {
    const remaining = result.headers.get("X-RateLimit-Remaining");
    setInnerText("quota", result.cached && !remaining
        ? "Dari cache, tanpa request ke GitHub."
        : remaining ? `Sisa kuota GitHub API jam ini: ${remaining}.` : "");
}

function errorText(result) {
    if (result.status === 404) return "Repo atau folder tidak ditemukan (atau repo-nya privat).";
    if (result.status === 403 || result.status === 429) {
        const reset = Number(result.headers.get("X-RateLimit-Reset"));
        return reset
            ? `Kuota GitHub API habis. Coba lagi setelah pukul ${new Date(reset * 1000).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.`
            : "GitHub menolak permintaan ini.";
    }
    if (result.status === 0) return result.error === "offline" ? "Tidak ada koneksi internet." : "GitHub tidak bisa dihubungi.";
    return `GitHub menjawab ${result.status}.`;
}

function crumbs(owner, repo, path) {
    const links = [[`${owner}/${repo}`, `${owner}/${repo}`]];
    let walked = "";
    path.split("/").filter(Boolean).forEach(part => {
        walked += (walked ? "/" : "") + part;
        links.push([part, `${owner}/${repo}/${walked}`]);
    });
    document.getElementById("crumbs").replaceChildren(...links.map(([text, target], index) => {
        const link = document.createElement("a");
        link.href = "#" + target;
        link.textContent = text;
        if (index === links.length - 1) link.setAttribute("aria-current", "location");
        return link;
    }));
}

function listEntries(owner, repo, items, selected) {
    const sorted = items.slice().sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1));
    const list = document.getElementById("entries");
    if (!sorted.length) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Folder ini kosong.";
        list.replaceChildren(empty);
        return;
    }
    list.replaceChildren(...sorted.map(item => {
        const row = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${owner}/${repo}/${item.path}`;
        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = item.type === "dir" ? "📁" : "📄";
        const name = document.createElement("span");
        name.textContent = item.name;
        link.append(icon, name);
        if (item.type === "dir") {
            link.setAttribute("aria-label", `Folder ${item.name}`);
        } else {
            const size = document.createElement("span");
            size.className = "size";
            size.textContent = formatSize(item.size);
            link.append(size);
        }
        if (item.path === selected) link.setAttribute("aria-current", "true");
        row.append(link);
        return row;
    }));
}

function closePreview() {
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = null;
    document.getElementById("preview").hidden = true;
    document.getElementById("preview-body").replaceChildren();
}

async function showPreview(file) {
    closePreview();
    const preview = document.getElementById("preview");
    const body = document.getElementById("preview-body");
    preview.hidden = false;
    setInnerText("preview-title", file.name);
    document.getElementById("preview-link").href = file.html_url;
    const kind = extension(file.name);
    const known = TYPES[kind] || TEXT.includes(kind);
    if (!known || (TEXT.includes(kind) && file.size > TEXT_LIMIT)) {
        const note = document.createElement("p");
        note.textContent = known ? "Berkas teks ini terlalu besar untuk ditampilkan di sini." : "Pratinjau belum tersedia untuk jenis berkas ini.";
        body.replaceChildren(note);
        return;
    }
    const loading = document.createElement("p");
    loading.className = "muted";
    loading.textContent = "Memuat...";
    body.replaceChildren(loading);

    const { status, data, error } = await downloadFile(file.download_url, null, { timeout: 30000 });
    if (status !== 200) {
        loading.textContent = status === 0 ? `Gagal mengunduh (${error}).` : `Gagal mengunduh (status ${status}).`;
        return;
    }
    if (TEXT.includes(kind)) {
        const pre = document.createElement("pre");
        pre.textContent = await data.text();
        body.replaceChildren(pre);
        return;
    }
    // raw.githubusercontent.com mengirim tipe umum; tipe yang benar dipasang supaya browser
    // menampilkan PDF dan SVG, bukan mengunduhnya.
    objectURL = URL.createObjectURL(new Blob([data], { type: TYPES[kind] }));
    const save = document.createElement("a");
    save.href = objectURL;
    save.download = file.name;
    save.textContent = "Unduh berkas";
    if (kind === "pdf") {
        const frame = document.createElement("iframe");
        frame.src = objectURL;
        frame.title = file.name;
        const note = document.createElement("p");
        note.className = "muted small";
        note.append("Sebagian browser ponsel tidak menampilkan PDF di dalam halaman. ", save, ".");
        body.replaceChildren(frame, note);
    } else {
        const image = document.createElement("img");
        image.src = objectURL;
        image.alt = file.name;
        body.replaceChildren(image, save);
    }
}

async function show() {
    const place = parseHash();
    if (!place) {
        location.replace("#" + DEFAULT_REPO);
        return;
    }
    const { owner, repo, path } = place;
    const key = `${owner}/${repo}/${path}`;
    if (key === current) return;
    current = key;
    setValue("repo", `${owner}/${repo}`);
    crumbs(owner, repo, path);
    document.title = `${path || repo} - Penjelajah File GitHub`;

    const result = await contents(owner, repo, path);
    if (key !== current) return; // sudah pindah ke lokasi lain selama menunggu
    showQuota(result);
    if (result.status !== 200) {
        closePreview();
        const row = document.createElement("li");
        row.className = "empty";
        row.textContent = errorText(result);
        document.getElementById("entries").replaceChildren(row);
        announce(row.textContent);
        return;
    }
    if (Array.isArray(result.data)) {
        closePreview();
        listEntries(owner, repo, result.data, null);
        announce(`${path || repo}: ${result.data.length} item.`);
        return;
    }
    // Lokasi berupa berkas: tampilkan isi folder induknya, lalu pratinjau berkasnya.
    const parent = path.split("/").slice(0, -1).join("/");
    const folder = await contents(owner, repo, parent);
    if (key !== current) return;
    if (folder.status === 200 && Array.isArray(folder.data)) listEntries(owner, repo, folder.data, path);
    announce(`Membuka ${result.data.name}.`);
    showPreview(result.data);
}

handleForm("open", data => {
    location.hash = data.repo.trim();
});
onHashChange(show);
show();
