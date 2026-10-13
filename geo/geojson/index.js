// Contoh membaca dan menampilkan data geospasial (GeoJSON) dengan CrootJS saja, tanpa
// library peta eksternal: geo.js mengurus pengambilan dan validasi datanya, map.js
// menggambarnya. Fungsi geo.js ikut diekspor dari map.js, jadi cukup satu import.
import { createMap, addGeoJSON, clearMap, fitMap, onMapClick, getGeoJSON, readGeoJSONFile, getCenter, getPropertyKeys } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.14/map.min.js";
import { onClick, onChange, getValue, setInnerText, container } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.14/element.min.js";

// Tanpa center dan zoom peta dibuka di Indonesia; begitu data masuk, tampilannya
// dipaskan ke datanya.
createMap("map");
onMapClick("map", showClick);

onClick("btn-load", loadFromURL);
onChange("file", loadFromFile);
loadFromURL();

// 1. Dari URL.
// getGeoJSON() selalu memanggil callback-nya dengan { status, data } — termasuk
// saat request gagal total — jadi "Memuat..." tidak akan pernah menggantung.
function loadFromURL() {
    setInnerText("status", "Memuat...");
    getGeoJSON(getValue("url"), showResponse);
}

function showResponse(response) {
    // status 0 berarti request tidak pernah selesai (offline, CORS ditolak,
    // atau lewat 15 detik) — bukan kode HTTP dari server.
    if (response.status === 0) {
        setInnerText("status", "Request gagal. Cek koneksi, atau server tidak mengizinkan CORS.");
        return;
    }
    if (response.status !== 200) {
        setInnerText("status", `Server membalas dengan status ${response.status}.`);
        return;
    }
    // status 200 dengan data null: balasannya ada, tapi isinya bukan GeoJSON.
    if (!response.data) {
        setInnerText("status", "Isi URL itu bukan GeoJSON.");
        return;
    }
    showData(response.data);
}

// 2. Dari file lokal.
// readGeoJSONFile() membaca file dari <input type="file">; callback-nya menerima
// FeatureCollection, atau null kalau file-nya bukan GeoJSON.
function loadFromFile() {
    readGeoJSONFile("file", (data) => {
        if (!data) {
            setInnerText("status", "File itu bukan GeoJSON.");
            return;
        }
        showData(data);
    });
}

// Apa pun sumbernya, data yang sampai di sini selalu FeatureCollection dengan
// properties berupa object, jadi feature.properties aman diakses tanpa cek null.
function showData(data) {
    // Data lama dibuang dulu, lalu data baru digambar dan tampilannya dipaskan.
    // Popup berisi properties tiap fitur sudah bawaan addGeoJSON().
    clearMap("map");
    addGeoJSON("map", data);
    fitMap("map", data);

    // center null kalau tidak ada satu pun fitur yang punya koordinat.
    const center = getCenter(data);
    if (center) {
        setInnerText("status", `${data.features.length} fitur dimuat. Titik tengah (lng, lat): ${center[0].toFixed(6)}, ${center[1].toFixed(6)}`);
    } else {
        setInnerText("status", `${data.features.length} fitur dimuat, tanpa koordinat.`);
    }

    renderTable(data);
}

// 3. Klik peta.
// position selalu [lng, lat] titik yang diklik; feature berisi fitur yang kena
// klik, atau null kalau yang diklik peta dasarnya.
function showClick(position, feature) {
    const where = `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
    setInnerText("click", feature ? `Klik di ${where} — mengenai fitur bertipe ${feature.geometry.type}.` : `Klik di ${where} — peta dasar.`);
}

// Satu kolom per nama properti. getPropertyKeys() menggabungkan nama properti dari
// semua fitur, jadi fitur yang tidak punya properti tertentu mendapat sel kosong.
function renderTable(data) {
    const keys = getPropertyKeys(data);
    container("head").replaceChildren(rowOf("th", ["#", "Tipe", ...keys]));
    container("rows").replaceChildren(...data.features.map((feature, index) => rowOf("td", [
        index + 1,
        feature.geometry ? feature.geometry.type : "(tanpa geometri)",
        ...keys.map((key) => formatValue(feature.properties[key])),
    ])));
}

// Isi sel dipasang lewat textContent, bukan innerHTML: datanya berasal dari
// URL/file sembarang, jadi tidak boleh ikut dieksekusi sebagai HTML.
function rowOf(cellTag, values) {
    const row = document.createElement("tr");
    values.forEach((value) => {
        const cell = document.createElement(cellTag);
        cell.textContent = value;
        row.appendChild(cell);
    });
    return row;
}

function formatValue(value) {
    if (value === undefined || value === null) return "";
    return typeof value === "object" ? JSON.stringify(value) : String(value);
}
