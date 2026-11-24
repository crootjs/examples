import { getJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/api.min.js";
import { setInnerText, onClick } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/element.min.js";

const URL_RILIS = "https://api.github.com/repos/crootjs/lib/releases/latest";

async function muat() {
    setInnerText("versi", "memuat...");
    const { status, data, headers, error, cached } = await getJSON(URL_RILIS, null, {
        timeout: 8000,
        cache: { key: "contoh-rilis-crootjs", ttl: 60 },
    });
    setInnerText("status", status === 0 ? `0 (${error})` : String(status));
    // Header respons hanya ada kalau request benar-benar dikirim.
    const kuota = headers.get("X-RateLimit-Remaining");
    setInnerText("cached", !cached ? "tidak" : kuota ? "ya, server menjawab 304 (belum berubah)" : "ya, tanpa request");
    setInnerText("kuota", kuota ?? "- (tidak ada request)");
    if (status === 200) setInnerText("versi", data.tag_name);
    else if (error === "offline") setInnerText("versi", "Tidak ada internet");
    else if (status === 403) setInnerText("versi", "Kuota GitHub API habis, coba lagi nanti");
    else setInnerText("versi", "Gagal memuat");
}

muat();
onClick("muat", muat);
